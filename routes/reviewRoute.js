const express = require("express");
const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const router = express.Router();
router.use(authController.protect); // this will protect all the middlewares under it from users that are not logged in

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(authController.restrictTo("user"), reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(authController.restrictTo("user"), reviewController.updateReview)
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );
module.exports = router;
