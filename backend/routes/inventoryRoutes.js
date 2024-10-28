const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Add stock (incoming inventory)
router.post('/inventory/add', inventoryController.addStock);

// Remove stock (outgoing inventory)
router.post('/inventory/remove', inventoryController.removeStock);

// Adjust inventory
router.post('/inventory/adjust', inventoryController.adjustInventory);

// Get inventory records by product
router.get('/inventory/product/:productId', inventoryController.getInventoryByProduct);

// Get all inventory records (optional)
router.get('/inventory/all', inventoryController.getAllInventoryRecords);


router.put('/inventory/:inventoryId', inventoryController.updateInventoryRecord);
router.delete('/inventory/:inventoryId', inventoryController.deleteInventoryRecord);

// Route to get sold products
router.get('/inventory/sold-products', inventoryController.getSoldProducts);
module.exports = router;
