const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getCustomers,
  getArtists,
  getDashboardStats,
} = require("../controllers/adminController");

// Admin Dashboard Statistics
router.get("/stats", protect, authorize("admin"), getDashboardStats);

// View Customers
router.get("/customers", protect, authorize("admin"), getCustomers);

// View Approved Artists
router.get("/artists", protect, authorize("admin"), getArtists);

module.exports = router;
