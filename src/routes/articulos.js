const express = require("express");
const {
  getAll,
  getOne,
  createItem,
  updateItem,
  deleteItem,
  restoreItem,
  populateDb,
} = require("../controllers/articulosController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/:id", getOne);
router.post("/create", createItem);
router.put("/modify/:id", updateItem);
router.delete("/delete/:id", deleteItem);
router.get("/restore/:id", restoreItem);
router.post("/populate", populateDb);

module.exports = router;
