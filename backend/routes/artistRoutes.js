const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  becomeArtist,
  registerArtist,
  getMyApplication,
  getArtistApplications,
  approveArtist,
  rejectArtist,
  getArtistProfile,
  getApprovedArtists,
} = require("../controllers/artistController");

// ======================================================
// PUBLIC
// ======================================================

// View approved artists
router.get("/approved", getApprovedArtists);

// New user -> Register as artist
// NO TOKEN REQUIRED
router.post("/register", registerArtist);

// ======================================================
// CUSTOMER
// ======================================================

// Existing logged-in customer -> Become artist
router.post("/become-artist", protect, authorize("customer"), becomeArtist);

router.get("/my-application", protect, getMyApplication);

// ======================================================
// ARTIST
// ======================================================

router.get("/profile", protect, authorize("artist"), getArtistProfile);

// ======================================================
// ADMIN
// ======================================================

router.get("/applications", protect, authorize("admin"), getArtistApplications);

router.put(
  "/applications/:id/approve",
  protect,
  authorize("admin"),
  approveArtist,
);

router.put(
  "/applications/:id/reject",
  protect,
  authorize("admin"),
  rejectArtist,
);


module.exports = router;
