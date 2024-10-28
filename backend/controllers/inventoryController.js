const Inventory = require("../models/inventoryModel");
const Product = require("../models/productModel");

// Add stock (incoming inventory)
exports.addStock = async (req, res) => {
  try {
    const { productId, variantId, quantity, warehouseId, createdBy, price } =
      req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Find the specific variant by variantId
    const variantIndex = product.variants.findIndex(
      (v) => v._id.toString() === variantId
    );
    if (variantIndex === -1)
      return res.status(404).json({ message: "Variant not found" });

    // Ensure quantity is treated as a number
    const quantityToAdd = parseInt(quantity, 10);
    if (isNaN(quantityToAdd)) {
      return res.status(400).json({ message: "Invalid quantity provided" });
    }

    // Create new inventory record
    const inventoryRecord = new Inventory({
      product: productId,
      variant: variantId,
      warehouse: warehouseId,
      movementType: "in",
      quantity: quantityToAdd,
      previousQuantity: product.variants[variantIndex].quantity, // Store the previous quantity of the variant
      createdBy: createdBy,
    });

    // Save inventory record
    await inventoryRecord.save();

    // Update the variant's quantity and price by adding the stock properly
    product.variants[variantIndex].quantity += quantityToAdd;
    if (price && !isNaN(price)) {
      product.variants[variantIndex].price = price; // Update price if provided
    }
    await product.save();

    res.json({
      success: true,
      message: "Stock added successfully",
      inventory: inventoryRecord,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove stock (outgoing inventory)
exports.removeStock = async (req, res) => {
  try {
    const { productId, variantId, quantity, warehouseId, createdBy } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variantIndex = product.variants.findIndex(
      (v) => v._id.toString() === variantId
    );
    if (variantIndex === -1)
      return res.status(404).json({ message: "Variant not found" });

    const quantityToRemove = parseInt(quantity, 10);
    if (isNaN(quantityToRemove)) {
      return res.status(400).json({ message: "Invalid quantity provided" });
    }

    if (product.variants[variantIndex].quantity < quantityToRemove) {
      return res
        .status(400)
        .json({ message: "Not enough stock available to remove" });
    }

    // Create new inventory record
    const inventoryRecord = new Inventory({
      product: productId,
      variant: variantId, // Associate the variant with the inventory record
      warehouse: warehouseId,
      movementType: "out",
      quantity: quantityToRemove,
      previousQuantity: product.variants[variantIndex].quantity, // Store the previous quantity of the variant
      createdBy: createdBy,
    });

    // Save inventory record
    await inventoryRecord.save();

    // Update the variant's quantity by subtracting stock
    product.variants[variantIndex].quantity -= quantityToRemove;
    await product.save();

    res.json({
      success: true,
      message: "Stock removed successfully",
      inventory: inventoryRecord,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Adjust inventory (e.g., due to stock discrepancies)
exports.adjustInventory = async (req, res) => {
  try {
    const { productId, variantId, newQuantity, createdBy } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const variantIndex = product.variants.findIndex(
      (v) => v._id.toString() === variantId
    );
    if (variantIndex === -1)
      return res.status(404).json({ message: "Variant not found" });

    const adjustedQuantity = parseInt(newQuantity, 10);
    if (isNaN(adjustedQuantity)) {
      return res.status(400).json({ message: "Invalid new quantity provided" });
    }

    const inventoryRecord = new Inventory({
      product: productId,
      variant: variantId,
      movementType: "adjustment",
      quantity: adjustedQuantity - product.variants[variantIndex].quantity, // Adjustment amount
      previousQuantity: product.variants[variantIndex].quantity,
      createdBy: createdBy,
    });

    // Save inventory record
    await inventoryRecord.save();

    // Update the variant's quantity to the new quantity
    product.variants[variantIndex].quantity = adjustedQuantity;
    await product.save();

    res.json({
      success: true,
      message: "Inventory adjusted successfully",
      inventory: inventoryRecord,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get inventory records for a specific product variant
exports.getInventoryByProduct = async (req, res) => {
  try {
    const { productId, variantId } = req.params;
    let inventoryRecords;

    if (variantId) {
      // Fetch inventory records for a specific variant
      inventoryRecords = await Inventory.find({
        product: productId,
        variant: variantId,
      }).populate("product createdBy");
    } else {
      // Fetch inventory records for all variants of a product
      inventoryRecords = await Inventory.find({
        product: productId,
      }).populate("product createdBy");
    }

    res.json({ success: true, inventoryRecords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all inventory records (optional)
exports.getAllInventoryRecords = async (req, res) => {
  try {
    const inventoryRecords = await Inventory.find({}).populate({
      path: "product",
      populate: {
        path: "variants.size variants.color", // Populate the size and color fields
        select: "name", // Select only the name field from size and color models
      },
    });
    res.json({ success: true, inventoryRecords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update inventory record
exports.updateInventoryRecord = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const {
      productId,
      variantId,
      quantity,
      warehouseId,
      movementType,
      updatedBy,
    } = req.body;

    // Find the inventory record by ID
    const inventoryRecord = await Inventory.findById(inventoryId);
    if (!inventoryRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory record not found" });
    }

    // Log incoming data for debugging
    // console.log("Updating inventory record:", inventoryId, req.body);

    // Update inventory fields if provided
    if (productId) inventoryRecord.product = productId;
    if (variantId) inventoryRecord.variant = variantId;
    if (quantity !== undefined) inventoryRecord.quantity = quantity;
    if (warehouseId) inventoryRecord.warehouse = warehouseId;
    if (movementType) inventoryRecord.movementType = movementType;
    if (updatedBy) inventoryRecord.updatedBy = updatedBy;

    // Save updated inventory record
    await inventoryRecord.save();

    // Now update the product variant's quantity
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Find the correct variant in the product
    const variant = product.variants.find(
      (v) => v._id.toString() === variantId
    );
    if (!variant) {
      return res
        .status(404)
        .json({ success: false, message: "Variant not found" });
    }

    // Update the variant's quantity based on the inventory record's quantity
    if (movementType === "in") {
      // Add the inventory quantity to the product variant's quantity
      variant.quantity += quantity;
    } else if (movementType === "out") {
      // Subtract the inventory quantity from the product variant's quantity
      variant.quantity -= quantity;
      if (variant.quantity < 0) variant.quantity = 0; // Ensure quantity is not negative
    } else if (movementType === "adjustment") {
      // Directly set the new quantity in case of adjustment
      variant.quantity = quantity;
    }

    // Save the updated product with the new variant quantity
    await product.save();

    // Send the response with updated inventory record
    res.json({
      success: true,
      message: "Inventory record and product variant updated successfully",
      inventory: inventoryRecord,
      product, // Return the updated product for reference
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete inventory record
exports.deleteInventoryRecord = async (req, res) => {
  try {
    const { inventoryId } = req.params;

    // Find the inventory record by ID and delete it
    const inventoryRecord = await Inventory.findByIdAndDelete(inventoryId);
    if (!inventoryRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory record not found" });
    }

    res.json({
      success: true,
      message: "Inventory record deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Controller to fetch sold products based on movementType "out"
exports.getSoldProducts = async (req, res) => {
  try {
    // Fetch inventory movements where movementType is "out"
    const soldMovements = await Inventory.find({ movementType: "out" });

    if (!soldMovements || soldMovements.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sold products found",
      });
    }

    // Aggregate the total sold products and their quantities
    const soldProducts = await Promise.all(
      soldMovements.map(async (movement) => {
        const product = await Product.findById(movement.productId); // Fetch product by productId in the movement
        return {
          productId: movement.productId,
          productName: product?.name || "Unknown Product",
          variantId: movement.variantId,
          quantitySold: movement.quantity,
        };
      })
    );

    // Send a successful response with the aggregated sold products
    res.json({
      success: true,
      soldProducts,
    });
  } catch (error) {
    console.error("Error fetching sold products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching sold products",
    });
  }
};
