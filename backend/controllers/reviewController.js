const Review = require("../models/reviewModel"); // Import the Review model

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { rating, title, content } = req.body;
    const customer = req.user._id; // Assuming `req.user` contains the authenticated user's info

    // Create the review
    const review = new Review({
      customer,
      rating,
      title,
      content,
    });

    await review.save();

    res.status(201).json({ message: "Review created successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error creating review", error });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("customer", "name email");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found" });
    }

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Get a single review by ID
exports.getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).populate("customer", "name email");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error });
  }
};

// Update review (only by the customer who created it)
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, content } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the creator of the review
    if (review.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to update this review" });
    }

    // Update the review
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.content = content || review.content;

    await review.save();

    res.status(200).json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

// Delete review (only by the customer who created it or an admin)
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if the user is the creator of the review or an admin
    if (review.customer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this review" });
    }

    await review.remove();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};
