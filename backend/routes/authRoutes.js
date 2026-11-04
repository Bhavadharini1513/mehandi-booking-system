const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

// max 5 forgot-password requests per 15 minutes per IP
const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again after 15 minutes.",
  },
});

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotLimiter, forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
