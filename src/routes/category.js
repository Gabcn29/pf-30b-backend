const express = require("express");
const {
  getAll,
  getOne,
  createCategory,
  modifyCategory,
  deleteCategory,
  restoreCategory,
} = require("../controllers/categoryController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/:id", getOne);
router.post("/create", createCategory);
router.put("/modify/:id", modifyCategory);
router.delete("/delete/:id", deleteCategory);
router.get("/restore/:id", restoreCategory);

module.exports = router;
