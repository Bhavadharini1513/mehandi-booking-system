const crypto = require("crypto");
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const { sendMail } = require("../utils/mailer");

/*
  PAYMENTS
  --------
  LIVE mode  : RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are set in .env.
               An order is created on Razorpay and the payment signature that
               comes back from the browser is verified with HMAC-SHA256.

  DEMO mode  : the keys are not set. A fake order is created and the front end
               shows a "demo payment" window. No money is involved. This lets
               the full flow be shown without a payment account.
*/

const keyId = () => process.env.RAZORPAY_KEY_ID;
const keySecret = () => process.env.RAZORPAY_KEY_SECRET;
const isLive = () => Boolean(keyId() && keySecret());

const fail = (res, status, message) =>
  res.status(status).json({ success: false, message });

const createRazorpayOrder = async (amountInPaise, receipt) => {
  const auth = Buffer.from(`${keyId()}:${keySecret()}`).toString("base64");

  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: "INR",
      receipt,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.description || "Razorpay order failed");
  }

  return data;
};

const safeEqual = (a, b) => {
  const first = Buffer.from(String(a));
  const second = Buffer.from(String(b));
  return first.length === second.length && crypto.timingSafeEqual(first, second);
};

/* GET /api/payments/config */
const getPaymentConfig = (req, res) =>
  res.status(200).json({
    success: true,
    mode: isLive() ? "live" : "demo",
    keyId: isLive() ? keyId() : "",
  });

/* Load an accepted, unpaid booking that belongs to the logged in customer */
const loadPayableBooking = async (req, res, bookingId) => {
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    fail(res, 400, "Invalid booking id");
    return null;
  }

  const booking = await Booking.findById(bookingId)
    .populate("customer", "name email")
    .populate("artist", "name email");

  if (!booking) {
    fail(res, 404, "Booking not found");
    return null;
  }

  if (String(booking.customer._id) !== String(req.user._id)) {
    fail(res, 403, "This is not your booking");
    return null;
  }

  if (booking.status !== "accepted") {
    fail(res, 400, "Payment is only possible after the artist accepts the booking");
    return null;
  }

  if (booking.paymentStatus === "paid") {
    fail(res, 400, "This booking is already paid");
    return null;
  }

  return booking;
};

/* POST /api/payments/create-order   body: { bookingId } */
const createOrder = async (req, res) => {
  try {
    const booking = await loadPayableBooking(req, res, req.body.bookingId);
    if (!booking) return;

    if (booking.amount <= 0) {
      return fail(res, 400, "This booking has no amount to pay");
    }

    const amountInPaise = Math.round(booking.amount * 100);
    let orderId;

    if (isLive()) {
      const order = await createRazorpayOrder(amountInPaise, String(booking._id));
      orderId = order.id;
    } else {
      orderId = `order_demo_${crypto.randomBytes(8).toString("hex")}`;
    }

    booking.paymentOrderId = orderId;
    await booking.save();

    return res.status(200).json({
      success: true,
      mode: isLive() ? "live" : "demo",
      keyId: isLive() ? keyId() : "",
      orderId,
      amount: amountInPaise,
      currency: "INR",
      booking: {
        _id: booking._id,
        service: booking.service,
        artist: booking.artist.name,
        customer: booking.customer.name,
        email: booking.customer.email,
      },
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return fail(res, 500, error.message || "Failed to create payment order");
  }
};

/* POST /api/payments/verify   body: { bookingId, orderId, paymentId, signature } */
const verifyPayment = async (req, res) => {
  try {
    const { bookingId, orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId) {
      return fail(res, 400, "orderId and paymentId are required");
    }

    const booking = await loadPayableBooking(req, res, bookingId);
    if (!booking) return;

    if (booking.paymentOrderId !== orderId) {
      return fail(res, 400, "Order does not match this booking");
    }

    if (isLive()) {
      const expected = crypto
        .createHmac("sha256", keySecret())
        .update(`${orderId}|${paymentId}`)
        .digest("hex");

      if (!signature || !safeEqual(expected, signature)) {
        return fail(res, 400, "Payment verification failed");
      }
    } else if (!String(paymentId).startsWith("pay_demo_")) {
      return fail(res, 400, "Payment verification failed");
    }

    booking.paymentStatus = "paid";
    booking.paymentId = paymentId;
    booking.paidAt = new Date();
    booking.status = "confirmed";
    await booking.save();

    const text = (name, extra) =>
      [
        `Hello ${name},`,
        "",
        extra,
        "",
        `Service : ${booking.service}`,
        `When    : ${booking.dateKey} ${booking.startTime}-${booking.endTime}`,
        `Paid    : Rs. ${booking.amount}`,
        `Payment : ${paymentId}`,
      ].join("\n");

    sendMail({
      to: booking.customer.email,
      subject: "Payment received - booking confirmed",
      text: text(booking.customer.name, "Your payment was successful and your booking is confirmed."),
    });

    sendMail({
      to: booking.artist.email,
      subject: "Booking paid and confirmed",
      text: text(booking.artist.name, "The customer has paid. The booking is confirmed."),
    });

    return res.status(200).json({
      success: true,
      message: "Payment successful. Booking confirmed!",
      booking: {
        _id: booking._id,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        paymentId: booking.paymentId,
      },
    });
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    return fail(res, 500, "Failed to verify payment");
  }
};

module.exports = { getPaymentConfig, createOrder, verifyPayment };
