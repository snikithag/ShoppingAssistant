const express = require("express");
const Cart = require("../model/cart");
const router = express.Router();

router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const cart = await Cart.findOne({ userId }).populate("products.product");
        console.log(cart);
        res.status(200).send({ message: "Cart items", data: cart });
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

router.post("/", async (req, res) => {
    const { userId, productId, quantity } = req.body;
    console.log(req.body);
    try {
        let cart = await Cart.findOne({ userId });
        console.log(cart);
        if (cart) {
            let itemIndex = cart.products.findIndex((p) => p.product == productId);
            if (itemIndex > -1) {
                let productItem = cart.products[itemIndex];
                productItem.quantity += quantity;
                cart.products[itemIndex] = productItem;
            } else {
                cart.products.push({ product: productId, quantity });
            }
            cart = await cart.save();
            return res.status(201).send(cart);
        } else {
            const newCart = new Cart(req.body);
            newCart.products.push({ product: productId, quantity });
            await newCart.save();
            return res.status(201).send({ message: "added to card", data: newCart });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.delete("/:userId/:productId", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    try {
        const cart = await Cart.findOne({ userId });
        const itemIndex = cart.products.findIndex((p) => p._id == productId);
        if (itemIndex > -1) {
            cart.products.splice(itemIndex, 1);
            await cart.save();
            res.status(200).send({ message: "Item deleted", data: cart });
        } else {
            res.status(404).send({ message: "Item not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

router.put("/:userId/:productId", async (req, res) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    const { quantity } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        const itemIndex = cart.products.findIndex((p) => p._id == productId);
        console.log("index: ", itemIndex);
        if (itemIndex > -1) {
            cart.products[itemIndex].quantity = quantity;
            console.log("updated card: ", cart);
            await cart.save();
            res.status(200).send({ message: "Item updated", data: cart });
        } else {
            res.status(404).send({ message: "Item not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;
