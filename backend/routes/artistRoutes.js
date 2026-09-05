const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  becomeArtist,
  getArtistProfile,
  getPendingApplications,
  approveArtist,
  rejectArtist,
} = require("../controllers/artistController");

/*
=========================================================
CUSTOMER
Submit artist application
=========================================================
*/

router.post("/become-artist", protect, becomeArtist);

/*
=========================================================
ARTIST
Get own artist profile
=========================================================
*/

router.get("/profile", protect, authorize("artist"), getArtistProfile);

/*
=========================================================
ADMIN
Get pending applications
=========================================================
*/

router.get(
  "/applications",
  protect,
  authorize("admin"),
  getPendingApplications,
);

/*
=========================================================
ADMIN
Approve application
=========================================================
*/

router.put(
  "/applications/:id/approve",
  protect,
  authorize("admin"),
  approveArtist,
);

/*
=========================================================
ADMIN
Reject application
=========================================================
*/

router.put(
  "/applications/:id/reject",
  protect,
  authorize("admin"),
  rejectArtist,
);

module.exports = router;
