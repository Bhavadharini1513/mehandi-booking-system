const bcrypt = require("bcryptjs");
const User = require("../models/User");



const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,

      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};



const dashboard = async (req, res) => {
  res.status(200).json({
    success: true,

    message: `Welcome ${req.user.name}`,

    user: req.user,
  });
};



const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,

      newPassword,
    } = req.body;

    const user = await User.findById(req.user._id);

    const match = await bcrypt.compare(
      currentPassword,

      user.password,
    );

    if (!match) {
      return res.status(400).json({
        success: false,

        message: "Current password incorrect",
      });
    }

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({
      success: true,

      message: "Password Changed Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (address !== undefined) {
      user.address = address;
    }

    if (city !== undefined) {
      user.city = city;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city,
        profileImage: updatedUser.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,

  dashboard,

  changePassword,
  updateProfile,
};
