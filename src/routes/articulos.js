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
router.post("/createItem", createItem);
router.put("/updateItem", updateItem);
router.delete("/deleteItem", deleteItem);

module.exports = router;
