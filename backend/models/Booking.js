const mongoose = require("mongoose");

const addressSubSchema = new mongoose.Schema(
  {
    street: { type: String, default: "", trim: true },
    city: { type: String, default: "", trim: true },
    pincode: { type: String, default: "", trim: true },
    landmark: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const paymentDetailsSubSchema = new mongoose.Schema(
  {
    utrNumber: { type: String, default: "", trim: true },
    receiptUrl: { type: String, default: "", trim: true },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false },
);

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

    design: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DesignCatalog",
    },

    bookingDate: {
      type: Date,
      required: true,
      index: true,
    },

    timeSlot: {
      type: String,
      default: function () {
        if (this.startTime && this.endTime) {
          return `${this.startTime} - ${this.endTime}`;
        }
        return "10:00 AM - 12:00 PM";
      },
    },

    serviceType: {
      type: String,
      enum: ["home", "studio"],
      default: "home",
    },

    address: {
      type: addressSubSchema,
      default: () => ({ street: "", city: "", pincode: "", landmark: "" }),
      set: function (val) {
        if (typeof val === "string") {
          return { street: val, city: "", pincode: "", landmark: "" };
        }
        return val;
      },
    },

    amount: {
      type: Number,
      required: true,
      min: [0, "Amount must be non-negative"],
    },

    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "verification_pending",
        "paid",
        "refunded",
        "refund_pending",
      ],
      default: "unpaid",
      index: true,
    },

    paymentDetails: {
      type: paymentDetailsSubSchema,
      default: () => ({ utrNumber: "", receiptUrl: "" }),
    },

    bookingStatus: {
      type: String,
      enum: [
        "requested",
        "confirmed",
        "completed",
        "cancelled",
        // Extended status values for full lifecycle support
        "pending",
        "info_needed",
        "accepted",
        "rejected",
      ],
      default: "requested",
      alias: "status",
      index: true,
    },

    completionOtp: {
      type: String,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },

    // Extended supporting fields for slot locking and platform compatibility
    artistProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ArtistProfile",
    },

    dateKey: {
      type: String,
      default: function () {
        return this.bookingDate
          ? new Date(this.bookingDate).toISOString().slice(0, 10)
          : "";
      },
      index: true,
    },

    startTime: { type: String, default: "10:00" },
    endTime: { type: String, default: "12:00" },
    hours: { type: Number, default: 2 },
    service: { type: String, default: "Bridal Mehndi", trim: true },
    venue: { type: String, default: "", trim: true },
    notes: { type: String, default: "", trim: true },
    statusReason: { type: String, default: "" },

    paymentOrderId: { type: String, default: "" },
    paymentId: { type: String, default: "" },
    paidAt: { type: Date },
    paymentDueAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Pre-save hook to ensure fields stay in sync
BookingSchema.pre("save", function () {
  if (!this.dateKey && this.bookingDate) {
    this.dateKey = new Date(this.bookingDate).toISOString().slice(0, 10);
  }
  if (!this.timeSlot && this.startTime && this.endTime) {
    this.timeSlot = `${this.startTime} - ${this.endTime}`;
  }
  if (!this.venue && this.address?.street) {
    this.venue = this.address.street;
  }
});

const Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;
