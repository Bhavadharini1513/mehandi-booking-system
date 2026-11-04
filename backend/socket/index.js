const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/User");
const Booking = require("../models/Booking");

/*
  Real-time chat (Socket.IO)
  --------------------------
  1. The browser connects with its JWT:  io(url, { auth: { token } })
  2. It asks to join a booking room:      socket.emit("join", bookingId, ack)
  3. The server only lets the customer and the artist of that booking in.
  4. New messages are broadcast by utils/chat.js  ->  io.to("booking:<id>")
*/
const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.CLIENT_URL,
        "http://localhost:5173",
        "http://localhost:8080",
      ].filter(Boolean),
      credentials: true,
    },
  });

  // Authenticate every connection
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) return next(new Error("Not authorized"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("_id role name");

      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join", async (bookingId, ack) => {
      const reply = typeof ack === "function" ? ack : () => {};

      try {
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
          return reply({ ok: false, message: "Invalid booking id" });
        }

        const booking = await Booking.findById(bookingId).select("customer artist");

        if (!booking) return reply({ ok: false, message: "Booking not found" });

        const userId = String(socket.user._id);

        if (
          String(booking.customer) !== userId &&
          String(booking.artist) !== userId
        ) {
          return reply({ ok: false, message: "Access denied" });
        }

        socket.join(`booking:${bookingId}`);
        return reply({ ok: true });
      } catch (error) {
        return reply({ ok: false, message: "Could not join" });
      }
    });

    socket.on("leave", (bookingId) => {
      socket.leave(`booking:${bookingId}`);
    });
  });

  return io;
};

module.exports = initSocket;
