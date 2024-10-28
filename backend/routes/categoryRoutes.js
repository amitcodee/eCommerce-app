const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const categoryController = require("../controllers/categoryController");
const { upload, processImage } = require("../middlewares/upload");


// Validation rules
const validateCategory = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  // Add more validations if needed
];

// Routes

// Create a new category with image upload
router.post(
  "/create",
  upload.single("image"), // Only single image upload allowed for 'image' field
  processImage,          // Converts image to WebP before saving
  validateCategory,
  categoryController.createCategory
);

// Get all categories
router.get("/", categoryController.getCategories);

// Get a single category by ID
router.get("/:id", categoryController.getCategoryById);

// Update a category by ID with optional image upload
router.put(
  "/update/:id",
  upload.single("image"), // Only single image upload allowed for 'image' field
  processImage,          // Converts image to WebP before saving
  validateCategory,
  categoryController.updateCategory
);

// Delete a category by ID
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
