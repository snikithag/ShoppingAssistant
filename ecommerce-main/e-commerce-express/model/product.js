const mongoose = require("mongoose");

// Define the schema for the product
const productSchema = new mongoose.Schema({
    owner: String,
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: String,
    brand: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    stockQuantity: {
        type: Number,
        required: true,
        default: 10000,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model using the product schema
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
