const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  sku: String,
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  options: [
    {
      name: String,
      value: String,
    },
  ],
}, { _id: false });

module.exports = orderItemSchema;
