const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getCustomers,
  getArtists,
  getDashboardStats,
  getArtistApplications,
  approveArtist,
  rejectArtist,
  getBookings,
} = require("../controllers/adminController");

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

router.get("/stats", protect, authorize("admin"), getDashboardStats);

/* =========================================================
   CUSTOMERS
========================================================= */

router.get("/customers", protect, authorize("admin"), getCustomers);

/* =========================================================
   APPROVED ARTISTS
========================================================= */

router.get("/artists", protect, authorize("admin"), getArtists);

/* =========================================================
   ARTIST APPLICATIONS
========================================================= */

router.get("/applications", protect, authorize("admin"), getArtistApplications);

/* =========================================================
   APPROVE ARTIST
========================================================= */

router.put(
  "/applications/:id/approve",
  protect,
  authorize("admin"),
  approveArtist,
);

/* =========================================================
   REJECT ARTIST
========================================================= */

router.put(
  "/applications/:id/reject",
  protect,
  authorize("admin"),
  rejectArtist,
);

/* =========================================================
   BOOKINGS
========================================================= */

router.get("/bookings", protect, authorize("admin"), getBookings);

module.exports = router;
