const express = require("express");
const {
  getAll,
  getOne,
  createItem,
  updateItem,
  deleteItem,
  restoreItem,
  populateDb,
  createReview,
  getReviews,
  editReview,
  reportReview,
  getAllReviews,
} = require("../controllers/articulosController.js");

const router = express.Router();

router.get("/getAll", getAll);
router.get("/:id", getOne);
router.get("/reviews/:id", getReviews)
router.get("/allreviews/", getAllReviews)
router.post("/reviews/edit/:id", editReview)
router.post("/reviews/report/:id", reportReview)
router.post("/create", createItem);
router.post("/addReview", createReview);
router.put("/modify/:id", updateItem);
router.delete("/delete/:id", deleteItem);
router.get("/restore/:id", restoreItem);
router.post("/populate", populateDb);

module.exports = router;
