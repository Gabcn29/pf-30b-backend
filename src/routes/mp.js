const express = require("express");
const { createOrder, checkPurchase } = require("../controllers/mercadoPagoController.js");

const router = express.Router();

router.post("/createOrder", createOrder);
router.get("/checkPurchase/:id", checkPurchase);

module.exports = router;
