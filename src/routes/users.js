const express = require("express");
const { getAll, getPurchaseHistory, checkGoogleFacebook, getProfile, updateProfile } = require("../controllers/usersController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/profile/:id", getProfile);
router.get("/purchaseHistory/:id", getPurchaseHistory);
router.post("/checkGoogleFacebook", checkGoogleFacebook);
router.post("/updateProfile/:id", updateProfile);

module.exports = router;
