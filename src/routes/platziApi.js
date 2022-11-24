const express = require("express");
const { rellenarBase } = require("../controllers/platziApiController.js");

const router = express.Router();

router.get("/rellenarBase", rellenarBase);

module.exports = router;
