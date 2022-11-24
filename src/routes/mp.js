const express = require("express");
const { createOrder } = require("../controllers/mercadoPagoController.js");

const router = express.Router();

router.post("/createOrder", createOrder);

module.exports = router;
