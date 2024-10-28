const express = require('express');
const {  getSizes, updateSize, deleteSize, createSize, getSingleSize } = require('../controllers/sizeController');
const sizeModel = require('../models/sizeModel');


const router = express.Router();
// Route for creating a new size
router.post('/create-size', createSize);

// Route for getting all sizes
router.get('/get-sizes', getSizes);

router.get('/:id', getSingleSize);

// Route for updating a size by ID
router.put('/update-size/:id', updateSize);

// Route for deleting a size by ID
router.delete('/delete-size/:id', deleteSize);

// API to fetch size by ID
router.get('/sizes/:id', async (req, res) => {
  const size = await sizeModel.findById(req.params.id);
  res.json(size);
});





module.exports = router;