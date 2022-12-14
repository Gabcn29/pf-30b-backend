const express = require("express");
const {
  insert,
  getAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/addressController.js");

const router = express.Router();


router.get("/getAllAddresses", getAddress);
router.post("/insert", insert);
router.put("/modify/:id", updateAddress);
router.delete("/delete/:id", deleteAddress);


module.exports = router;
