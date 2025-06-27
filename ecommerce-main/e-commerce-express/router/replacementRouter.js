const router = require("./testRouter");
const Replacement = require("../model/replacement");
const Order = require("../model/order");

router.get("/:dealerId", async (req, res) => {
    try {
        const replacements = await Replacement.find({ ownerId: req.params.dealerId })
            .sort({ createdAt: -1 })
            .populate("ownerId")
            .populate("productId")
            .populate("userId");
        res.status(200).json({ message: "Replacement requests", data: replacements });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.put("/:id/:status", async (req, res) => {
    try {
        const replacement = await Replacement.findById(req.params.id);
        replacement.status = req.params.status;
        const order = await Order.findOne({ orderId: replacement.orderId, userId: replacement.userId });
        console.log(order);
        for (let i = 0; i < order.products.length; i++) {
            if (order.products[i].product.equals(replacement.productId)) {
                order.products[i].status = req.params.status;
            }
        }
        await order.save();
        await replacement.save();
        res.status(200).json({ message: "Replacement request updated", data: replacement });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        let existing = await Replacement.findOne({ userId: req.body.userId, productId: req.body.productId, orderId: req.body.orderId });
        if (existing) {
            return res.status(400).json({ message: "Replacement request already raised" });
        }
        console.log("req ", req.body);
        let replacement = new Replacement(req.body);
        console.log("rep ", replacement);
        const order = await Order.findOne({ orderId: replacement.orderId });
        console.log(order);

        for (let i = 0; i < order.products.length; i++) {
            console.log(order.products[i].product.equals(replacement.productId));
            if (order.products[i].product.equals(replacement.productId)) {
                order.products[i].status = "pending";
            }
        }
        await order.save();
        replacement = await replacement.save();
        res.status(201).json({ message: "Replacement request raised", data: replacement });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
