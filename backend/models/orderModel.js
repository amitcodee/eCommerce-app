const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        ref: "Product",
        required: true,
      },
      variant: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Variant model (if exists)
        ref: "Variant",
        required: false, // Variant might be optional based on your product structure
      },
      size: {
        type: String,
        required: true, // Make this required to ensure size is always provided
      },
      color: {
        type: String,
        required: true, // Make this required to ensure color is always provided
      },
      price: {
        type: Number,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "shipped", "cancelled"],
    default: "pending",
  },
  barcodeImagePath: {
    type: String, // Path to the barcode image
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
