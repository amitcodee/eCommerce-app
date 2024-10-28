const express = require("express");
const router = express.Router();
const { createReview, getAllReviews, getReviewById, updateReview, deleteReview } = require("../controllers/reviewController");
const { authenticateUser } = require("../middlewares/authMiddleware");

// Route to create a review (Authenticated users)
router.post("/create", authenticateUser, createReview);

// Route to get all reviews
router.get("/get-reviews", getAllReviews);

// Route to get a specific review by its ID
router.get("/:reviewId", getReviewById);

// Route to update a review (only the creator of the review can update)
router.put("/:reviewId", authenticateUser, updateReview);

// Route to delete a review (only the creator or admin can delete)
router.delete("/:reviewId", authenticateUser, deleteReview);

module.exports = router;
