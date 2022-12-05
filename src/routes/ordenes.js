const express = require("express");
const { getAll, updateOrder } = require("../controllers/ordenesController");

const router = express.Router();

router.get("/getAll", getAll);
router.post("/update/:id", updateOrder);

module.exports = router;
