import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getArtistById, PublicArtist } from "../../services/artistService";
import { createBooking, getAvailability } from "../../services/bookingService";
import { Availability } from "../../types/Booking";

// ---------- helpers ----------

const MAX_HOURS = 8;

// Tuple type: [start hour, end hour (exclusive)]
type HourRange = [number, number];

const pad = (hour: number): string => `${String(hour).padStart(2, "0")}:00`;

const label = (hour: number): string => {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12} ${hour < 12 ? "AM" : "PM"}`;
};

// today as YYYY-MM-DD in the browser's local time
const today = (): string => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

function BookArtist() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [artist, setArtist] = useState<PublicArtist | null>(null);
  const [loadingArtist, setLoadingArtist] = useState<boolean>(true);

  const [date, setDate] = useState<string>(today());
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  const [range, setRange] = useState<HourRange | null>(null);
  const [service, setService] = useState<string>("");
  const [venue, setVenue] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ---------- load artist ----------
  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const response = await getArtistById(id as string);
        setArtist(response.artist);

        if (response.artist.services.length === 1) {
          setService(response.artist.services[0]);
        }
      } catch {
        setArtist(null);
      } finally {
        setLoadingArtist(false);
      }
    };

    load();
  }, [id]);

  // ---------- load free / booked hours for the selected date ----------
  const loadSlots = useCallback(async (): Promise<void> => {
    if (!id || !date) return;

    try {
      setLoadingSlots(true);
      setAvailability(await getAvailability(id, date));
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to load time slots");
    } finally {
      setLoadingSlots(false);
    }
  }, [id, date]);

  useEffect(() => {
    setRange(null);
    loadSlots();
  }, [loadSlots]);

  // ---------- slot selection ----------
  const hours = useMemo<number[]>(() => {
    if (!availability) return [];

    const list: number[] = [];
    for (let h = availability.openHour; h < availability.closeHour; h += 1) {
      list.push(h);
    }
    return list;
  }, [availability]);

  const isBlocked = (hour: number): boolean =>
    availability?.blockedHours.includes(hour) ?? false;

  const isSelected = (hour: number): boolean =>
    range !== null && hour >= range[0] && hour < range[1];

  const handleHourClick = (hour: number): void => {
    if (isBlocked(hour)) return;

    // nothing selected, or a click far away -> start a new selection
    if (range === null || isSelected(hour)) {
      setRange(range !== null && isSelected(hour) ? null : [hour, hour + 1]);
      return;
    }

    const [start, end] = range;

    if (hour === end && end - start < MAX_HOURS) {
      setRange([start, end + 1]); // extend to the right
    } else if (hour === start - 1 && end - start < MAX_HOURS) {
      setRange([hour, end]); // extend to the left
    } else {
      setRange([hour, hour + 1]); // not adjacent -> start again
    }
  };

  const duration: number = range ? range[1] - range[0] : 0;
  const total: number = duration * (artist?.pricePerHour ?? 0);

  // ---------- submit ----------
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!artist || !range) {
      toast.error("Please select your time on the calendar");
      return;
    }

    if (!service) {
      toast.error("Please select a service");
      return;
    }

    try {
      setSubmitting(true);

      await createBooking({
        artistProfileId: artist._id,
        service,
        date,
        startTime: pad(range[0]),
        endTime: pad(range[1]),
        venue,
        notes,
      });

      toast.success("Booking request sent to the artist");
      navigate("/my-bookings");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");

      // somebody else may have taken the time -> refresh the grid
      if (error.response?.status === 409) {
        setRange(null);
        loadSlots();
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- render ----------
  if (loadingArtist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        Loading...
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Artist not found</h1>

          <Link to="/artists" className="text-emerald-700 mt-4 inline-block">
            ← Back to Artists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <Link to={`/artists/${artist._id}`} className="text-emerald-700 font-semibold">
          ← Back to profile
        </Link>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-xl p-8 mt-6 space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-emerald-900">
              Book {artist.name}
            </h1>

            <p className="text-gray-500 mt-1">
              📍 {artist.location} · 💼 {artist.experience} yrs · ₹
              {artist.pricePerHour} / hour
            </p>
          </div>

          {/* DATE */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              1. Choose a date
            </label>

            <input
              type="date"
              min={today()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3"
              required
            />
          </div>

          {/* TIME SLOTS */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              2. Choose your time
            </label>

            <p className="text-sm text-gray-500 mb-3">
              Click an hour. Click the next hours to book longer (max{" "}
              {MAX_HOURS} hours). Greyed-out hours are not available.
            </p>

            {loadingSlots ? (
              <p className="text-gray-500">Loading time slots...</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {hours.map((hour) => {
                  const blocked = isBlocked(hour);
                  const booked = availability?.bookedHours.includes(hour);
                  const selected = isSelected(hour);

                  return (
                    <button
                      key={hour}
                      type="button"
                      disabled={blocked}
                      onClick={() => handleHourClick(hour)}
                      className={`rounded-xl py-3 text-sm font-semibold border transition ${
                        selected
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : blocked
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      {label(hour)}

                      {blocked && (
                        <span className="block text-[10px] font-normal">
                          {booked ? "Booked" : "Passed"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* SERVICE */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              3. Service
            </label>

            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
              required
            >
              <option value="">Select service</option>

              {artist.services.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* VENUE + NOTES */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              4. Event address (optional)
            </label>

            <input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Where should the artist come?"
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Notes for the artist (optional)
            </label>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Design ideas, number of people, special requests..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3"
            />
          </div>

          {/* SUMMARY */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            {range ? (
              <>
                <p className="text-emerald-900 font-semibold">
                  {date} · {pad(range[0])} – {pad(range[1])} ({duration}{" "}
                  {duration === 1 ? "hour" : "hours"})
                </p>

                <p className="text-2xl font-bold text-emerald-800 mt-1">
                  Total: ₹{total}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  You pay only after the artist accepts your request.
                </p>
              </>
            ) : (
              <p className="text-gray-500">No time selected yet.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !range}
            className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white py-3 rounded-xl font-semibold"
          >
            {submitting ? "Sending..." : "Send Booking Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BookArtist;
