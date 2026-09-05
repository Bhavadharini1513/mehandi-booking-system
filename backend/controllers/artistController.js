const User = require("../models/User");
const ArtistProfile = require("../models/ArtistProfile");

// ======================================================
// CUSTOMER -> APPLY TO BECOME ARTIST
// ======================================================

const becomeArtist = async (req, res) => {
  try {
    const {
      experience,
      specialization,
      bio,
      location,
      availableLocations,
      availableTime,
      services,
      profileImage,
    } = req.body;

    if (
      experience === undefined ||
      !specialization ||
      !bio ||
      !location ||
      !availableTime
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required artist details",
      });
    }

    if (Number(experience) < 0) {
      return res.status(400).json({
        success: false,
        message: "Experience cannot be negative",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Only customers can apply
    if (user.role !== "customer") {
      return res.status(400).json({
        success: false,
        message: "Only customers can apply to become an artist",
      });
    }

    const existingProfile = await ArtistProfile.findOne({
      user: user._id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Artist application already exists",
        status: existingProfile.status,
      });
    }

    const artistProfile = await ArtistProfile.create({
      user: user._id,
      experience: Number(experience),
      specialization,
      bio,
      location,

      availableLocations: Array.isArray(availableLocations)
        ? availableLocations
        : [],

      availableTime,

      services: Array.isArray(services) ? services : [],

      profileImage: profileImage || "",

      status: "pending",
    });

    // IMPORTANT:
    // Do NOT change customer to artist here.
    // Admin must approve first.

    res.status(201).json({
      success: true,
      message:
        "Artist application submitted successfully. Waiting for admin approval.",

      profile: artistProfile,
    });
  } catch (error) {
    console.error("BECOME ARTIST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// CUSTOMER -> VIEW OWN APPLICATION
// ======================================================

const getMyApplication = async (req, res) => {
  try {
    const profile = await ArtistProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email phone address city role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Artist application not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("GET APPLICATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ADMIN -> VIEW PENDING APPLICATIONS
// ======================================================

const getArtistApplications = async (req, res) => {
  try {
    const applications = await ArtistProfile.find({
      status: "pending",
    })
      .populate("user", "name email phone address city role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("GET ARTIST APPLICATIONS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ADMIN -> APPROVE ARTIST
// ======================================================

const approveArtist = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await ArtistProfile.findById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Artist application not found",
      });
    }

    if (profile.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Application is already ${profile.status}`,
      });
    }

    profile.status = "approved";
    await profile.save();

    const user = await User.findById(profile.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Artist user not found",
      });
    }

    // NOW customer becomes artist
    user.role = "artist";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Artist approved successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },

      profile,
    });
  } catch (error) {
    console.error("APPROVE ARTIST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ADMIN -> REJECT ARTIST
// ======================================================

const rejectArtist = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await ArtistProfile.findById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Artist application not found",
      });
    }

    if (profile.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Application is already ${profile.status}`,
      });
    }

    profile.status = "rejected";

    await profile.save();

    // User remains customer
    res.status(200).json({
      success: true,
      message: "Artist application rejected",
      profile,
    });
  } catch (error) {
    console.error("REJECT ARTIST ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// ARTIST -> GET PROFILE
// ======================================================

const getArtistProfile = async (req, res) => {
  try {
    const profile = await ArtistProfile.findOne({
      user: req.user._id,
    }).populate("user", "name email phone address city role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Artist profile not found",
      });
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("GET ARTIST PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// PUBLIC -> GET APPROVED ARTISTS
// ======================================================

const getApprovedArtists = async (req, res) => {
  try {
    const artists = await ArtistProfile.find({
      status: "approved",
    }).populate("user", "name email phone city");

    res.status(200).json({
      success: true,
      count: artists.length,
      artists,
    });
  } catch (error) {
    console.error("GET APPROVED ARTISTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  becomeArtist,
  getMyApplication,
  getArtistApplications,
  approveArtist,
  rejectArtist,
  getArtistProfile,
  getApprovedArtists,
};
