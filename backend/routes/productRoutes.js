const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Middleware for authentication and authorization
const {
  authenticateUser,
  authorizeRoles,
} = require('../middlewares/authMiddleware');

// Multer and image processing middlewares
const { upload, processImages } = require('../middlewares/multer');

// Routes for products

// Create a new product (admin only)
router.post(
  '/create',
  authenticateUser,
  // authorizeRoles, // Uncomment this if authorization is implemented
  upload.array('images', 10), // Adjust field name and max count as needed
  processImages,
  productController.createProduct
);

// Get all products
router.get('/get-products', productController.getProducts);

// Get a single product by ID
router.get('/:slug', productController.getProductById);

// Update a product (admin only)
router.put(
  '/update/:id',
  authenticateUser,
  // authorizeRoles, // Uncomment this if authorization is implemented
  upload.array('images', 10),
  processImages,
  productController.updateProduct
);

// Delete a product (admin only)
router.delete(
  '/delete/:id',
  authenticateUser,
  // authorizeRoles, // Uncomment this if authorization is implemented
  productController.deleteProduct
);

// Route to get similar products
router.get('/similar/:id', productController.getSimilarProducts);

// Get products by category
router.get('/category/:category', productController.getbyCategory);

// Search products by keyword
router.get('/search/:keyword', productController.searchProducts);

module.exports = router;
