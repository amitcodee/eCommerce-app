// validators/authValidator.js

const { check } = require('express-validator');

exports.registerValidation = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('username').notEmpty().withMessage('Username is required'),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

exports.loginValidation = [
  check('emailOrUsername').notEmpty().withMessage('Email or username is required'),
  check('password').notEmpty().withMessage('Password is required'),
];


// middleware/authMiddleware.js

// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel'); // Adjust the path to your User model

// Middleware to authenticate user using JWT
exports.authenticateUser = async (req, res, next) => {
  try {
    let token;

    // Check if the token is provided in the Authorization header (Bearer Token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Alternatively, you can get the token from cookies if you store it there
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    console.log('User ID from token:', decoded.userId);

    // Fetch the user from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach user information to the request object
    req.user = user;

    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};


// Middleware to authorize user roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Ensure that the user's role is included in the allowed roles
    console.log(req)
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};
