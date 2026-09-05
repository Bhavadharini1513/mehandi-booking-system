const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================================================
   REGISTER
========================================================= */

const register = async (req, res) => {
  try {
    const { name, email, phone, address, city, password } = req.body;

    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your name",
      });
    }

    if (!email || email.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your email",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    if (!phone || phone.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your phone number",
      });
    }

    if (!address || address.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your address",
      });
    }

    if (!city || city.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter your city",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter a password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    /* -----------------------------------------
       CHECK EXISTING USER
    ----------------------------------------- */

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    /* -----------------------------------------
       HASH PASSWORD
    ----------------------------------------- */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* -----------------------------------------
       CREATE USER
    ----------------------------------------- */

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      password: hashedPassword,
      role: "customer",
    });

    /* -----------------------------------------
       RESPONSE
    ----------------------------------------- */

    return res.status(201).json({
      success: true,
      message: "Registration successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("REGISTRATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
};

/* =========================================================
   LOGIN
========================================================= */

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your password",
      });
    }

    /* -----------------------------------------
       FIND USER
    ----------------------------------------- */

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email not registered",
      });
    }

    /* -----------------------------------------
       CHECK PASSWORD
    ----------------------------------------- */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    /* -----------------------------------------
       CREATE JWT
    ----------------------------------------- */

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    /* -----------------------------------------
       RESPONSE
    ----------------------------------------- */

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

module.exports = {
  register,
  login,
};
