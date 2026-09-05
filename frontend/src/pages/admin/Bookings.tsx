import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Booking, getBookings } from "../../services/adminService";

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const response = await getBookings();

      setBookings(response.bookings || []);
    } catch (error: any) {
      console.error(error);

      toast.error(error.response?.data?.message || "Unable to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Bookings & Activities
        </h1>

        <p className="text-gray-500 mt-2">
          Monitor customer and artist booking activities.
        </p>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-10 text-center mt-8">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center mt-8">
            <div className="text-5xl mb-4">📅</div>

            <h2 className="text-xl font-bold">No Bookings Found</h2>

            <p className="text-gray-500 mt-2">
              There are no booking activities yet.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md mt-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="p-4 text-left">Customer</th>

                    <th className="p-4 text-left">Artist</th>

                    <th className="p-4 text-left">Service</th>

                    <th className="p-4 text-left">Date / Time</th>

                    <th className="p-4 text-left">Status</th>

                    <th className="p-4 text-left">Artist Location</th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-semibold">
                          {booking.customer?.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.customer?.email}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold">{booking.artist?.name}</p>

                        <p className="text-sm text-gray-500">
                          {booking.artist?.email}
                        </p>
                      </td>

                      <td className="p-4">{booking.service}</td>

                      <td className="p-4">
                        <p>
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.startTime} - {booking.endTime}
                        </p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full
                            text-xs font-semibold
                            uppercase
                            ${getStatusClass(booking.status)}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="p-4">
                        📍{" "}
                        {booking.artistProfile?.location ||
                          booking.artist?.city ||
                          "Not available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Bookings;
