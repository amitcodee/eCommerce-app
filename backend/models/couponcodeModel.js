const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
    trim: true,
  },
  description: String,
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0,
  },
  minimumSpend: {
    type: Number,
    default: 0,
    min: 0,
  },
  maximumSpend: Number,
  startDate: Date,
  endDate: Date,
  usageLimit: Number,
  usageCount: {
    type: Number,
    default: 0,
  },
  applyTo: {
    type: String,
    enum: ['all', 'specific_products', 'specific_categories'],
    default: 'all',
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  status: {
    type: String,
    enum: ['active', 'expired', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Coupon', couponSchema);
