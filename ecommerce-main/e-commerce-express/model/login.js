const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            required: true,
        },
        otp: String,
        token: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Login", loginSchema);
