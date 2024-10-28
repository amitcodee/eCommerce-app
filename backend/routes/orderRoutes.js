// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const { placeOrder, getAllOrders, getSingleOrder, updateOrderStatus, adminPlaceOrder } = require("../controllers/orderController");
const { authenticateUser } = require("../middlewares/authMiddleware");

router.post("/place-order", placeOrder);
router.get("/all", getAllOrders); // Fetch all orders
router.get("/:id", getSingleOrder); // Fetch single order by ID
router.put("/update-status/:orderId",authenticateUser, updateOrderStatus)
// Admin placing order for a user
router.post("/admin/place-order", adminPlaceOrder);

module.exports = router;
