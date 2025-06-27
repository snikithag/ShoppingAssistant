const express = require("express");
const Order = require("../model/order");
const Cart = require("../model/cart");

const router = express.Router();

router.post("/", async (req, res) => {
    console.log(req.body);
    const order = new Order(req.body.cart);
    try {
        for (let i = 0; i < order.products.length; i++) {
            order.products[i].status = "Ordered";
        }
        console.log(order);
        await order.save();
        await Cart.findByIdAndDelete(req.body.cart._id);
        res.status(201).send({ message: "Order saved", data: order });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.get("/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 }).populate("products.product");
        res.status(200).send({ message: "Orders by user", data: orders });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

module.exports = router;
