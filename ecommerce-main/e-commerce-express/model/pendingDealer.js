const { default: mongoose } = require("mongoose");

const pendingDealerSchema = new mongoose.Schema({
    owner: String,
    merchandise: String,
    mobile: String,
    email: String,
    address: String,
    password: String,
});

module.exports = mongoose.model("pendingDealer", pendingDealerSchema);
