const express = require("express");
const {
  createReview,
  getReviews,
  editReview,
  reportReview,
  getAllReviews,
} = require("../controllers/reviewsController");

const router = express.Router();

router.get("/reviews/:id", getReviews);
router.get("/allreviews/", getAllReviews);
router.post("/reviews/edit/:id", editReview);
router.post("/reviews/report/:id", reportReview);
router.post("/addReview", createReview);

module.exports = router;
