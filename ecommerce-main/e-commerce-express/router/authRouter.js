const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Login = require("../model/login");
const Dealer = require("../model/dealer");
const Customer = require("../model/customer");
const nodemailer = require("nodemailer");
const RegOtp = require("../model/regOtp");
const PendingDealer = require("../model/pendingDealer");
const { generateToken } = require("../util/jwtUtil");

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000);
}

function getHash(key) {
    return bcrypt.hashSync(key, 10);
}

async function sendEmail(email, otp) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "snikitha560@gmail.com",
            pass: "olnb snfg pzvj xcuc",
        },
    });

    const emailBody = `
      <p>Dear User,</p>
      <p>Please use the following One-Time Password (OTP):</p>
      <h3>${otp}</h3>
      <p>Thank you for using our service.</p>
        `;

    const mailOptions = {
        from: "snikitha560@gmail.com",
        to: email,
        subject: "OTP for Authentication",
        html: emailBody,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.log(info.response)
        console.error("Error sending email:", error);
    }
}

router.post("/request-otp", async (req, res) => {
    try {
        const { email, role } = req.body;
        let otp = generateOtp();
        console.log(otp);
        const login = await Login.findOne({ email: email, role: role });
        if (login == null) {
            const hashedOtp = getHash(otp.toString());
            const regOtp = new RegOtp({ email: email, otp: hashedOtp });
            await regOtp.save();
            await sendEmail(email, otp);
            res.status(200).json({ message: `OTP sent to ${email}`, data: { otp } });
        } else {
            res.status(406).json({ message: `${email} is already registered` });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

router.post("/verify-otp", async (req, res) => {
    try {
        const { username, email, password, role, otp } = req.body;
        const regOtp = await RegOtp.findOne({ email: email });
        if (regOtp != null) {
            if (bcrypt.compareSync(otp.toString(), regOtp.otp)) {
                await RegOtp.deleteOne({ email: email });
                const hashedPassword = getHash(password);
                const login = new Login({ email: email, password: hashedPassword, role: role });
                const customer = new Customer({ username, email, password: hashedPassword });
                await login.save();
                await customer.save();
                res.status(200).json({ message: "Registration successful" });
            } else res.status(400).json({ message: "Incorrect OTP" });
        } else {
            res.status(404).json({ message: `${role} not found with email: ${email}` });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/verify-dealer-otp", async (req, res) => {
    try {
        const { email, otp } = req.body;
        const regOtp = await RegOtp.findOne({ email: email });
        if (regOtp != null) {
            if (bcrypt.compareSync(otp.toString(), regOtp.otp)) {
                await RegOtp.deleteOne({ email: email });
                res.status(200).json({ message: "OTP Verified" });
            } else {
                res.status(400).json({ message: "Incorrect OTP" });
            }
        } else res.status(404).json({ message: `Dealer not found with email: ${email}` });
    } catch (err) {
        console.log(err);
    }
});

router.post("/submit-dealer-request", async (req, res) => {
    try {
        const dealer = new PendingDealer(req.body);
        dealer.save();
        res.status(200).json({ message: "Dealer request submitted" });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post("/reset-password", async (req, res) => {
    try {
        const { email, role, password } = req.body;
        const login = await Login.findOne({ email, role });

        const hashedPassword = getHash(password);

        if (role == "customer") {
            const owr = await Customer.findOne({ email });
            owr.password = hashedPassword;
            await owr.save();
        }
        login.password = hashedPassword;
        await login.save();
        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        res.send(err);
    }
});

router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await Login.findOne({ email });
        if (!user) return res.status(401).json({ message: `${role} not found with email: ${email} ` });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: `Incorrect password for ${email}` });
        if (role != user.role) return res.status(401).json({ message: `${role} not found with email: ${email} ` });
        const otp = generateOtp().toString();
        user.otp = getHash(otp);
        await user.save();
        await sendEmail(email, otp);
        res.status(200).json({ message: "Login Successful", data: { otp } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error while login" });
    }
});

router.post("/verify-login", async (req, res) => {
    const { email, role, otp } = req.body;
    try {
        const user = await Login.findOne({ email, role });
        if (bcrypt.compareSync(otp.toString(), user.otp)) {
            const token = generateToken({ userId: user._id, role: user.role, email: user.email });
            let id = "";
            if (role == "dealer") {
                const dealer = await Dealer.findOne({ email });
                id = dealer._id;
            } else if (role == "customer") {
                const customer = await Customer.findOne({ email });
                id = customer._id;
            } else {
                id = user._id;
            }
            user.otp = null;
            user.token = token;
            await user.save();
            res.status(200).json({ message: "Login Successful", data: { email, role, token, id } });
        } else {
            res.status(401).json({ message: "Incorrect OTP" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error while login" });
    }
});

router.post("/forgot-password-otp", async (req, res) => {
    try {
        const { email, role } = req.body;
        let otp = generateOtp();
        console.log(otp);
        const login = await Login.findOne({ email, role });
        if (login != null) {
            const hashedOtp = getHash(otp.toString());
            login.otp = hashedOtp;
            console.log(login);
            await login.save();
            await sendEmail(email, otp);
            res.status(200).json({ message: `OTP sent to ${email}`, data: { otp } });
        } else {
            res.status(406).json({ message: `${email} is not registered` });
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

router.post("/verify-reset-otp", async (req, res) => {
    const { email, role, otp } = req.body;
    try {
        const user = await Login.findOne({ email, role });
        console.log(user);
        if (bcrypt.compareSync(otp.toString(), user.otp)) {
            user.otp = null;
            await user.save();
            res.status(200).json({ message: "OTP Verified", data: { email, role } });
        } else {
            res.status(401).json({ message: "Incorrect OTP" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error while verification" });
    }
});
module.exports = router;
