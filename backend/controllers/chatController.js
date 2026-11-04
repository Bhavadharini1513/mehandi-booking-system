const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Message = require("../models/Message");
const { postMessage } = require("../utils/chat");

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

// chat is read-only once a booking is finished
const WRITABLE_STATUSES = ["pending", "info_needed", "accepted", "confirmed"];

/* Returns the booking if the user is the customer or artist of it */
const getParticipantBooking = async (req, res) => {
  const { bookingId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    fail(res, 400, "Invalid booking id");
    return null;
  }

  const booking = await Booking.findById(bookingId)
    .populate("customer", "name")
    .populate("artist", "name");

  if (!booking) {
    fail(res, 404, "Booking not found");
    return null;
  }

  const userId = String(req.user._id);

  if (
    String(booking.customer._id) !== userId &&
    String(booking.artist._id) !== userId
  ) {
    fail(res, 403, "You are not part of this conversation");
    return null;
  }

  return booking;
};

/* GET /api/chat/:bookingId */
const getMessages = async (req, res) => {
  try {
    const booking = await getParticipantBooking(req, res);
    if (!booking) return;

    const messages = await Message.find({ booking: booking._id })
      .sort({ createdAt: 1 })
      .limit(500);

    return res.status(200).json({
      success: true,
      canSend: WRITABLE_STATUSES.includes(booking.status),
      booking: {
        _id: booking._id,
        status: booking.status,
        service: booking.service,
        dateKey: booking.dateKey,
        startTime: booking.startTime,
        endTime: booking.endTime,
        customer: booking.customer,
        artist: booking.artist,
      },
      messages,
    });
  } catch (error) {
    console.error("GET MESSAGES ERROR:", error);
    return fail(res, 500, "Failed to load messages");
  }
};

/* POST /api/chat/:bookingId   body: { text } */
const sendMessage = async (req, res) => {
  try {
    const booking = await getParticipantBooking(req, res);
    if (!booking) return;

    if (!WRITABLE_STATUSES.includes(booking.status)) {
      return fail(res, 400, "This conversation is closed");
    }

    const text = String(req.body.text || "").trim();

    if (!text) return fail(res, 400, "Message cannot be empty");
    if (text.length > 2000) return fail(res, 400, "Message is too long");

    const message = await postMessage(req.app.get("io"), {
      booking,
      sender: req.user,
      text,
    });

    return res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    return fail(res, 500, "Failed to send message");
  }
};

module.exports = { getMessages, sendMessage };
