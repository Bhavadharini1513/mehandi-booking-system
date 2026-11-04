const mongoose = require("mongoose");

/*
  Booking life-cycle
  ------------------
  pending      customer placed the order, artist has not answered yet (slot is held)
  info_needed  artist rejected for now and asked for more information (slot is still held,
               customer can chat and re-submit)
  accepted     artist accepted, customer must pay before paymentDueAt (slot is held)
  confirmed    customer paid - the booking is final
  completed    artist finished the work
  rejected     artist rejected the order (slot released)
  cancelled    cancelled by customer / artist / payment time-out (slot released)
*/
const BOOKING_STATUSES = [
  "pending",
  "info_needed",
  "accepted",
  "confirmed",
  "completed",
  "rejected",
  "cancelled",
];

const BookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    artistProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtistProfile",
      required: true,
    },

    // Date at 00:00 UTC (used for sorting / display)
    bookingDate: { type: Date, required: true },

    // "YYYY-MM-DD" - the calendar day the customer chose (used for slot locking)
    dateKey: { type: String, required: true, index: true },

    startTime: { type: String, required: true }, // "HH:00"
    endTime: { type: String, required: true }, // "HH:00"
    hours: { type: Number, required: true, min: 1 },

    service: { type: String, required: true, trim: true },

    venue: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },

    amount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: BOOKING_STATUSES,
      default: "pending",
      index: true,
    },

    // Reason given by the artist (reject / more info) or by whoever cancelled
    statusReason: { type: String, default: "" },

    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refund_pending"],
      default: "unpaid",
    },
    paymentOrderId: { type: String, default: "" },
    paymentId: { type: String, default: "" },
    paidAt: { type: Date },
    paymentDueAt: { type: Date },
  },
  { timestamps: true },
);

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
module.exports.BOOKING_STATUSES = BOOKING_STATUSES;
