// Product Controller: Updated to Fix Barcode Issue
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const {
  generateUniqueSKU,
  generateUniqueBarcode,
} = require("../utils/generateCode");
const path = require("path");
const fs = require("fs");

// Helper function to delete images from the file system
const deleteImages = (imagePaths) => {
  imagePaths.forEach((filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Error deleting image ${filePath}:`, err);
      });
    } else {
      console.error(`File not found: ${filePath}`);
    }
  });
};

/**
 * Create a New Product
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      category,
      minQuantity,
      maxQuantity,
      shippingClass,
      status,
      sale,
      visibility,
      dateAvailable,
      variants, // Expecting variants to be an array of objects {size, color, price, quantity}
    } = req.body;

    // Generate SKU
    const sku = await generateUniqueSKU();

    // Ensure the uploads/products directory exists
    const productDir = path.join(__dirname, "../../uploads/products");
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file, index) => ({
        url: `/uploads/products/${file.filename}`,
        altText: file.originalname,
        isFeatured: index === 0,
      }));
    }

    // Process category
    let processedCategory = category;
    if (typeof category === "string") {
      try {
        processedCategory = JSON.parse(category);
      } catch (e) {
        processedCategory = category.split(",").map((c) => c.trim());
      }
    }

    // Parse and process variants
    let variantsData = variants;
    if (typeof variantsData === "string") {
      try {
        variantsData = JSON.parse(variantsData);
      } catch (e) {
        throw new Error("Invalid variants data");
      }
    }

    if (!Array.isArray(variantsData)) {
      throw new Error("Variants must be an array");
    }

    // Generate barcodes for each variant and ensure no barcode is null
    const processedVariants = await Promise.all(
      variantsData.map(async (variant) => {
        let barcode = variant.barcode;
        let barcodeImagePath = variant.barcodeImagePath || "";

        // Always generate a barcode if it is not provided
        if (!barcode || barcode === null) {
          const generatedBarcode = await generateUniqueBarcode();
          barcode = generatedBarcode.barcode;
          barcodeImagePath = generatedBarcode.barcodeImagePath;
        }

        return {
          ...variant,
          barcode, // Assigning the generated barcode
          barcodeImagePath, // Assigning the generated barcode image path
        };
      })
    );

    // Ensure no variants have null barcode (double check)
    if (processedVariants.some((variant) => !variant.barcode)) {
      throw new Error(
        "Unable to generate a unique barcode for one or more variants."
      );
    }

    // Create new product
    const newProduct = new Product({
      sku,
      name,
      description,
      shortDescription,
      category: processedCategory,
      minQuantity,
      maxQuantity,
      shippingClass,
      variants: processedVariants,
      images,
      status,
      sale,
      visibility,
      dateAvailable,
    });

    // Save product
    const savedProduct = await newProduct.save();
    res.status(201).json({
      status: "success",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);

    // Handle file cleanup on error
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map((file) =>
        path.join(__dirname, "..", "uploads", "products", file.filename)
      );
      deleteImages(imagePaths);
    }

    res.status(500).json({
      status: "error",
      message: error.message || "Server Error: Unable to create product.",
    });
  }
};

/**
 * Update a Product by ID
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found.",
      });
    }

    const {
      name,
      description,
      shortDescription,
      category,
      minQuantity,
      maxQuantity,
      shippingClass,
      status,
      sale,
      visibility,
      dateAvailable,
      variants, // Handle variants in the update
    } = req.body;

    // Update basic product fields
    if (name !== undefined) {
      existingProduct.name = name;
      existingProduct.slug = name.toLowerCase().replace(/ /g, "-");
    }
    if (description !== undefined) existingProduct.description = description;
    if (shortDescription !== undefined)
      existingProduct.shortDescription = shortDescription;

    // Process category field
    if (category !== undefined) {
      let processedCategory = category;
      if (typeof category === "string") {
        try {
          processedCategory = JSON.parse(category);
        } catch (e) {
          processedCategory = category.split(",").map((c) => c.trim());
        }
      }
      existingProduct.category = processedCategory;
    }

    if (minQuantity !== undefined) existingProduct.minQuantity = minQuantity;
    if (maxQuantity !== undefined) existingProduct.maxQuantity = maxQuantity;
    if (shippingClass !== undefined)
      existingProduct.shippingClass = shippingClass;
    if (status !== undefined) existingProduct.status = status;
    if (sale !== undefined) existingProduct.sale = sale;
    if (visibility !== undefined) existingProduct.visibility = visibility;
    if (dateAvailable !== undefined)
      existingProduct.dateAvailable = dateAvailable;

    // Handle variants update
    if (variants !== undefined) {
      let variantsData = variants;
      if (typeof variantsData === "string") {
        try {
          variantsData = JSON.parse(variantsData);
        } catch (e) {
          throw new Error("Invalid variants data");
        }
      }

      if (!Array.isArray(variantsData)) {
        throw new Error("Variants must be an array");
      }

      // Process each variant, generate barcode if not present
      const updatedVariants = await Promise.all(
        variantsData.map(async (variant) => {
          let barcode = variant.barcode;
          let barcodeImagePath = variant.barcodeImagePath || "";

          if (!barcode || barcode === null) {
            const generatedBarcode = await generateUniqueBarcode();
            barcode = generatedBarcode.barcode;
            barcodeImagePath = generatedBarcode.barcodeImagePath;
          }

          return {
            ...variant,
            barcode,
            barcodeImagePath,
          };
        })
      );
      existingProduct.variants = updatedVariants;
    }

    // Handle images upload if new files are provided
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `/uploads/products/${file.filename}`,
        altText: file.originalname,
        isFeatured: false,
      }));
      // Append the new images to the product's images array
      existingProduct.images.push(...newImages);
    }

    // Save the updated product
    const updatedProduct = await existingProduct.save();

    res.status(200).json({
      status: "success",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    res.status(500).json({
      status: "error",
      message: "Server Error: Unable to update product.",
    });
  }
};

/**
 * Get All Products
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .populate({
        path: "variants",
        populate: [
          { path: "size", model: "Size" },
          { path: "color", model: "Color" },
        ],
      });

    res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      status: "error",
      message: "Server Error: Unable to fetch products.",
    });
  }
};

/**
 * Get a Single Product by ID
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate("category")
      .populate({
        path: "variants",
        populate: [
          { path: "size", model: "Size" },
          { path: "color", model: "Color" },
        ],
        select: "barcodeImagePath",
      });

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Delete a Product by ID
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        status: "fail",
        message: "Product not found.",
      });
    }

    if (deletedProduct.images && deletedProduct.images.length > 0) {
      const imagePaths = deletedProduct.images.map((img) =>
        path.join(
          __dirname,
          "../../",
          "uploads",
          "products",
          path.basename(img.url)
        )
      );
      deleteImages(imagePaths);
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      status: "error",
      message: "Server Error: Unable to delete product.",
    });
  }
};

/**
 * Get Similar Products based on category
 */
const getSimilarProducts = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product by ID to get its category or other attributes
    const product = await Product.findById(id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Fetch similar products from the same category, excluding the current product
    const similarProducts = await Product.find({
      category: { $in: product.category.map((cat) => cat._id) }, // Matching any category in the array
      _id: { $ne: product._id }, // Exclude the current product
    })
      .limit(5) // You can adjust the limit as per your requirement
      .populate("category")
      .populate({
        path: "variants",
        populate: [
          { path: "size", model: "Size" },
          { path: "color", model: "Color" },
        ],
      });

    res.status(200).json({
      status: "success",
      results: similarProducts.length,
      data: similarProducts,
    });
  } catch (error) {
    console.error("Error fetching similar products:", error);
    res.status(500).json({
      status: "error",
      message: "Server Error: Unable to fetch similar products.",
    });
  }
};

const getbyCategory = async (req, res) => {
  try {
    const { category } = req.params; // category can be an ObjectId or slug

    // Determine if the category is an ObjectId or a slug
    let categoryQuery = {};
    if (category.match(/^[0-9a-fA-F]{24}$/)) {
      // If the category matches the ObjectId format, search by _id
      categoryQuery = { _id: category };
    } else {
      // Otherwise, search by slug
      categoryQuery = { slug: category };
    }

    // Fetch the category based on the query (either _id or slug)
    const foundCategory = await Category.findOne(categoryQuery);

    // If no category is found, return a 404 response
    if (!foundCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Fetch products that belong to this category
    const products = await Product.find({
      category: foundCategory._id,
    }).populate({
      path: "variants",
      populate: [
        { path: "size", model: "Size" },
        { path: "color", model: "Color" },
      ],
    });

    // If no products are found, return a 404 response
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
    }

    // Return the products found for this category
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Search products with various filters
const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in Search Product API",
      error,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getSimilarProducts,
  getbyCategory,
  searchProducts,
};
