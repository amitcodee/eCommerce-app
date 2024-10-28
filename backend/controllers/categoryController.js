// controllers/categoryController.js

const Category = require('../models/categoryModel'); // Import the category model
const { validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

// Helper function to delete an image file
const deleteImage = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error('Error deleting image:', err);
  });
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    let imagePath = '';

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there's an uploaded file, remove it since validation failed
      if (req.file) {
        deleteImage(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      // If there's an uploaded file, remove it since category exists
      if (req.file) {
        deleteImage(req.file.path);
      }
      return res.status(400).json({ message: 'Category already exists' });
    }

    // If an image was uploaded, set the imagePath
    if (req.file) {
      imagePath = req.file.path; // You might want to store a relative path or URL
    }
  
    // Create a new category with name, description, and image
    const category = new Category({
      name,
      description,
      image: imagePath,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    // Fetch all categories
    const categories = await Category.find({});

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      categories,
    });
  } catch (error) {
    console.error('Error retrieving categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      category,
    });
  } catch (error) {
    console.error('Error retrieving category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    let imagePath;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there's an uploaded file, remove it since validation failed
      if (req.file) {
        deleteImage(req.file.path);
      }
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the category exists
    const category = await Category.findById(id);
    if (!category) {
      // If there's an uploaded file, remove it since category doesn't exist
      if (req.file) {
        deleteImage(req.file.path);
      }
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if the updated name is already used by another category
    const existingCategory = await Category.findOne({ name });
    if (existingCategory && existingCategory._id.toString() !== id) {
      // If there's an uploaded file, remove it since name is already in use
      if (req.file) {
        deleteImage(req.file.path);
      }
      return res.status(400).json({ message: 'Category name already in use' });
    }

    // Update category fields
    category.name = name;
    category.description = description;

    // If a new image is uploaded, replace the old one
    if (req.file) {
      // Delete the old image if it exists
      if (category.image) {
        deleteImage(category.image);
      }
      imagePath = req.file.path;
      category.image = imagePath;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete the associated image if it exists
    if (category.image) {
      deleteImage(category.image);
    }

    // Delete the category
    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
