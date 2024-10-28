const bwipjs = require("bwip-js"); // Import bwip-js for barcode generation
const path = require("path");
const fs = require("fs");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Inventory = require("../models/inventoryModel");
const User = require("../models/userModel");

// Helper function to generate a barcode and save it as an image
const generateBarcodeForOrder = async (orderId) => {
  const barcodePath = path.join(
    __dirname,
    `../../uploads/orders/barcode_${orderId}.png`
  );

  await bwipjs.toBuffer(
    {
      bcid: "code128", // Barcode type
      text: orderId.toString(), // Text to encode
      scale: 3, // Scaling factor
      height: 10, // Bar height
      includetext: true, // Show text below the barcode
      textxalign: "center", // Center the text
    },
    (err, png) => {
      if (err) {
        throw new Error(err);
      } else {
        // Write the image to the file system
        fs.writeFileSync(barcodePath, png);
      }
    }
  );

  // Return the relative URL to the barcode image
  return `../uploads/orders/barcode_${orderId}.png`;
};

exports.placeOrder = async (req, res) => {
  try {
    const { user, items, totalAmount } = req.body;

    if (!user || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. User ID, items, and total amount are required.",
      });
    }

    // Create the new order object
    const newOrder = new Order({
      user,
      items: [],
      totalAmount,
    });

    // Validate each item in the order
    for (const item of items) {
      const product = await Product.findById(item.productId).populate("variants");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found.`,
        });
      }

      // Check if the variant with the selected color and size exists
      const variant = product.variants.find(
        (v) => v.color.equals(item.color) && v.size.equals(item.size)
      );

      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Variant with color ${item.color} and size ${item.size} does not exist for product ${product.name}.`,
        });
      }

      // Ensure variant stock and item quantity are valid numbers
      const stock = variant.quantity || 0;
      const quantity = item.quantity || 0;

      // Check if there is enough stock for the selected variant
      if (stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.color} ${item.size} of product ${product.name}.`,
        });
      }

      // Update variant stock and create inventory movement
      variant.quantity -= quantity;
      await product.save();

      newOrder.items.push({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
      });

      // Create an inventory record for the stock movement (if you track inventory changes)
      const inventoryRecord = new Inventory({
        product: item.productId,
        variant: variant._id,
        movementType: "out",
        quantity: item.quantity,
        previousQuantity: stock, // Ensure previousQuantity is the correct stock value
      });
      await inventoryRecord.save();
    }

    // Save the order to get the order ID first
    await newOrder.save();

    // Generate a barcode for the order after it is saved
    const barcodePath = await generateBarcodeForOrder(newOrder._id);

    // Save the barcode path to the order
    newOrder.barcodeImagePath = barcodePath;
    await newOrder.save(); // Save the updated order with the barcode

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Failed to place order.",
    });
  }
};


// Get all orders for a user (or admin can fetch all orders)
exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders and populate user and product details
    const orders = await Order.find()
      .populate("user", "fullName phone email") // Populate user details
      .populate(
        "items.product",
        "name sku barcode barcodeImagePath price images"
      ); // Populate product details within items

    // If no orders are found
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    // Optionally, include the barcode path for each order
    const ordersWithBarcodes = orders.map((order) => {
      return {
        ...order._doc, // Spread the original order data
        barcodeImagePath: path.join(
          `../../uploads/orders/barcode_${order._id}.png`
        ), // Path to the barcode file
      };
    });

    // Return the orders with barcode paths
    res.status(200).json({
      success: true,
      data: ordersWithBarcodes,
      results: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
// Get a single order by ID

exports.getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the order by ID and populate related data
    const order = await Order.findById(id)
      .populate(
        "items.product",
        "name price sku barcode barcodeImagePath images"
      ) // Populate product details
      .populate("user", "fullName phone"); // Populate user details

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Attach the barcode file path to the response
    const barcodeImagePath = path.join(
      `../../uploads/orders/barcode_${id}.png`
    );

    res.status(200).json({
      success: true,
      data: {
        order,
        barcode: barcodeImagePath, // Include the barcode image path
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update order status controller (controllers/orderController.js)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
};

// Admin place order for a user
exports.adminPlaceOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Invalid request. User ID, items, and total amount are required.",
      });
    }
    // Create the new order object
    const newOrder = new Order({
      user: userId,
      items: [],
      totalAmount,
    });

    // Validate each item in the order
    for (const item of items) {
      const product = await Product.findById(item.productId).populate("variants");

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.productId} not found.`,
        });
      }
console.log(product)
      // Check if the variant with the selected color and size exists
      const variant = product?.variants?.find(
        (v) => v.color.equals(item.color) && v.size.equals(item.size)
      );
console.log(variant)
      if (!variant) {
        return res.status(400).json({
          success: false,
          message: `Variant with color ${item.color} and size ${item.size} does not exist for product ${product.name}.`,
        });
      }

      // Ensure variant stock and item quantity are valid numbers
      const stock = variant.quantity || 0;
      const quantity = item.quantity || 0;

      // Check if there is enough stock for the selected variant
      if (stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.color} ${item.size} of product ${product.name}.`,
        });
      }

      // Update variant stock and create inventory movement
      variant.quantity -= quantity;
      await product.save();

      newOrder.items.push({
        product: item.productId,
        quantity: item.quantity,
        price: item.price,
        color: item.color,
        size: item.size,
      });

      // Create an inventory record for the stock movement (if you track inventory changes)
      const inventoryRecord = new Inventory({
        product: item.productId,
        variant: variant._id,
        movementType: "out",
        quantity: item.quantity,
        previousQuantity: stock, // Ensure previousQuantity is the correct stock value
      });
      await inventoryRecord.save();
    }

    // Save the order to get the order ID first
    await newOrder.save();

    // Generate a barcode for the order after it is saved
    const barcodePath = await generateBarcodeForOrder(newOrder._id);

    // Save the barcode path to the order
    newOrder.barcodeImagePath = barcodePath;
    await newOrder.save(); // Save the updated order with the barcode

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Failed to place order.",
    });
  }
};

