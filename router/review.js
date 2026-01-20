const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/reviews");

// CREATE REVIEW
router.route("/")
  .post(
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
  );

// DELETE REVIEW
router.route("/:reviewId")
  .delete(
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
  );

module.exports = router;
