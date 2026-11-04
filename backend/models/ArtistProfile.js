const mongoose = require("mongoose");
const artistProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    availableLocations: {
      type: [String],
      default: [],
    },

    availableTime: {
      type: String,
      default: "",
      trim: true,
    },

    services: {
      type: [String],
      required: true,
      default: [],
    },

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    // Price charged per hour of work (INR)
    pricePerHour: {
      type: Number,
      default: 500,
      min: 0,
    },

    profileImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ArtistProfile", artistProfileSchema);
