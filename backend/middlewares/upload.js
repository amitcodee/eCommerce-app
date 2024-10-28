const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Define storage for uploaded images (in memory for processing)
const storage = multer.memoryStorage();

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
  }
};

// Initialize multer with storage and file filter for single image upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: fileFilter,
});

// Middleware to process a single image and convert it to WebP format
const processImage = async (req, res, next) => {
  // if (!req.file) {
  //   return next(new Error('No file uploaded'));
  // }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const outputFilename = `${uniqueSuffix}.avif`;
    const outputPath = path.join('../uploads/categories', outputFilename);

    // Convert the uploaded image buffer to WebP format and save it
    await sharp(req.file.buffer)
      .avif({ quality: 40 })
      .toFile(outputPath);

    // Update req.file with the new file path and filename
    req.file.filename = outputFilename;
    req.file.path = outputPath;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, processImage };