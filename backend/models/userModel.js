const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  fullName: {
    type: String,
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  phone: {
    type: String,
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, {
  timestamps: true,
});

userSchema.pre('save', function(next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  next();
});

module.exports = mongoose.model('User', userSchema);


