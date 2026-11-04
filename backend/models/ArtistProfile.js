const mongoose = require("mongoose");

const locationSubSchema = new mongoose.Schema(
  {
    city: { type: String, default: "", trim: true },
    address: { type: String, default: "", trim: true },
    pincode: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const artistProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // Retained and indexed for MongoDB Atlas index compatibility
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    serviceRadiusKm: {
      type: Number,
      default: 10,
      min: 0,
    },

    location: {
      type: locationSubSchema,
      default: () => ({ city: "", address: "", pincode: "" }),
      set: function (val) {
        if (typeof val === "string") {
          return { city: val, address: val, pincode: "" };
        }
        return val;
      },
    },

    payoutUpiId: {
      type: String,
      required: true,
      default: "artist@upi",
      trim: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: "",
      trim: true,
    },

    // Extended platform fields for catalog, rates & reviews
    specialization: {
      type: String,
      default: "Bridal Mehndi",
      trim: true,
    },

    services: {
      type: [String],
      default: [],
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

    profileImage: {
      type: String,
      default: "",
    },

    pricePerHour: {
      type: Number,
      default: 500,
      min: 0,
    },

    rating: {
      type: Number,
      default: 5,
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Pre-save hook: keeps user <-> userId, status <-> approvalStatus, experience <-> experienceYears synchronized
artistProfileSchema.pre("save", function () {
  if (this.userId && !this.user) {
    this.user = this.userId;
  } else if (this.user && !this.userId) {
    this.userId = this.user;
  }

  // Synchronize status and approvalStatus
  if (this.isModified("approvalStatus") && !this.isModified("status")) {
    this.status = this.approvalStatus;
  } else if (this.isModified("status") && !this.isModified("approvalStatus")) {
    this.approvalStatus = this.status;
  } else if (this.approvalStatus !== this.status) {
    if (this.approvalStatus && this.approvalStatus !== "pending") {
      this.status = this.approvalStatus;
    } else if (this.status && this.status !== "pending") {
      this.approvalStatus = this.status;
    }
  }

  if (this.experienceYears && !this.experience) {
    this.experience = this.experienceYears;
  } else if (this.experience && !this.experienceYears) {
    this.experienceYears = this.experience;
  }
});

// Also keep them in sync on insert/create
artistProfileSchema.pre("validate", function () {
  if (this.userId && !this.user) {
    this.user = this.userId;
  } else if (this.user && !this.userId) {
    this.userId = this.user;
  }

  // Synchronize status and approvalStatus
  if (this.isModified("approvalStatus") && !this.isModified("status")) {
    this.status = this.approvalStatus;
  } else if (this.isModified("status") && !this.isModified("approvalStatus")) {
    this.approvalStatus = this.status;
  } else if (this.approvalStatus !== this.status) {
    if (this.approvalStatus && this.approvalStatus !== "pending") {
      this.status = this.approvalStatus;
    } else if (this.status && this.status !== "pending") {
      this.approvalStatus = this.status;
    }
  }

  if (this.experienceYears !== undefined && this.experience === undefined) {
    this.experience = this.experienceYears;
  } else if (this.experience !== undefined && this.experienceYears === undefined) {
    this.experienceYears = this.experience;
  }
});

module.exports = mongoose.model("ArtistProfile", artistProfileSchema);
