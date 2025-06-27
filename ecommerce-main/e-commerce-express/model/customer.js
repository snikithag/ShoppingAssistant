const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Customer", customerSchema);
