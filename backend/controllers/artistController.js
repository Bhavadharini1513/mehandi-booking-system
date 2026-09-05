const ArtistProfile = require("../models/ArtistProfile");
const User = require("../models/User");

/*
=========================================================
BECOME ARTIST
Customer submits artist application
=========================================================
*/

const becomeArtist = async (req, res) => {
  try {
    const { experience, specialization, location, services, bio } = req.body;

    const userId = req.user._id;

    /* -----------------------------------------
       Check required fields
    ----------------------------------------- */

    if (experience === undefined || experience === null || experience === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your experience",
      });
    }

    if (!specialization || specialization.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your specialization",
      });
    }

    if (!location || location.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your location",
      });
    }

    if (!services || !Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one service",
      });
    }

    if (!bio || bio.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your bio",
      });
    }

    /* -----------------------------------------
       Check user role
    ----------------------------------------- */

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "artist") {
      return res.status(400).json({
        success: false,
        message: "You are already an approved artist",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin cannot submit an artist application",
      });
    }

    /* -----------------------------------------
       Check existing application
    ----------------------------------------- */

    const existingApplication = await ArtistProfile.findOne({
      user: userId,
    });

    if (existingApplication) {
      if (existingApplication.status === "pending") {
        return res.status(400).json({
          success: false,
          message: "Your artist application is already pending",
        });
      }

      if (existingApplication.status === "approved") {
        return res.status(400).json({
          success: false,
          message: "You are already an approved artist",
        });
      }

      /*
       If previously rejected, allow resubmission
      */

      if (existingApplication.status === "rejected") {
        existingApplication.experience = experience;
        existingApplication.specialization = specialization.trim();
        existingApplication.location = location.trim();
        existingApplication.services = services;
        existingApplication.bio = bio.trim();
        existingApplication.status = "pending";

        await existingApplication.save();

        return res.status(200).json({
          success: true,
          message: "Artist application resubmitted successfully",
          application: existingApplication,
        });
      }
    }

    /* -----------------------------------------
       Create new application
    ----------------------------------------- */

    const application = await ArtistProfile.create({
      user: userId,
      experience,
      specialization: specialization.trim(),
      location: location.trim(),
      services,
      bio: bio.trim(),
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Artist application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("BECOME ARTIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit artist application",
      error: error.message,
    });
  }
};

/*
=========================================================
GET ARTIST PROFILE
=========================================================
*/

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

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("GET ARTIST PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch artist profile",
    });
  }
};

/*
=========================================================
ADMIN - GET PENDING APPLICATIONS
=========================================================
*/

const getPendingApplications = async (req, res) => {
  try {
    const applications = await ArtistProfile.find({
      status: "pending",
    })
      .populate("user", "name email phone address city role")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("GET APPLICATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch artist applications",
    });
  }
};

/*
=========================================================
ADMIN - APPROVE
=========================================================
*/

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

    const user = await User.findById(profile.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
    Change application status
    */

    profile.status = "approved";

    await profile.save();

    /*
    Update ONLY role.

    Do not use user.save()
    because old users may have empty
    phone/address/city fields.
    */

    await User.findByIdAndUpdate(
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
    );

    return res.status(200).json({
      success: true,
      message: "Artist application approved successfully",
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

/*
=========================================================
ADMIN - REJECT
=========================================================
*/

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
    });
  } catch (error) {
    console.error("REJECT ARTIST ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject artist application",
    });
  }
};

module.exports = {
  becomeArtist,
  getArtistProfile,
  getPendingApplications,
  approveArtist,
  rejectArtist,
};
