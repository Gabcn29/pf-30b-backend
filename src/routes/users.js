const express = require("express");
const { getAll, getPurchaseHistory, checkGoogleFacebook } = require("../controllers/usersController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/purchaseHistory/:id", getPurchaseHistory);
router.post("/checkGoogleFacebook", checkGoogleFacebook);

module.exports = router;
