const mongoose = require("mongoose");

const ArtistProfileSchema = new mongoose.Schema(
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

    bio: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    availableLocations: [
      {
        type: String,
        trim: true,
      },
    ],

    availableTime: {
      type: String,
      required: true,
      trim: true,
    },

    services: [
      {
        type: String,
        trim: true,
      },
    ],

    profileImage: {
      type: String,
      default: "",
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
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("ArtistProfile", ArtistProfileSchema);
