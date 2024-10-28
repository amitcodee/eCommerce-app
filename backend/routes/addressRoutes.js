// routes/addressRoutes.js

const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { authenticateUser, authorizeRoles } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');

// Validation rules for address operations
const addressValidation = [
  check('recipientName').notEmpty().withMessage('Recipient name is required'),
  check('line1').notEmpty().withMessage('Address line 1 is required'),
  check('city').notEmpty().withMessage('City is required'),
  check('postalCode').notEmpty().withMessage('Postal code is required'),
  check('country').notEmpty().withMessage('Country is required'),
];

// Create a new address
router.post(
  '/',
  authenticateUser,
  addressValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addressController.createAddress
);

// Get all addresses for a user
router.get('/', authenticateUser, addressController.getAddresses);

// Get a specific address
router.get('/:id', authenticateUser, addressController.getAddress);

// Update an address
router.put(
  '/:id',
  authenticateUser,
  addressValidation,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addressController.updateAddress
);

// Delete an address
router.delete('/:id', authenticateUser, addressController.deleteAddress);

// Set an address as default
router.post('/:id/default', authenticateUser, addressController.setDefaultAddress);

module.exports = router;
