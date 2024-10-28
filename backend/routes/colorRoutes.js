const express = require('express');
const { createColor, getColors, updateColor, deleteColor, getSingleColor } = require('../controllers/colorController');
const colorModel = require('../models/colorModel');


const router = express.Router();

// Route for creating a new color
router.post('/create-color', createColor);

// Route for getting all colors
router.get('/get-colors', getColors);

router.get('/:id', getSingleColor);

// Route for updating a color by ID
router.put('/update-color/:id', updateColor);

// Route for deleting a color by ID
router.delete('/delete-color/:id', deleteColor);

// API to fetch color by ID
router.get('/colors/:id', async (req, res) => {
  const color = await colorModel.findById(req.params.id);
  res.json(color);
});



module.exports = router;