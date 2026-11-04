const Message = require("../models/Message");

/*
  Save a chat message and push it to everybody who has the chat open
  (Socket.IO room "booking:<id>").
*/
const postMessage = async (io, { booking, sender, text, type = "user" }) => {
  const message = await Message.create({
    booking: booking._id || booking,
    sender: sender._id || sender,
    text,
    type,
  });

  const payload = {
    _id: message._id,
    booking: String(message.booking),
    sender: String(message.sender),
    text: message.text,
    type: message.type,
    createdAt: message.createdAt,
  };

  if (io) io.to(`booking:${payload.booking}`).emit("message", payload);

  return payload;
};

module.exports = { postMessage };
