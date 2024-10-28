const mongoose = require('mongoose');

const adminActivityLogSchema = new mongoose.Schema({
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  actionType: {
    type: String,
    enum: [
      'order_created',
      'order_updated',
      'order_deleted',
      'inventory_updated',
      'product_added',
      'product_updated',
      'product_deleted',
      'category_added',
      'category_updated',
      'category_deleted',
      'user_created',
      'user_updated',
      'user_deleted',
      'other',
    ],
    required: true,
  },
  targetModel: String,
  targetId: mongoose.Schema.Types.ObjectId,
  changes: Object,
  description: String,
  ipAddress: String,
  userAgent: String,
  date: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AdminActivityLog', adminActivityLogSchema);
