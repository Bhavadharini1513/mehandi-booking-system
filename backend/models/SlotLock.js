const mongoose = require("mongoose");

/*
  One document = one hour of one artist's calendar that is taken.

  The UNIQUE index on (artist, dateKey, hour) is what guarantees that two
  customers can never hold the same hour, even if they press "Book" at the
  same millisecond. The database rejects the second insert.
*/
const SlotLockSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateKey: { type: String, required: true },
    hour: { type: Number, required: true, min: 0, max: 23 },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

SlotLockSchema.index({ artist: 1, dateKey: 1, hour: 1 }, { unique: true });

module.exports = mongoose.model("SlotLock", SlotLockSchema);
