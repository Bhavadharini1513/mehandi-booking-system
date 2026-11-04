import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getArtistProfile } from "../../services/artistService";

import { getMyBookings } from "../../services/bookingService";

import { ArtistProfile } from "../../types/Artist";
import { Booking, BookingStatus, PaymentStatus } from "../../types/Booking";

function ArtistDashboard() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        const [data, bookingData] = await Promise.all([
          getArtistProfile(),
          getMyBookings(),
        ]);

        setProfile(data.profile);
        setBookings(bookingData.bookings || []);
      } catch (error: any) {
        console.error(
          "Artist profile error:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-emerald-700">Loading Artist Dashboard...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Artist profile not found.</p>
      </div>
    );
  }

  const count = (...statuses: BookingStatus[]): number =>
    bookings.filter((b) => statuses.includes(b.status)).length;

  const earnings: number = bookings
    .filter((b) => b.paymentStatus === PaymentStatus.PAID)
    .reduce((sum, b) => sum + b.amount, 0);

  const summary: [string, number | string, string][] = [
    ["New requests", count(BookingStatus.PENDING), "bg-yellow-50 text-yellow-700"],
    ["Waiting for info", count(BookingStatus.INFO_NEEDED), "bg-orange-50 text-orange-700"],
    ["Awaiting payment", count(BookingStatus.ACCEPTED), "bg-blue-50 text-blue-700"],
    ["Confirmed", count(BookingStatus.CONFIRMED), "bg-emerald-100 text-emerald-700"],
    ["Completed", count(BookingStatus.COMPLETED), "bg-green-50 text-green-700"],
    ["Earnings (₹)", earnings, "bg-amber-50 text-amber-700"],
  ];

  return (
    <div className="min-h-screen bg-emerald-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-800">
          Artist Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Manage your Mehandi artist profile.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
          {summary.map(([title, value, style]) => (
            <div key={title} className={`rounded-2xl p-5 ${style}`}>
              <p className="text-sm">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>

        <Link
          to="/my-bookings"
          className="inline-block mt-6 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Manage booking requests →
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold">{profile.user.name}</h2>

          <p className="text-gray-500 mt-1">{profile.user.email}</p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <p className="font-semibold">Experience</p>

              <p className="text-gray-600">{profile.experience} years</p>
            </div>

            <div>
              <p className="font-semibold">Specialization</p>

              <p className="text-gray-600">{profile.specialization}</p>
            </div>

            <div>
              <p className="font-semibold">Location</p>

              <p className="text-gray-600">{profile.location}</p>
            </div>

            <div>
              <p className="font-semibold">Price per hour</p>

              <p className="text-gray-600">₹{profile.pricePerHour ?? 500}</p>
            </div>

            <div>
              <p className="font-semibold">Status</p>

              <span className="inline-block mt-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                {profile.status}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-lg">About</h3>

            <p className="text-gray-600 mt-2">{profile.bio}</p>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-lg">Services</h3>

            <div className="flex flex-wrap gap-2 mt-3">
              {profile.services.map((service: string, index: number) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistDashboard;
