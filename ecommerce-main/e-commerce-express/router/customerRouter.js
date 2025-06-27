const express = require("express");
const router = express.Router();
const Customer = require("../model/customer");
const Login = require("../model/login");

router.post("/registration", async (req, res) => {
    try {
        const customer = new Customer(req.body);
        let ecustomer = await Customer.findOne({ email: customer.email });
        if (ecustomer != null) {
            res.status(400).json({
                message: `Customer already exists with email: ${customer.email}`,
            });
        } else {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(customer.password, saltRounds);
            customer.password = hashedPassword;
            const login = new Login({ email: customer.email, password: customer.password, role: "customer" });
            await login.save();
            await customer.save();
            res.status(201).json({ message: "Registration successful" });
        }
    } catch (err) {
        res.status(500).json({ message: "Failed to register user", error: err.message });
    }
});

module.exports = router;
