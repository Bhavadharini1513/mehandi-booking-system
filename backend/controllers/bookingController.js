const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const SlotLock = require("../models/SlotLock");
const ArtistProfile = require("../models/ArtistProfile");
const User = require("../models/User");

const { postMessage } = require("../utils/chat");
const { sendMail } = require("../utils/mailer");
const slots = require("../utils/slots");

/* =========================================================
   HELPERS
========================================================= */

const populateBooking = (query) =>
  query
    .populate("customer", "name email phone city")
    .populate("artist", "name email phone city")
    .populate(
      "artistProfile",
      "location specialization services pricePerHour profileImage",
    );

const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const isDuplicateKey = (error) =>
  error &&
  (error.code === 11000 ||
    (Array.isArray(error.writeErrors) &&
      error.writeErrors.some((e) => e.code === 11000 || e.err?.code === 11000)));

const releaseSlots = (bookingId) => SlotLock.deleteMany({ booking: bookingId });

const formatDate = (booking) =>
  `${booking.dateKey} ${booking.startTime}-${booking.endTime}`;

/* Load a booking and make sure the logged in user is the expected party. */
const loadBooking = async (req, res, party) => {
  if (!isObjectId(req.params.id)) {
    fail(res, 400, "Invalid booking id");
    return null;
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    fail(res, 404, "Booking not found");
    return null;
  }

  const userId = String(req.user._id);
  const isArtist = String(booking.artist) === userId;
  const isCustomer = String(booking.customer) === userId;

  const allowed =
    (party === "artist" && isArtist) ||
    (party === "customer" && isCustomer) ||
    (party === "any" && (isArtist || isCustomer));

  if (!allowed) {
    fail(res, 403, "You cannot modify this booking");
    return null;
  }

  return { booking, isArtist, isCustomer };
};

/* Send a "status changed" e-mail to the other party (never throws) */
const notify = async (bookingId, toRole, subject, message) => {
  const booking = await populateBooking(Booking.findById(bookingId));
  if (!booking) return;

  const person = toRole === "artist" ? booking.artist : booking.customer;
  const link = `${process.env.CLIENT_URL || "http://localhost:5173"}/my-bookings`;

  const text = [
    `Hello ${person?.name || ""},`,
    "",
    message,
    "",
    `Service : ${booking.service}`,
    `When    : ${formatDate(booking)}`,
    `Amount  : Rs. ${booking.amount}`,
    "",
    `Open your bookings: ${link}`,
  ].join("\n");

  await sendMail({ to: person?.email, subject, text });
};

/* =========================================================
   AVAILABILITY  (public)
   GET /api/bookings/availability/:artistProfileId?date=YYYY-MM-DD
========================================================= */

const getAvailability = async (req, res) => {
  try {
    const { artistProfileId } = req.params;
    const { date } = req.query;

    if (!isObjectId(artistProfileId)) return fail(res, 400, "Invalid artist");
    if (!slots.isValidDateKey(date)) {
      return fail(res, 400, "date must be in YYYY-MM-DD format");
    }

    const profile = await ArtistProfile.findOne({
      _id: artistProfileId,
      status: "approved",
    });

    if (!profile) return fail(res, 404, "Approved artist not found");

    const locks = await SlotLock.find({
      artist: profile.user,
      dateKey: date,
    }).select("hour");

    const booked = locks.map((l) => l.hour);
    const past = slots.pastHours(date);

    return res.status(200).json({
      success: true,
      date,
      openHour: slots.OPEN_HOUR,
      closeHour: slots.CLOSE_HOUR,
      pricePerHour: profile.pricePerHour,
      bookedHours: booked,
      pastHours: past,
      // everything the customer must not be able to pick
      blockedHours: [...new Set([...booked, ...past])].sort((a, b) => a - b),
    });
  } catch (error) {
    console.error("AVAILABILITY ERROR:", error);
    return fail(res, 500, "Failed to load availability");
  }
};

/* =========================================================
   CREATE BOOKING  (customer places an order)
========================================================= */

const createBooking = async (req, res) => {
  let booking;

  try {
    const {
      artistProfileId,
      service,
      startTime,
      endTime,
      notes = "",
      venue = "",
    } = req.body;

    // accept both "date" and "bookingDate"
    const dateKey = String(req.body.date || req.body.bookingDate || "").slice(
      0,
      10,
    );

    if (!artistProfileId || !service || !dateKey || !startTime || !endTime) {
      return fail(
        res,
        400,
        "Artist, service, date, start time and end time are required",
      );
    }

    if (!isObjectId(artistProfileId)) return fail(res, 400, "Invalid artist");
    if (!slots.isValidDateKey(dateKey)) return fail(res, 400, "Invalid date");

    if (!slots.isValidTime(startTime) || !slots.isValidTime(endTime)) {
      return fail(res, 400, "Times must be whole hours, e.g. 10:00");
    }

    const hours = slots.hoursBetween(startTime, endTime);

    if (hours.length === 0) {
      return fail(res, 400, "End time must be after start time");
    }

    if (hours.length > slots.MAX_HOURS_PER_BOOKING) {
      return fail(
        res,
        400,
        `A single booking can be at most ${slots.MAX_HOURS_PER_BOOKING} hours`,
      );
    }

    if (hours[0] < slots.OPEN_HOUR || hours[hours.length - 1] >= slots.CLOSE_HOUR) {
      return fail(
        res,
        400,
        `Bookings are possible between ${slots.OPEN_HOUR}:00 and ${slots.CLOSE_HOUR}:00`,
      );
    }

    const past = slots.pastHours(dateKey);
    if (hours.some((h) => past.includes(h))) {
      return fail(res, 400, "You cannot book a time that has already passed");
    }

    const profile = await ArtistProfile.findOne({
      _id: artistProfileId,
      status: "approved",
    });

    if (!profile) return fail(res, 404, "Approved artist not found");

    const selectedService = profile.services.find(
      (item) =>
        String(item).trim().toLowerCase() === String(service).trim().toLowerCase(),
    );

    if (!selectedService) {
      return fail(res, 400, "Selected service is not offered by this artist");
    }

    const artist = await User.findById(profile.user);

    if (!artist || artist.role !== "artist") {
      return fail(res, 400, "Artist account is not available");
    }

    booking = await Booking.create({
      customer: req.user._id,
      artist: artist._id,
      artistProfile: profile._id,
      bookingDate: slots.dateKeyToDate(dateKey),
      dateKey,
      startTime,
      endTime,
      hours: hours.length,
      service: selectedService,
      venue: String(venue).trim(),
      notes: String(notes).trim(),
      amount: (profile.pricePerHour || 0) * hours.length,
      status: "pending",
    });

    /*
      Block the time for everybody else.
      The unique index on SlotLock rejects the insert if any of these hours
      is already taken -> we undo the booking and tell the customer.
    */
    try {
      await SlotLock.insertMany(
        hours.map((hour) => ({
          artist: artist._id,
          dateKey,
          hour,
          booking: booking._id,
        })),
        { ordered: true },
      );
    } catch (lockError) {
      await releaseSlots(booking._id);
      await Booking.deleteOne({ _id: booking._id });
      booking = null;

      if (isDuplicateKey(lockError)) {
        return fail(
          res,
          409,
          "Sorry, this artist has just been booked for that time. Please choose another time.",
        );
      }

      throw lockError;
    }

    const populated = await populateBooking(Booking.findById(booking._id));

    notify(
      booking._id,
      "artist",
      "New booking request - Maruthani World",
      "You have received a new booking request. Please accept or reject it.",
    );

    return res.status(201).json({
      success: true,
      message: "Booking request submitted successfully",
      booking: populated,
    });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);

    if (booking?._id) {
      await releaseSlots(booking._id);
      await Booking.deleteOne({ _id: booking._id });
    }

    return fail(res, 500, "Failed to create booking");
  }
};

/* =========================================================
   READ
========================================================= */

const getMyBookings = async (req, res) => {
  try {
    const query =
      req.user.role === "artist"
        ? { artist: req.user._id }
        : { customer: req.user._id };

    const bookings = await populateBooking(Booking.find(query)).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("GET MY BOOKINGS ERROR:", error);
    return fail(res, 500, "Failed to fetch bookings");
  }
};

const getBookingById = async (req, res) => {
  try {
    if (!isObjectId(req.params.id)) return fail(res, 400, "Invalid booking id");

    const booking = await populateBooking(Booking.findById(req.params.id));

    if (!booking) return fail(res, 404, "Booking not found");

    const userId = String(req.user._id);
    const isParticipant =
      String(booking.customer._id) === userId ||
      String(booking.artist._id) === userId;

    if (!isParticipant && req.user.role !== "admin") {
      return fail(res, 403, "Access denied");
    }

    return res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error("GET BOOKING ERROR:", error);
    return fail(res, 500, "Failed to fetch booking");
  }
};

/* =========================================================
   ARTIST ACTIONS
========================================================= */

const acceptBooking = async (req, res) => {
  try {
    const found = await loadBooking(req, res, "artist");
    if (!found) return;
    const { booking } = found;

    if (!["pending", "info_needed"].includes(booking.status)) {
      return fail(res, 400, `A ${booking.status} booking cannot be accepted`);
    }

    booking.status = "accepted";
    booking.statusReason = "";
    booking.paymentDueAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await booking.save();

    await postMessage(req.app.get("io"), {
      booking,
      sender: req.user,
      type: "system",
      text: "Booking accepted. Please complete the payment within 24 hours to confirm your slot.",
    });

    notify(
      booking._id,
      "customer",
      "Your booking was accepted - please pay",
      "Good news! The artist accepted your booking. Please pay within 24 hours to confirm it.",
    );

    return res.status(200).json({
      success: true,
      message: "Booking accepted. Waiting for customer payment.",
      booking: await populateBooking(Booking.findById(booking._id)),
    });
  } catch (error) {
    console.error("ACCEPT BOOKING ERROR:", error);
    return fail(res, 500, "Failed to accept booking");
  }
};

/*
  Reject an order.
  body: { reason: string (required), needMoreInfo: boolean }

  needMoreInfo = true  -> status "info_needed": the slot stays reserved and the
                          customer is asked (via chat) to give more details.
  needMoreInfo = false -> status "rejected": the slot is released.
*/
const rejectBooking = async (req, res) => {
  try {
    const found = await loadBooking(req, res, "artist");
    if (!found) return;
    const { booking } = found;

    const reason = String(req.body.reason || "").trim();
    const needMoreInfo = Boolean(req.body.needMoreInfo);

    if (reason.length < 5) {
      return fail(res, 400, "Please give a reason (at least 5 characters)");
    }

    if (!["pending", "info_needed"].includes(booking.status)) {
      return fail(res, 400, `A ${booking.status} booking cannot be rejected`);
    }

    if (needMoreInfo) {
      booking.status = "info_needed";
    } else {
      booking.status = "rejected";
      await releaseSlots(booking._id);
    }

    booking.statusReason = reason;
    await booking.save();

    await postMessage(req.app.get("io"), {
      booking,
      sender: req.user,
      type: "system",
      text: needMoreInfo
        ? `The artist needs more information: ${reason}`
        : `The artist rejected this booking: ${reason}`,
    });

    notify(
      booking._id,
      "customer",
      needMoreInfo
        ? "The artist needs more information"
        : "Your booking was rejected",
      needMoreInfo
        ? `The artist asked for more information: "${reason}". Please reply in the booking chat.`
        : `The artist could not accept your booking. Reason: "${reason}".`,
    );

    return res.status(200).json({
      success: true,
      message: needMoreInfo
        ? "Customer asked for more information"
        : "Booking rejected",
      booking: await populateBooking(Booking.findById(booking._id)),
    });
  } catch (error) {
    console.error("REJECT BOOKING ERROR:", error);
    return fail(res, 500, "Failed to reject booking");
  }
};

const completeBooking = async (req, res) => {
  try {
    const found = await loadBooking(req, res, "artist");
    if (!found) return;
    const { booking } = found;

    if (booking.status !== "confirmed") {
      return fail(res, 400, "Only confirmed (paid) bookings can be completed");
    }

    booking.status = "completed";
    await booking.save();

    notify(
      booking._id,
      "customer",
      "Your booking is completed",
      "Your booking has been marked as completed. Thank you for choosing Maruthani World!",
    );

    return res.status(200).json({
      success: true,
      message: "Booking marked as completed",
      booking: await populateBooking(Booking.findById(booking._id)),
    });
  } catch (error) {
    console.error("COMPLETE BOOKING ERROR:", error);
    return fail(res, 500, "Failed to complete booking");
  }
};

/* =========================================================
   CUSTOMER ACTIONS
========================================================= */

/* Customer answered the artist's question -> back to "pending" */
const resubmitBooking = async (req, res) => {
  try {
    const found = await loadBooking(req, res, "customer");
    if (!found) return;
    const { booking } = found;

    if (booking.status !== "info_needed") {
      return fail(res, 400, "This booking is not waiting for information");
    }

    const extra = String(req.body.notes || "").trim();

    if (extra) {
      booking.notes = booking.notes ? `${booking.notes}\n${extra}` : extra;
    }

    booking.status = "pending";
    booking.statusReason = "";
    await booking.save();

    await postMessage(req.app.get("io"), {
      booking,
      sender: req.user,
      type: "system",
      text: extra
        ? `The customer re-submitted the booking: ${extra}`
        : "The customer re-submitted the booking.",
    });

    notify(
      booking._id,
      "artist",
      "Customer re-submitted a booking",
      "The customer answered your question. Please review the booking again.",
    );

    return res.status(200).json({
      success: true,
      message: "Booking re-submitted to the artist",
      booking: await populateBooking(Booking.findById(booking._id)),
    });
  } catch (error) {
    console.error("RESUBMIT BOOKING ERROR:", error);
    return fail(res, 500, "Failed to re-submit booking");
  }
};

/* Cancel - allowed for the customer and for the artist */
const cancelBooking = async (req, res) => {
  try {
    const found = await loadBooking(req, res, "any");
    if (!found) return;
    const { booking, isArtist } = found;

    if (!["pending", "info_needed", "accepted", "confirmed"].includes(booking.status)) {
      return fail(res, 400, `A ${booking.status} booking cannot be cancelled`);
    }

    booking.status = "cancelled";
    booking.statusReason =
      String(req.body.reason || "").trim() ||
      (isArtist ? "Cancelled by the artist" : "Cancelled by the customer");

    // money was already paid -> mark it so the admin can refund it
    if (booking.paymentStatus === "paid") {
      booking.paymentStatus = "refund_pending";
    }

    await booking.save();
    await releaseSlots(booking._id);

    notify(
      booking._id,
      isArtist ? "customer" : "artist",
      "A booking was cancelled",
      `The booking was cancelled. Reason: "${booking.statusReason}".`,
    );

    return res.status(200).json({
      success: true,
      message:
        booking.paymentStatus === "refund_pending"
          ? "Booking cancelled. Your refund will be processed by the admin."
          : "Booking cancelled",
      booking: await populateBooking(Booking.findById(booking._id)),
    });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);
    return fail(res, 500, "Failed to cancel booking");
  }
};

module.exports = {
  getAvailability,
  createBooking,
  getMyBookings,
  getBookingById,
  acceptBooking,
  rejectBooking,
  completeBooking,
  resubmitBooking,
  cancelBooking,
};
