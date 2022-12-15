const express = require("express");
const { getAll, getPurchaseHistory, checkGoogleFacebook, getProfile, updateProfile, deleteProfile, restoreUser } = require("../controllers/usersController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/profile/:id", getProfile);
router.get("/purchaseHistory/:id", getPurchaseHistory);
router.post("/checkGoogleFacebook", checkGoogleFacebook);
router.post("/updateProfile/:id", updateProfile);
router.delete("/deleteProfile/:id", deleteProfile);
router.get("/restoreProfile/:id", restoreUser);

module.exports = router;
