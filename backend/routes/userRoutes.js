const express = require("express");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();

// Fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({ role: { $ne: 'admin' } });
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create new user
router.post('/users/create', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password, phone, role } = req.body;

    // Check if the user already exists
    const existingUser = await UserModel.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with that email or username" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = new UserModel({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error during user creation" });
  }
});

// Edit user
router.put('/users/update/:id', async (req, res) => {
  try {
    const { firstName, lastName, username, email, phone, role } = req.body;
    const userId = req.params.id;

    // Check if the user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    existingUser.firstName = firstName || existingUser.firstName;
    existingUser.lastName = lastName || existingUser.lastName;
    existingUser.username = username || existingUser.username;
    existingUser.email = email || existingUser.email;
    existingUser.phone = phone || existingUser.phone;
    existingUser.role = role || existingUser.role;

    await existingUser.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: existingUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error during user update" });
  }
});

// Delete user
router.delete('/users/delete/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const existingUser = await UserModel.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error during user deletion" });
  }
});

module.exports = router;
