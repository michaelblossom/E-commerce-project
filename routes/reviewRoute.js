const express = require("express");
const reviewController = require("./../controllers/reviewController");
const router = express.Router();
// router.route("/").post(productController.createProduct);
router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);
module.exports = router;
