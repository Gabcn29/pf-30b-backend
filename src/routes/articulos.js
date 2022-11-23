const express = require("express");
const { getAll, getOne, createItem } = require("../controllers/articulosController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/:id", getOne);
router.post("/createItem", createItem);

module.exports = router;
