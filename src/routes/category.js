const express = require("express");
const {
  getAll,
  getOne,
  createCategory,
  modifyCategory,
  deleteCategory,
} = require("../controllers/categoryController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/:id", getOne);
router.post("/create", createCategory);
router.put("/modify", modifyCategory);
router.delete("/delete", deleteCategory);

module.exports = router;
