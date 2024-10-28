const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  addressType: {
    type: String,
    enum: ['home', 'work', 'other'],
    default: 'home',
  },
  recipientName: {
    type: String,
    required: true,
  },
  company: String,
  line1: {
    type: String,
    required: true,
  },
  line2: String,
  city: {
    type: String,
    required: true,
  },
  state: String,
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: String,
  isDefault: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Address', addressSchema);
