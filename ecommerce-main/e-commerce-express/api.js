const express = require("express");
const cors = require("cors");
const testRouter = require("./router/testRouter");
const authRouter = require("./router/authRouter");
const dealerRouter = require("./router/dealerRouter");
const productRouter = require("./router/productRouter");
const cartRouter = require("./router/cartRouter");
const orderRouter = require("./router/orderRouter");
const replacementRouter = require("./router/replacementRouter");
const { default: mongoose } = require("mongoose");
require("dotenv").config();
const PORT = process.env.PORT || 8888;

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.log("Error connecting to MongoDB", error);
    });

const app = express();
app.use(cors());
app.use(express.json());

app.use("/test-api", testRouter);
app.use("/auth", authRouter);
app.use("/dealer", dealerRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/replacement", replacementRouter);


app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
