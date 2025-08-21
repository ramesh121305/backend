// controllers/orderController.js
const Order = require("../models/Order");
const mongoose = require("mongoose");

// ----------------------------
// Place a new order (User)
// ----------------------------
exports.placeOrder = async (req, res) => {
  try {
    const { items, address, payment, totalAmount } = req.body;

    // Validate input
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least 1 item" });
    }
    if (!address || !address.fullName || !address.phone || !address.city || !address.pincode) {
      return res.status(400).json({ message: "Incomplete address" });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ message: "Invalid total amount" });
    }

    // Create new order
    const order = new Order({
      user: req.user._id,
      items,
      address,
      payment: {
        method: payment.method,
        status: payment.method === "cod" ? "Pending" : "Paid",
        details: payment.details || {},
      },
      totalAmount,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// Get all orders of logged-in user
// ----------------------------
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.dish", "name price image")
      .sort({ createdAt: -1 }); // latest orders first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Admin - Get all orders
// ----------------------------
exports.getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view all orders" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.dish", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Admin - Update order status
// ----------------------------
exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update orders" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ----------------------------
// Get single order by ID (User or Admin)
// ----------------------------
exports.getOrderById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    const order = await Order.findById(req.params.id)
      .populate("items.dish", "name price")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is owner or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
