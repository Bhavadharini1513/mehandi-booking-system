const User = require("../models/User");
const ArtistProfile = require("../models/ArtistProfile");
const Booking = require("../models/Booking");

/* =========================================================
   GET ALL CUSTOMERS
========================================================= */

const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error("GET CUSTOMERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};

/* =========================================================
   GET APPROVED ARTISTS
========================================================= */

const getArtists = async (req, res) => {
  try {
    // Get all approved artist profiles
    const profiles = await ArtistProfile.find({
      status: "approved",
    }).sort({
      createdAt: -1,
    });

    const artists = [];

    for (const profile of profiles) {
      // IMPORTANT:
      // profile.user contains the User document ID
      const user = await User.findById(profile.user).select(
        "name email phone address city role",
      );

      if (!user) {
        console.log("User not found for ArtistProfile:", profile._id);

        continue;
      }

      artists.push({
        // ArtistProfile ID
        _id: profile._id,

        // User ID
        userId: user._id,

        // =========================
        // USER MODEL DATA
        // =========================
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        role: user.role,

        // =========================
        // ARTIST PROFILE DATA
        // =========================
        experience: profile.experience || 0,

        specialization: profile.specialization || "",

        location: profile.location || "",

        services: profile.services || [],

        bio: profile.bio || "",

        status: profile.status,

        createdAt: profile.createdAt,
      });
    }

    

    return res.status(200).json({
      success: true,
      count: artists.length,
      artists,
    });
  } catch (error) {
    console.error("GET APPROVED ARTISTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch approved artists",
      error: error.message,
    });
  }
};

/* =========================================================
   GET DASHBOARD STATISTICS
========================================================= */

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      totalArtists,
      pendingApplications,
      rejectedApplications,
      totalBookings,
      completedBookings,
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),

      User.countDocuments({ role: "artist" }),

      ArtistProfile.countDocuments({
        status: "pending",
      }),

      ArtistProfile.countDocuments({
        status: "rejected",
      }),

      Booking.countDocuments(),

      Booking.countDocuments({
        status: "completed",
      }),
    ]);

    return res.status(200).json({
      success: true,

      stats: {
        totalCustomers,
        totalArtists,
        pendingApplications,
        rejectedApplications,
        totalBookings,
        completedBookings,
      },
    });
  } catch (error) {
    console.error("GET DASHBOARD STATS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
};

/* =========================================================
   GET PENDING ARTIST APPLICATIONS
========================================================= */

const getArtistApplications = async (req, res) => {
  try {
    const applications = await ArtistProfile.find({
      status: "pending",
    })
      .populate("user", "name email phone address city role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("GET ARTIST APPLICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch artist applications",
    });
  }
};

/* =========================================================
   APPROVE ARTIST APPLICATION
========================================================= */

const approveArtist = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("====================================");
    console.log("APPROVING ARTIST");
    console.log("APPLICATION ID:", id);
    console.log("====================================");

    /* -----------------------------------------
       Find artist application
    ----------------------------------------- */

    const profile = await ArtistProfile.findById(id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Artist application not found",
      });
    }

    /* -----------------------------------------
       Check application status
    ----------------------------------------- */

    if (profile.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Artist application is already approved",
      });
    }

    /* -----------------------------------------
       Find user
    ----------------------------------------- */

    const user = await User.findById(profile.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User associated with this application not found",
      });
    }

    console.log("USER ID:", user._id);
    console.log("USER NAME:", user.name);
    console.log("CURRENT ROLE:", user.role);

    /* -----------------------------------------
       APPROVE ARTIST PROFILE
    ----------------------------------------- */

    profile.status = "approved";

    await profile.save();

    /* -----------------------------------------
       IMPORTANT FIX
       
       Do NOT use:
       
       user.role = "artist";
       await user.save();

       because mongoose validates all required
       fields and your old users may have empty
       phone/address/city.

       Instead update only role.
    ----------------------------------------- */

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          role: "artist",
        },
      },
      {
        new: true,
        runValidators: false,
      },
    ).select("-password");

    console.log("NEW ROLE:", updatedUser.role);

    console.log("====================================");
    console.log("ARTIST APPROVED SUCCESSFULLY");
    console.log("====================================");

    return res.status(200).json({
      success: true,
      message: "Artist application approved successfully",
      artist: updatedUser,
      application: profile,
    });
  } catch (error) {
    console.error("APPROVE ARTIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve artist application",
      error: error.message,
    });
  }
};

/* =========================================================
   REJECT ARTIST APPLICATION
========================================================= */

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

    profile.status = "rejected";

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Artist application rejected successfully",
      application: profile,
    });
  } catch (error) {
    console.error("REJECT ARTIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject artist application",
      error: error.message,
    });
  }
};

/* =========================================================
   GET ALL BOOKINGS
========================================================= */

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email phone city")
      .populate("artist", "name email phone city")
      .populate("artistProfile", "location specialization services bio")
      .sort({
        bookingDate: -1,
      });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("GET BOOKINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

/* =========================================================
   EXPORT CONTROLLERS
========================================================= */

module.exports = {
  getCustomers,
  getArtists,
  getDashboardStats,
  getArtistApplications,
  approveArtist,
  rejectArtist,
  getBookings,
};
