import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  acceptBooking,
  cancelBooking,
  completeBooking,
  getMyBookings,
  rejectBooking,
  resubmitBooking,
} from "../../services/bookingService";

import {
  BadgeStyle,
  Booking,
  BookingStatus,
  PaymentStatus,
} from "../../types/Booking";

import useAuth from "../../hooks/useAuth";

// ---------- status badge look (Record + tuple) ----------
const BADGES: Record<BookingStatus, BadgeStyle> = {
  [BookingStatus.PENDING]: ["Waiting for artist", "bg-yellow-100 text-yellow-800"],
  [BookingStatus.INFO_NEEDED]: ["More info needed", "bg-orange-100 text-orange-800"],
  [BookingStatus.ACCEPTED]: ["Accepted - payment due", "bg-blue-100 text-blue-800"],
  [BookingStatus.CONFIRMED]: ["Confirmed & paid", "bg-emerald-100 text-emerald-800"],
  [BookingStatus.COMPLETED]: ["Completed", "bg-green-100 text-green-800"],
  [BookingStatus.REJECTED]: ["Rejected", "bg-red-100 text-red-800"],
  [BookingStatus.CANCELLED]: ["Cancelled", "bg-gray-200 text-gray-700"],
};

type Filter = "all" | "active" | "done";

const ACTIVE: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.INFO_NEEDED,
  BookingStatus.ACCEPTED,
  BookingStatus.CONFIRMED,
];

function MyBookings() {
  const { user } = useAuth();
  const isArtist: boolean = user?.role === "artist";

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string>("");

  // artist: reject dialog
  const [rejecting, setRejecting] = useState<Booking | null>(null);
  const [reason, setReason] = useState<string>("");
  const [needMoreInfo, setNeedMoreInfo] = useState<boolean>(true);

  // customer: answer to "more info needed"
  const [answerFor, setAnswerFor] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const loadBookings = useCallback(async (): Promise<void> => {
    try {
      const response = await getMyBookings();
      setBookings(response.bookings || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookings();

    // refresh every 15 s so status changes appear without reloading
    const timer = window.setInterval(loadBookings, 15000);

    return () => window.clearInterval(timer);
  }, [loadBookings]);

  // run an action, show the server message, reload the list
  const run = async (
    id: string,
    action: () => Promise<{ message: string }>,
  ): Promise<boolean> => {
    try {
      setBusyId(id);
      const response = await action();
      toast.success(response.message);
      await loadBookings();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Action failed");
      return false;
    } finally {
      setBusyId("");
    }
  };

  const submitReject = async (): Promise<void> => {
    if (!rejecting) return;

    if (reason.trim().length < 5) {
      toast.error("Please write a reason (at least 5 characters)");
      return;
    }

    const ok = await run(rejecting._id, () =>
      rejectBooking(rejecting._id, reason.trim(), needMoreInfo),
    );

    if (ok) {
      setRejecting(null);
      setReason("");
      setNeedMoreInfo(true);
    }
  };

  const submitAnswer = async (id: string): Promise<void> => {
    const ok = await run(id, () => resubmitBooking(id, answer.trim()));

    if (ok) {
      setAnswerFor("");
      setAnswer("");
    }
  };

  const confirmCancel = (booking: Booking): void => {
    const paid = booking.paymentStatus === PaymentStatus.PAID;

    const text = paid
      ? "This booking is already paid. Cancel it and request a refund?"
      : "Cancel this booking?";

    if (window.confirm(text)) {
      run(booking._id, () => cancelBooking(booking._id));
    }
  };

  const visible = bookings.filter((b) => {
    if (filter === "active") return ACTIVE.includes(b.status);
    if (filter === "done") return !ACTIVE.includes(b.status);
    return true;
  });

  const btn = "px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50";

  return (
    <div className="min-h-screen bg-emerald-50 px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-900">
          {isArtist ? "Booking Requests" : "My Bookings"}
        </h1>

        <p className="text-gray-600 mt-2">
          {isArtist
            ? "Accept or reject orders from customers and chat with them."
            : "Track your orders, pay after the artist accepts, and chat with the artist."}
        </p>

        {/* FILTER */}
        <div className="flex gap-2 mt-6">
          {(["all", "active", "done"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                filter === f
                  ? "bg-emerald-700 text-white"
                  : "bg-white text-emerald-800 border border-emerald-200"
              }`}
            >
              {f === "all" ? "All" : f === "active" ? "Active" : "Finished"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">Loading bookings...</div>
        ) : visible.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 mt-8 text-center">
            <h2 className="text-xl font-semibold">No bookings here</h2>

            {!isArtist && (
              <Link to="/artists" className="text-emerald-700 mt-3 inline-block font-semibold">
                Find an artist →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-5 mt-6">
            {visible.map((booking) => {
              const other = isArtist ? booking.customer : booking.artist;
              const [badgeText, badgeClass] = BADGES[booking.status];
              const busy = busyId === booking._id;

              return (
                <div key={booking._id} className="bg-white rounded-2xl shadow p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-bold text-emerald-800">
                        {booking.service}
                      </h2>

                      <p className="text-gray-600 mt-1">
                        {isArtist ? "Customer" : "Artist"}: {other?.name}
                        {isArtist && other?.phone ? ` · 📞 ${other.phone}` : ""}
                      </p>

                      <p className="text-gray-500 text-sm mt-1">
                        📅 {booking.dateKey} · 🕘 {booking.startTime} –{" "}
                        {booking.endTime} ({booking.hours}h)
                      </p>

                      {booking.venue && (
                        <p className="text-gray-500 text-sm">🏠 {booking.venue}</p>
                      )}
                    </div>

                    <div className="md:text-right">
                      <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${badgeClass}`}>
                        {badgeText}
                      </span>

                      <p className="text-2xl font-bold text-emerald-900 mt-2">
                        ₹{booking.amount}
                      </p>

                      <p className="text-xs text-gray-500">
                        {booking.paymentStatus === PaymentStatus.PAID && "Paid ✔"}
                        {booking.paymentStatus === PaymentStatus.UNPAID && "Not paid"}
                        {booking.paymentStatus === PaymentStatus.REFUND_PENDING &&
                          "Refund pending"}
                      </p>
                    </div>
                  </div>

                  {booking.notes && (
                    <p className="mt-4 bg-gray-50 p-3 rounded-lg text-gray-600 text-sm whitespace-pre-line">
                      📝 {booking.notes}
                    </p>
                  )}

                  {booking.statusReason &&
                    [
                      BookingStatus.INFO_NEEDED,
                      BookingStatus.REJECTED,
                      BookingStatus.CANCELLED,
                    ].includes(booking.status) && (
                      <p className="mt-3 bg-orange-50 border border-orange-200 p-3 rounded-lg text-orange-900 text-sm">
                        <strong>Message: </strong>
                        {booking.statusReason}
                      </p>
                    )}

                  {booking.status === BookingStatus.ACCEPTED &&
                    booking.paymentDueAt && (
                      <p className="mt-3 text-sm text-blue-800">
                        ⏳ Payment due before{" "}
                        {new Date(booking.paymentDueAt).toLocaleString()}
                      </p>
                    )}

                  {/* ---------- ACTIONS ---------- */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    {/* ARTIST */}
                    {isArtist &&
                      [BookingStatus.PENDING, BookingStatus.INFO_NEEDED].includes(
                        booking.status,
                      ) && (
                        <>
                          <button
                            disabled={busy}
                            onClick={() => run(booking._id, () => acceptBooking(booking._id))}
                            className={`${btn} bg-emerald-600 hover:bg-emerald-700`}
                          >
                            Accept
                          </button>

                          <button
                            disabled={busy}
                            onClick={() => setRejecting(booking)}
                            className={`${btn} bg-red-600 hover:bg-red-700`}
                          >
                            Reject
                          </button>
                        </>
                      )}

                    {isArtist && booking.status === BookingStatus.CONFIRMED && (
                      <button
                        disabled={busy}
                        onClick={() => run(booking._id, () => completeBooking(booking._id))}
                        className={`${btn} bg-blue-600 hover:bg-blue-700`}
                      >
                        Mark Completed
                      </button>
                    )}

                    {/* CUSTOMER */}
                    {!isArtist && booking.status === BookingStatus.ACCEPTED && (
                      <Link
                        to={`/pay/${booking._id}`}
                        className={`${btn} bg-pink-600 hover:bg-pink-700`}
                      >
                        Pay ₹{booking.amount}
                      </Link>
                    )}

                    {!isArtist && booking.status === BookingStatus.INFO_NEEDED && (
                      <button
                        onClick={() =>
                          setAnswerFor(answerFor === booking._id ? "" : booking._id)
                        }
                        className={`${btn} bg-orange-600 hover:bg-orange-700`}
                      >
                        Answer &amp; Re-submit
                      </button>
                    )}

                    {/* BOTH */}
                    {ACTIVE.includes(booking.status) &&
                      !(isArtist && booking.status === BookingStatus.PENDING) && (
                        <button
                          disabled={busy}
                          onClick={() => confirmCancel(booking)}
                          className={`${btn} bg-gray-500 hover:bg-gray-600`}
                        >
                          Cancel
                        </button>
                      )}

                    {!isArtist && booking.status === BookingStatus.PENDING && (
                      <button
                        disabled={busy}
                        onClick={() => confirmCancel(booking)}
                        className={`${btn} bg-gray-500 hover:bg-gray-600`}
                      >
                        Cancel
                      </button>
                    )}

                    <Link
                      to={`/chat/${booking._id}`}
                      className={`${btn} bg-emerald-800 hover:bg-emerald-900`}
                    >
                      💬 Chat
                    </Link>
                  </div>

                  {/* customer answer box */}
                  {answerFor === booking._id && (
                    <div className="mt-4 bg-orange-50 border border-orange-200 rounded-xl p-4">
                      <p className="text-sm text-orange-900 mb-2">
                        Write the extra information the artist asked for. You can
                        also use the chat.
                      </p>

                      <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg p-3"
                        placeholder="Your answer..."
                      />

                      <button
                        disabled={busy}
                        onClick={() => submitAnswer(booking._id)}
                        className={`${btn} bg-orange-600 hover:bg-orange-700 mt-3`}
                      >
                        Send to artist
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ---------- REJECT DIALOG (artist) ---------- */}
      {rejecting && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800">Reject this order</h3>

            <p className="text-sm text-gray-500 mt-1">
              {rejecting.customer.name} · {rejecting.dateKey}{" "}
              {rejecting.startTime}–{rejecting.endTime}
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              placeholder="Tell the customer why (or what you need to know)..."
              className="w-full border border-gray-300 rounded-lg p-3 mt-4"
            />

            <label className="flex items-start gap-2 mt-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={needMoreInfo}
                onChange={(e) => setNeedMoreInfo(e.target.checked)}
                className="mt-1"
              />
              <span>
                I need <strong>more information</strong> from the customer. The
                time stays reserved and we open the chat. (Untick to reject
                completely and free the time.)
              </span>
            </label>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setRejecting(null)}
                className="px-4 py-2 rounded-lg border border-gray-300"
              >
                Close
              </button>

              <button
                disabled={busyId === rejecting._id}
                onClick={submitReject}
                className={`${btn} bg-red-600 hover:bg-red-700`}
              >
                {needMoreInfo ? "Ask for info" : "Reject order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
