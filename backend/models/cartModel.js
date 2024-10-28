const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      options: [
        {
          name: String,
          value: String,
        },
      ],
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

cartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
