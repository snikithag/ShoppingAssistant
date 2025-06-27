const { default: mongoose } = require("mongoose");

const replacementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "dealer",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    orderId: String,
    reason: String,
    status: {
        type: String,
        default: "pending",
    },
});

module.exports = mongoose.model("replacement", replacementSchema);
