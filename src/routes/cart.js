const express = require("express");
const { getCart, updateCart } = require("../controllers/cartController");

const router = express.Router();

router.post("/getCart", getCart);
router.post("/updateCart", updateCart);

module.exports = router;
