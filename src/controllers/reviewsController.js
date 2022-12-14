const { Review, Article } = require("../db");

const createReview = async (req, res, next) => {
  const { username, rating, review, image = "xd", item } = req.body;
  try {
    if (!rating)
      return res.status(500).send("Se requiere establecer una puntuacion");
    let newReview = await Review.create({
      username,
      rating,
      review,
      image,
      reports: [],
      reportedBy: [],
    });
    let articleDb = await Article.findByPk(item);
    console.log(articleDb);
    await articleDb.addReview(newReview);
    console.log(articleDb);

    res.send("ok");
  } catch (error) {
    next(error);
  }
};

const getReviews = async (req, res, next) => {
  const { id } = req.params;
  if (isNaN(id))
    return res.status(400).json({ message: "ID must be a number" });
  try {
    const articulo = await Article.findByPk(id);
    const Reviews = await articulo.getReviews();

    if (Reviews) {
      return res.status(200).json({ message: "Reviews obtained", Reviews });
    } else {
      return res.status(404).json({ message: "No reviews found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const getAllReviews = async (req, res, next) => {
  console.log("ayudavoyallorar");
  const AllReviews = await Review.findAll();
  console.log(AllReviews);
  try {
    console.log("ayudavoyallorar");
    if (AllReviews) {
      return res.status(200).json({ message: "Reviews obtained", AllReviews });
    } else {
      return res.status(404).json({ message: "No reviews found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const editReview = async (req, res, next) => {
  const { id } = req.params;
  const { rating, review } = req.body;
  console.log(req.body);
  console.log(id);
  try {
    const reviewtoEdit = await Review.findByPk(id);
    if (reviewtoEdit) {
      Review.update({ rating: rating, review: review }, { where: { id: id } });
      return res.status(200).json({ message: "Review modddified", review });
    } else {
      return res.status(404).json({ message: "No review found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const reportReview = async (req, res, next) => {
  const { id } = req.params;
  const { reports, reportedBy } = req.body;
  console.log(req.body);
  console.log(id);
  try {
    const reviewtoEdit = await Review.findByPk(id);
    reviewtoEdit.reports.push(reports);
    reviewtoEdit.reportedBy.push(reportedBy);
    console.log(reviewtoEdit.reports);
    console.log(reviewtoEdit.reportedBy);
    if (reviewtoEdit) {
      Review.update(
        { reports: reviewtoEdit.reports, reportedBy: reviewtoEdit.reportedBy },
        { where: { id: id } }
      );
      console.log(reviewtoEdit);
      return res.status(200).json({ message: "Review reported", reviewtoEdit });
    } else {
      return res.status(404).json({ message: "No review found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = {
  createReview,
  getReviews,
  getAllReviews,
  editReview,
  reportReview,
};
