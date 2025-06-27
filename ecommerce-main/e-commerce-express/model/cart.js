const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
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
                    default: 1, // You can set a default value for quantity if necessary
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
