const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String, // Can store the image URL or file path
    trim: true,
  },
}, {
  timestamps: true,
});

categorySchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/ /g, '-');
  next();
});

module.exports = mongoose.model('Category', categorySchema);
