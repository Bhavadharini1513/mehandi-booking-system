const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  becomeArtist,
  getArtistProfile,
  getMyApplication,
  getServices,
  getApprovedArtists,
  getArtistById,
  getPendingApplications,
  approveArtist,
  rejectArtist,
} = require("../controllers/artistController");

/* Public */
router.get("/services", getServices);
router.get("/approved", getApprovedArtists);

/* Customer */
router.post("/become-artist", protect, becomeArtist);
router.get("/my-application", protect, getMyApplication);

/* Artist */
router.get("/profile", protect, authorize("artist"), getArtistProfile);

/* Admin */
router.get(
  "/applications",
  protect,
  authorize("admin"),
  getPendingApplications,
);

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

/* Public single artist - keep LAST so it never shadows the routes above */
router.get("/:id", getArtistById);

module.exports = router;
