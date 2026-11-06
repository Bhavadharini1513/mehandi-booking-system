const ArtistProfile = require("../models/ArtistProfile");
const mongoose = require("mongoose");
const User = require("../models/User");

const becomeArtist = async (req, res) => {
  try {
    const {
      experience,
      specialization,
      location,
      availableLocations = [],
      availableTime = "",
      services,
      bio,
      profileImage = "",
      pricePerHour = 500,
    } = req.body;

    const userId = req.user._id;

    if (experience === undefined || experience === null || experience === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your experience",
      });
    }

    if (Number(experience) < 0) {
      return res.status(400).json({
        success: false,
        message: "Experience cannot be negative",
      });
    }

    if (!specialization?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your specialization",
      });
    }

    if (!location?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your location",
      });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one service",
      });
    }

    if (!bio?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your bio",
      });
    }

    if (
      Number.isNaN(Number(pricePerHour)) ||
      Number(pricePerHour) < 0 ||
      Number(pricePerHour) > 100000
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid price per hour",
      });
    }

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

    const cleanServices = services
      .map((service) => String(service).trim())
      .filter(Boolean);

    const cleanLocations = Array.isArray(availableLocations)
      ? availableLocations.map((item) => String(item).trim()).filter(Boolean)
      : [];

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

      existingApplication.experience = Number(experience);
      existingApplication.specialization = specialization.trim();
      existingApplication.location = location.trim();
      existingApplication.availableLocations = cleanLocations;
      existingApplication.availableTime = String(availableTime).trim();
      existingApplication.services = cleanServices;
      existingApplication.bio = bio.trim();
      existingApplication.pricePerHour = Number(pricePerHour);
      existingApplication.profileImage = profileImage;
      existingApplication.status = "pending";

      await existingApplication.save();

      return res.status(200).json({
        success: true,
        message: "Artist application resubmitted successfully",
        application: existingApplication,
      });
    }

    const application = await ArtistProfile.create({
      user: userId,
      experience: Number(experience),
      specialization: specialization.trim(),
      location: location.trim(),
      availableLocations: cleanLocations,
      availableTime: String(availableTime).trim(),
      services: cleanServices,
      bio: bio.trim(),
      pricePerHour: Number(pricePerHour),
      profileImage,
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

    const profileObj = profile.toObject();
    if (typeof profileObj.location === "object" && profileObj.location !== null) {
      profileObj.location = profileObj.location.city || profileObj.location.address || "Tamil Nadu";
    }

    return res.status(200).json({
      success: true,
      profile: profileObj,
    });
  } catch (error) {
    console.error("GET ARTIST PROFILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch artist profile",
    });
  }
};

const getMyApplication = async (req, res) => {
  try {
    const profile = await ArtistProfile.findOne({
      user: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "No artist application found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("GET MY APPLICATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch artist application",
    });
  }
};

/*
  Returns services only from approved artists.
*/
const getServices = async (req, res) => {
  try {
    const profiles = await ArtistProfile.find({
      status: "approved",
    }).select("services");

    const serviceMap = new Map();

    profiles.forEach((profile) => {
      (profile.services || []).forEach((service) => {
        const clean = String(service).trim();

        if (!clean) return;

        const key = clean.toLowerCase();

        if (!serviceMap.has(key)) {
          serviceMap.set(key, {
            name: clean,
            artistCount: 0,
          });
        }
      });
    });

    for (const [key, item] of serviceMap.entries()) {
      item.artistCount = profiles.filter((profile) =>
        (profile.services || []).some(
          (service) => String(service).trim().toLowerCase() === key,
        ),
      ).length;
    }

    const services = Array.from(serviceMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("GET SERVICES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch services",
    });
  }
};

/*
  Examples:

  /api/artist/approved

  /api/artist/approved?service=Bridal

  /api/artist/approved?service=Bridal&location=Chennai
*/
const getApprovedArtists = async (req, res) => {
  try {
    const { service, location } = req.query;

    const profiles = await ArtistProfile.find({
      status: "approved",
    })
      .populate("user", "name email phone address city role")
      .sort({ createdAt: -1 });

    const normalizedService = service?.trim().toLowerCase();
    const normalizedLocation = location?.trim().toLowerCase();

    const filtered = profiles.filter((profile) => {
      const services = (profile.services || []).map((item) =>
        String(item).trim().toLowerCase(),
      );

      const locations = [
        profile.location,
        ...(profile.availableLocations || []),
        profile.user?.city,
      ]
        .filter(Boolean)
        .map((item) => String(item).trim().toLowerCase());

      const serviceMatches =
        !normalizedService || services.includes(normalizedService);

      const locationMatches =
        !normalizedLocation ||
        locations.some((item) => item.includes(normalizedLocation));

      return serviceMatches && locationMatches;
    });

    const artists = filtered.map((profile) => ({
      _id: profile._id,
      userId: profile.user?._id,

      name: profile.user?.name || "",
      email: profile.user?.email || "",
      phone: profile.user?.phone || "",
      address: profile.user?.address || "",
      city: profile.user?.city || "",
      role: profile.user?.role || "artist",

      experience: profile.experience,
      specialization: profile.specialization,
      location: typeof profile.location === "object" && profile.location !== null ? (profile.location.city || profile.location.address || "Tamil Nadu") : (profile.location || "Tamil Nadu"),
      availableLocations: profile.availableLocations || [],
      availableTime: profile.availableTime || "",
      services: profile.services || [],
      bio: profile.bio,
      profileImage: profile.profileImage || "",
      pricePerHour: profile.pricePerHour ?? 500,

      rating: profile.rating || 0,
      totalReviews: profile.totalReviews || 0,

      status: profile.status,
      createdAt: profile.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: artists.length,
      artists,
      filters: {
        service: service || "",
        location: location || "",
      },
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

/* GET /api/artist/:id  - public profile of ONE approved artist */
const getArtistById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid artist id",
      });
    }

    const profile = await ArtistProfile.findOne({
      _id: req.params.id,
      status: "approved",
    }).populate("user", "name email phone address city role");

    if (!profile || !profile.user) {
      return res.status(404).json({
        success: false,
        message: "Artist not found",
      });
    }

    return res.status(200).json({
      success: true,
      artist: {
        _id: profile._id,
        userId: profile.user._id,
        name: profile.user.name,
        email: profile.user.email,
        phone: profile.user.phone,
        address: profile.user.address,
        city: profile.user.city,
        role: profile.user.role,
        experience: profile.experience,
        specialization: profile.specialization,
        location: typeof profile.location === "object" && profile.location !== null ? (profile.location.city || profile.location.address || "Tamil Nadu") : (profile.location || "Tamil Nadu"),
        availableLocations: profile.availableLocations || [],
        availableTime: profile.availableTime || "",
        services: profile.services || [],
        bio: profile.bio,
        profileImage: profile.profileImage || "",
        pricePerHour: profile.pricePerHour ?? 500,
        rating: profile.rating || 0,
        totalReviews: profile.totalReviews || 0,
        status: profile.status,
        createdAt: profile.createdAt,
      },
    });
  } catch (error) {
    console.error("GET ARTIST BY ID ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch artist",
    });
  }
};

const getPendingApplications = async (req, res) => {
  try {
    const rawApps = await ArtistProfile.find({
      status: "pending",
    })
      .populate("user", "name email phone address city role")
      .sort({ createdAt: -1 });

    const applications = rawApps.map((app) => {
      const doc = app.toObject ? app.toObject() : { ...app };
      if (typeof doc.location === "object" && doc.location !== null) {
        doc.location = doc.location.city || doc.location.address || "Tamil Nadu";
      }
      if (doc.user && typeof doc.user.city === "object" && doc.user.city !== null) {
        doc.user.city = doc.user.city.city || doc.user.city.address || "Tamil Nadu";
      }
      return doc;
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

const approveArtist = async (req, res) => {
  try {
    const profile = await ArtistProfile.findById(req.params.id);

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

    profile.status = "approved";
    await profile.save();

    await User.updateOne({ _id: user._id }, { $set: { role: "artist" } });

    const updatedUser = await User.findById(user._id).select("-password");

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

const rejectArtist = async (req, res) => {
  try {
    const profile = await ArtistProfile.findById(req.params.id);

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
    });
  }
};

module.exports = {
  becomeArtist,
  getArtistProfile,
  getMyApplication,
  getServices,
  getApprovedArtists,
  getArtistById,
  getPendingApplications,
  approveArtist,
  rejectArtist,
};
