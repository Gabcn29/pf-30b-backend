const express = require("express");
const {
  assignItem,
  getUserList,
  deleteItem,
} = require("../controllers/wishlistController");

const router = express.Router();

router.post("/assign", assignItem);
router.get("/user/:id", getUserList);
router.delete("/delete/:id", deleteItem);

module.exports = router;
