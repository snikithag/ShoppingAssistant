const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                },
                status: String,
            },
        ],
        orderId: String,
        subtotal: String,
        taxes: String,
        total: String,
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
