const express = require("express");
const { getAll, getOne } = require("../controllers/categoryController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/:id", getOne);

module.exports = router;
