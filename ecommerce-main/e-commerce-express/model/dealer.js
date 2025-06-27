const { default: mongoose } = require("mongoose");

const dealerSchema = new mongoose.Schema({
    owner: String,
    merchandise: String,
    mobile: String,
    email: String,
    address: String,
    password: String,
});

module.exports = mongoose.model("dealer", dealerSchema);
