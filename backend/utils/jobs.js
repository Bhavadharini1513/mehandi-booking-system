const Booking = require("../models/Booking");
const SlotLock = require("../models/SlotLock");

/*
  Background job: an accepted booking has to be paid within 24 hours
  (see paymentDueAt). If not, the booking is cancelled and the time slot is
  released so that other customers can book it.
*/
const expireUnpaidBookings = async () => {
  try {
    const expired = await Booking.find({
      status: "accepted",
      paymentStatus: "unpaid",
      paymentDueAt: { $lt: new Date() },
    }).select("_id");

    for (const booking of expired) {
      await Booking.updateOne(
        { _id: booking._id },
        {
          $set: {
            status: "cancelled",
            statusReason: "Payment was not completed in time",
          },
        },
      );
      await SlotLock.deleteMany({ booking: booking._id });
    }

    if (expired.length) {
      console.log(`Released ${expired.length} unpaid booking(s)`);
    }
  } catch (error) {
    console.error("EXPIRE JOB ERROR:", error.message);
  }
};

const startJobs = () => {
  expireUnpaidBookings();
  return setInterval(expireUnpaidBookings, 5 * 60 * 1000);
};

module.exports = { startJobs, expireUnpaidBookings };
