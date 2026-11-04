const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");
const { isStrongPassword } = require("../utils/validators");


  // REGISTER


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

/* =========================================================
   FORGOT PASSWORD
   1. user enters e-mail  -> we e-mail a one-time link
   2. user opens the link -> chooses a new password
   Only the SHA-256 hash of the token is stored in the database.
========================================================= */

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const forgotPassword = async (req, res) => {
  // Same answer whether the e-mail exists or not (no account enumeration)
  const genericResponse = {
    success: true,
    message:
      "If an account exists for this e-mail, a password reset link has been sent.",
  };

  try {
    const email = String(req.body.email || "")
      .toLowerCase()
      .trim();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(200).json(genericResponse);

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashToken(token),
          resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
        },
      },
    );

    const link = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${token}`;

    await sendMail({
      to: user.email,
      subject: "Reset your Maruthani World password",
      text: [
        `Hello ${user.name},`,
        "",
        "We received a request to reset your password.",
        "Open this link to choose a new password (valid for 15 minutes):",
        "",
        link,
        "",
        "If you did not ask for this, you can ignore this e-mail.",
      ].join("\n"),
    });

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not process the request. Please try again.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!isStrongPassword(password || "")) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: hashToken(String(token)),
      resetPasswordExpires: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "This reset link is invalid or has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
      },
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successful. You can now log in.",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Could not reset the password. Please try again.",
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
