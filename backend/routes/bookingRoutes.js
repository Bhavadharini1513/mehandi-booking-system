const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const {
  getAvailability,
  createBooking,
  getMyBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  completeBooking,
  resubmitBooking,
  cancelBooking,
} = require("../controllers/bookingController");

/* Public: which hours of an artist are free on a date? */
router.get("/availability/:artistProfileId", getAvailability);

/* Customer */
router.post("/", protect, authorize("customer"), createBooking);
router.put("/:id/resubmit", protect, authorize("customer"), resubmitBooking);

/* Artist */
router.put("/:id/accept", protect, authorize("artist"), acceptBooking);
router.put("/:id/reject", protect, authorize("artist"), rejectBooking);
router.put("/:id/complete", protect, authorize("artist"), completeBooking);

/* Customer or artist of the booking */
router.get("/my", protect, getMyBookings);
router.put("/:id/cancel", protect, authorize("customer", "artist"), cancelBooking);
router.get("/:id", protect, getBookingById);

module.exports = router;
