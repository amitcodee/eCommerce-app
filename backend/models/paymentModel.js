const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  method: {
    type: String,
    enum: ['cod', 'credit_card', 'paypal', 'bank_transfer', 'offline'],
    required: true,
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: String,
  transactionDetails: Object,
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
