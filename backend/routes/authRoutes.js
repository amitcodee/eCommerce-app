// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../../backend/controllers/authContoller');
const { registerValidation, loginValidation, authenticateUser } = require('../../backend/middlewares/authMiddleware');

// Registration Route
router.post('/register', registerValidation, authController.register);

// Login Route
router.post('/login', loginValidation, authController.login);

router.get("/admin-auth", authenticateUser, (req, res) => {
    res.status(200).send({ ok: true });
  });

module.exports = router;
