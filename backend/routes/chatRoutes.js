const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { getMessages, sendMessage } = require("../controllers/chatController");

router.get("/:bookingId", protect, getMessages);
router.post("/:bookingId", protect, sendMessage);

module.exports = router;
