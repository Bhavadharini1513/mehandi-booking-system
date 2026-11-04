const mongoose = require("mongoose");

const designCatalogSchema = new mongoose.Schema(
  {
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Design title is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    category: {
      type: String,
      enum: ["Bridal", "Arabic", "Party", "Minimal", "Custom"],
      required: [true, "Category is required"],
      index: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be non-negative"],
    },

    durationMinutes: {
      type: Number,
      default: 60,
      min: [15, "Duration must be at least 15 minutes"],
    },

    images: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DesignCatalog", designCatalogSchema);

