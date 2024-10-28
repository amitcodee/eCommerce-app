const mongoose = require("mongoose");

// Define the Variant Schema for product variants (size, color, price, and barcode)
const variantSchema = new mongoose.Schema(
  {
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Size",
      required: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
     sellingPrice: {
      type: Number,
      min: 0,
      required: true,
    },
    costPrice: {
      type: Number,
      min: 0,
      required: true,
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,
    },
    barcode: {
      type: String,
      unique: true, // Ensure each variant has a unique barcode
      required: true, // Set barcode as required
    },
    barcodeImagePath: {
      type: String, // Store the path to the barcode image
    },
  },
  { _id: true }
);

// Define the main product schema
const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: String,
    shortDescription: String,
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    variants: [variantSchema], // Now variants will store size, color, price, barcode, and quantity
    minQuantity: {
      type: Number,
      default: 0,
    },
    maxQuantity: Number,
    shippingClass: String,
    images: [
      {
        url: String,
        altText: String,
        isFeatured: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "out_of_stock", "discontinued"],
      default: "active",
    },
    sale: {
      type: String,
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    dateAvailable: Date,
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    dateModified: Date,
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/ /g, "-");
  next();
});

module.exports = mongoose.model("Product", productSchema);
