const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    title: String,
    content: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", reviewSchema);
