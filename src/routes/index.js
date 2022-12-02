const express = require("express");
const articulos = require("./articulos.js");
const category = require("./category.js");
const users = require("./users.js");
const mp = require("./mp.js");
const platziApi = require("./platziApi");
const mm = require("./mm.js");
const cart = require("./cart.js");
const wishlist = require("./wishlist");
const router = express.Router();

router.use("/articulo", articulos);
router.use("/category", category);
router.use("/users", users);
router.use("/mercadoPago", mp);
router.use("/metaMask", mm);
router.use("/platziApi", platziApi);
router.use("/cart", cart);
router.use("/wishlist", wishlist);

module.exports = router;
