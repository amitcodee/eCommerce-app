const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse',
  },
  movementType: {
    type: String,
    enum: ['in', 'out', 'adjustment', 'return', 'transfer'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  previousQuantity: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Inventory', inventorySchema);
