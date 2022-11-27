const express = require("express");
const {
  getAll,
  getOne,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/articulosController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/:id", getOne);
router.post("/create", createItem);
router.put("/modify", updateItem);
router.delete("/delete", deleteItem);

module.exports = router;
