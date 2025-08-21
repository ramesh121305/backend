const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,    // <-- added
} = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authmiddleware");

const router = express.Router();

router.post("/", protect, placeOrder);          // User places order
router.get("/my", protect, getMyOrders);        // User views own orders
router.get("/", protect, admin, getAllOrders);  // Admin views all
router.get("/:id", protect, getOrderById);      // ✅ Track single order by ID
router.put("/status/:id", protect, admin, updateOrderStatus); // Admin updates

module.exports = router;
