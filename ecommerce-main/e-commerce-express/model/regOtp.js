const { default: mongoose } = require("mongoose");

const regOtpSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("regOtp", regOtpSchema);
