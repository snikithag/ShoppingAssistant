const express = require("express");
const router = express.Router();
const pendingDealer = require("../model/pendingDealer");
const Dealer = require("../model/dealer");
const Login = require("../model/login");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

function getHash(key) {
    return bcrypt.hashSync(key, 10);
}

async function sendEmail(email, status) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "pandipanda2321@gmail.com",
            pass: "paibtajoscdqzmsj",
        },
    });

    const emailBody = `
      <p>Dear Dealer,</p>
      <p>Admin has ${status} your dealership registration with the organization.</p>
      <p>Thank you for using our service.</p>
        `;

    const mailOptions = {
        from: "pandipanda2321@gmail.com",
        to: email,
        subject: `Dealer registration | ${status}`,
        html: emailBody,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

router.get("/", async (req, res) => {
    try {
        const dealers = await Dealer.find();
        res.status(200).json({ message: "Dealers", data: dealers });
    } catch (err) {
        console.log(err);
    }
});

router.get("/pending", async (req, res) => {
    try {
        const pending = await pendingDealer.find();
        res.status(200).json({ message: "Pending dealers", data: pending });
    } catch (err) {
        console.log(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const dealer = await Dealer.findById(req.params.id);
        res.status(200).json({ message: "Dealer", data: dealer });
    } catch (err) {
        console.log(err);
    }
});

router.post("/approve/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const pending = await pendingDealer.findById(id);
        console.log(pending);
        const dealer = new Dealer({
            owner: pending.owner,
            merchandise: pending.merchandise,
            email: pending.email,
            mobile: pending.mobile,
            address: pending.address,
        });
        const hashedPassword = getHash(pending.password);
        dealer.password = hashedPassword;
        const login = new Login({ email: pending.email, password: hashedPassword, role: "dealer" });
        await pendingDealer.findOneAndDelete({ _id: id });
        await dealer.save();
        await login.save();
        await sendEmail(pending.email, "approved");
        res.status(200).json({ message: "Dealer approved" });
    } catch (err) {
        console.log(err);
    }
});

router.post("/reject/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const dealer = await pendingDealer.findById(id);
        await pendingDealer.findOneAndDelete({ _id: id });
        await sendEmail(dealer.email, "rejected");
        res.status(200).json({ message: "Dealer rejected" });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
