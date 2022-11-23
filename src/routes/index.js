const express = require("express");
const articulos = require("./articulos.js");
const category = require("./category.js");
const router = express.Router();

router.use("/articulo", articulos);
router.use("/category", category);

module.exports = router;
