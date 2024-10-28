const Size = require('../models/sizeModel');

/**
 * Create a New Size
 */
const createSize = async (req, res) => {
    try {
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({
          status: 'fail',
          message: 'Size name is required.',
        });
      }
  
      const newSize = new Size({ name });
      const savedSize = await newSize.save();
  
      res.status(201).json({
        status: 'success',
        data: savedSize,
      });
    } catch (error) {
      console.error('Error creating size:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server Error: Unable to create size.',
      });
    }
  };
  
  /**
   * Get All Sizes
   */
  const getSizes = async (req, res) => {
    try {
      const sizes = await Size.find();
      res.status(200).json({
        status: 'success',
        results: sizes.length,
        data: sizes,
      });
    } catch (error) {
      console.error('Error fetching sizes:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server Error: Unable to fetch sizes.',
      });
    }
  };


  /**
 * Get a Single Size by ID
 */
const getSingleSize = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch size by ID
    const size = await Size.findById(id);

    // Check if the size exists
    if (!size) {
      return res.status(404).json({
        status: 'fail',
        message: 'Size not found.',
      });
    }

    // Respond with size data
    res.status(200).json({
      status: 'success',
      data: size,
    });
  } catch (error) {
    console.error('Error fetching size:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server Error: Unable to fetch size.',
    });
  }
};
  
  /**
   * Update a Size by ID
   */
  const updateSize = async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
  
      if (!name) {
        return res.status(400).json({
          status: 'fail',
          message: 'Size name is required for update.',
        });
      }
  
      const size = await Size.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
      );
  
      if (!size) {
        return res.status(404).json({
          status: 'fail',
          message: 'Size not found.',
        });
      }
  
      res.status(200).json({
        status: 'success',
        data: size,
      });
    } catch (error) {
      console.error('Error updating size:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server Error: Unable to update size.',
      });
    }
  };
  
  /**
   * Delete a Size by ID
   */
  const deleteSize = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedSize = await Size.findByIdAndDelete(id);
  
      if (!deletedSize) {
        return res.status(404).json({
          status: 'fail',
          message: 'Size not found.',
        });
      }
  
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (error) {
      console.error('Error deleting size:', error);
      res.status(500).json({
        status: 'error',
        message: 'Server Error: Unable to delete size.',
      });
    }
  };

  
  module.exports ={
    createSize,
    getSizes,
    getSingleSize,
    updateSize,
    deleteSize,
  }