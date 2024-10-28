const Product = require('../models/productModel'); // Adjust the path as needed
const bwipjs = require('bwip-js'); // Import bwip-js for generating barcodes
const fs = require('fs'); // For saving the generated barcode to the file system
const path = require('path');

/**
 * Generates a unique SKU in the format 'PROD-XXXXXX'
 */
const generateUniqueSKU = async () => {
  const prefix = 'PROD-';
  let sku;
  let exists = true;

  while (exists) {
    const randomStr = Math.random().toString(36).substr(2, 6).toUpperCase();
    sku = `${prefix}${randomStr}`;
    // Check if SKU already exists
    const product = await Product.findOne({ sku });
    if (!product) {
      exists = false;
    }
  }

  return sku;
};

/**
 * Generates a unique 12-digit barcode and creates a barcode image
 */
const generateUniqueBarcode = async () => {
  let barcode;
  let exists = true;

  while (exists) {
    barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    // Check if barcode already exists
    const product = await Product.findOne({ barcode });
    if (!product) {
      exists = false;
    }
  }

  // Generate the barcode image using bwip-js
  try {
    // Create the barcode image folder if it doesn't exist
    const barcodeDir = path.join(__dirname, '../../uploads/barcodes');
    if (!fs.existsSync(barcodeDir)) {
      fs.mkdirSync(barcodeDir, { recursive: true });
    }

    // Create the barcode as a PNG image
    const barcodeImage = await bwipjs.toBuffer({
      bcid: 'code128',        // Barcode type: Code 128
      text: barcode,          // Text to encode as the barcode
      scale: 3,               // Scale factor for the barcode image
      height: 10,             // Barcode height in millimeters
      includetext: true,      // Include human-readable text below the barcode
      textxalign: 'center',   // Align the text to the center
    });

    // Save the barcode image to the 'uploads/barcodes' folder
    const barcodePath = path.join(barcodeDir, `${barcode}.png`);
    fs.writeFileSync(barcodePath, barcodeImage);

    console.log('Barcode generated and saved at:', barcodePath);

    return {
      barcode,
      barcodeImagePath: `../uploads/barcodes/${barcode}.png`, // Return the relative path for database storage
    };
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw new Error('Failed to generate barcode.');
  }
};

module.exports = {
  generateUniqueSKU,
  generateUniqueBarcode,
};
