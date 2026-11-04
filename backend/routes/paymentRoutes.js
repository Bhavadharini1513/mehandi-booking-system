const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getPaymentConfig,
  createOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.get("/config", getPaymentConfig);
router.post("/create-order", protect, authorize("customer"), createOrder);
router.post("/verify", protect, authorize("customer"), verifyPayment);

module.exports = router;
