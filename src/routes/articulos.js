const express = require("express");
const { getAll, getOne, createItem, rellenarBase } = require("../controllers/articulosController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/:id", getOne);
router.post("/createItem", createItem);
router.get("/rellenarBase", rellenarBase);

module.exports = router;
