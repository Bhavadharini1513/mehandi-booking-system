const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");

const {
  getProfile,
  dashboard,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);

router.get("/dashboard", protect, dashboard);

router.put("/change-password", protect, changePassword);

router.put("/profile", protect, updateProfile);

router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({
    success: true,
    message: "Welcome Admin",
  });
});

module.exports = router;
