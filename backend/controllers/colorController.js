const Color = require('../models/colorModel');
/**
 * Create a New Color
 */
const createColor = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Color name is required.',
      });
    }

    const newColor = new Color({ name });
    const savedColor = await newColor.save();

    res.status(201).json({
      status: 'success',
      data: savedColor,
    });
  } catch (error) {
    console.error('Error creating color:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server Error: Unable to create color.',
    });
  }
};

/**
 * Get All Colors
 */
const getColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json({
      status: 'success',
      results: colors.length,
      data: colors,
    });
  } catch (error) {
    console.error('Error fetching colors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server Error: Unable to fetch colors.',
    });
  }
};

/**
 * Update a Color by ID
 */
const updateColor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Color name is required for update.',
      });
    }

    const color = await Color.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!color) {
      return res.status(404).json({
        status: 'fail',
        message: 'Color not found.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: color,
    });
  } catch (error) {
    console.error('Error updating color:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server Error: Unable to update color.',
    });
  }
};


const getSingleColor = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch color by ID
    const color = await Color.findById(id);

    // Check if the color exists
    if (!color) {
      return res.status(404).json({
        status: 'fail',
        message: 'Color not found.',
      });
    }

    // Respond with color data
    res.status(200).json({
      status: 'success',
      data: color,
    });
  } catch (error) {
    console.error('Error fetching color:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server Error: Unable to fetch color.',
    });
  }
};


/**
 * Delete a Color by ID
 */
const deleteColor = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedColor = await Color.findByIdAndDelete(id);

    if (!deletedColor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Color not found.',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    console.error('Error deleting color:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server Error: Unable to delete color.',
    });
  }
};


module.exports = {
  createColor,
  getColors,
  updateColor,
  deleteColor,
  getSingleColor
 
};
