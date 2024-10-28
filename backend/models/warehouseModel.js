const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: String,
    unique: true,
    trim: true,
  },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  contactPerson: String,
  phone: String,
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  notes: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Warehouse', warehouseSchema);
