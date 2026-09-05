const User = require("../models/User");
const ArtistProfile = require("../models/ArtistProfile");

// ==========================================
// GET ALL CUSTOMERS
// ==========================================

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("GET CUSTOMERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL APPROVED ARTISTS
// ==========================================

const getArtists = async (req, res) => {
  try {
    const artists = await ArtistProfile.find({
      status: "approved",
    })
      .populate("user", "name email phone address city role createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: artists.length,
      artists,
    });
  } catch (error) {
    console.error("GET ARTISTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ADMIN DASHBOARD STATISTICS
// ==========================================

const getDashboardStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({
      role: "customer",
    });

    const totalArtists = await User.countDocuments({
      role: "artist",
    });

    const pendingApplications = await ArtistProfile.countDocuments({
      status: "pending",
    });

    const rejectedApplications = await ArtistProfile.countDocuments({
      status: "rejected",
    });

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        totalArtists,
        pendingApplications,
        rejectedApplications,
      },
    });
  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCustomers,
  getArtists,
  getDashboardStats,
};
