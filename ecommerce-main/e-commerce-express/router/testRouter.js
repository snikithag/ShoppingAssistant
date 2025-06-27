const router = require("express").Router();
require("dotenv").config();

router.get("/", (req, res) => {
    res.send("Hello World from test router: ");
});

module.exports = router;