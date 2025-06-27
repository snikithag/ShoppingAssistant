const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const authMiddleware = require("../util/authMiddleware");
const Order = require("../model/order");

router.get("/", authMiddleware, async (req, res) => {
    try {
        //declare a map<key, value> in js
        let productMap = new Map();

        let products = await Product.find();

        let orders = await Order.find();
        console.log("orders: ", orders);
        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].products.length; j++) {
                let product = orders[i].products[j];
                let key = product.product.toString();
                if (productMap.has(key)) {
                    productMap.set(key, productMap.get(key) + product.quantity);
                } else {
                    productMap.set(key, product.quantity);
                }
            }
        }
        console.log("map: ", productMap);
        // limit popular products to 5

        let popularProducts = products.slice().filter((product) => productMap.get(product._id.toString()) > 0).slice(0, 5);
        popularProducts = popularProducts
            .slice()
            .sort((a, b) => productMap.get(b._id.toString()) - productMap.get(a._id.toString()))
        products = products.slice().sort((a, b) => b.createdAt - a.createdAt);
        res.status(200).json({ message: "Products", data: { products, popularProducts, map: Object.fromEntries(productMap) } });
    } catch (err) {
        console.log(err);
    }
});

router.get("/byDealer/:id", authMiddleware, async (req, res) => {
    try {
        let products = await Product.find({ owner: req.params.id });
        res.status(200).json({ message: "Products", data: { products } });
    } catch (err) {
        console.log(err);
    }
});

router.post("/", async (req, res) => {
    try {
        let product = new Product(req.body);
        product = await product.save();
        res.status(201).json({ message: "Product created", data: { product } });
    } catch (err) {
        console.log(err);
    }
});

router.get("/:id", async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        res.status(200).json({ message: "Product", data: { product } });
    } catch (err) {
        console.log(err);
    }
});

router.put("/:id", async (req, res) => {
    try {
        let product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: "Product updated", data: { product } });
    } catch (err) {
        console.log(err);
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
