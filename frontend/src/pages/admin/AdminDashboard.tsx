import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminNavbar from "../../components/layouts/AdminNavbar";

import { getDashboardStats } from "../../services/adminService";

interface Stats {
  totalCustomers: number;
  totalArtists: number;
  pendingApplications: number;
  rejectedApplications: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalArtists: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
  });

  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      setLoading(true);

      const response = await getDashboardStats();

      console.log("ADMIN STATS:", response);

      setStats(response.stats);
    } catch (error: any) {
      console.error("ADMIN STATS ERROR:", error);

      toast.error(
        error.response?.data?.message || "Unable to load dashboard statistics",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      {/* Header */}
      <div className="bg-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>

          <p className="mt-2 text-emerald-100">
            Manage customers, artists, applications and bookings.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-10">
            <p className="text-xl text-emerald-700">Loading dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Customers */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-4xl">👥</div>

              <p className="text-gray-500 mt-4">Total Customers</p>

              <h2 className="text-4xl font-bold text-blue-600 mt-2">
                {stats.totalCustomers}
              </h2>
            </div>

            {/* Artists */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-4xl">🎨</div>

              <p className="text-gray-500 mt-4">Approved Artists</p>

              <h2 className="text-4xl font-bold text-emerald-600 mt-2">
                {stats.totalArtists}
              </h2>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-4xl">⏳</div>

              <p className="text-gray-500 mt-4">Pending Applications</p>

              <h2 className="text-4xl font-bold text-yellow-600 mt-2">
                {stats.pendingApplications}
              </h2>
            </div>

            {/* Rejected */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-4xl">❌</div>

              <p className="text-gray-500 mt-4">Rejected Applications</p>

              <h2 className="text-4xl font-bold text-red-600 mt-2">
                {stats.rejectedApplications}
              </h2>
            </div>
          </div>
        )}

        {/* Admin Modules */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Admin Management
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/admin/customers"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">👥</div>

              <h3 className="text-xl font-bold">Customers</h3>

              <p className="text-gray-500 mt-2">
                View registered customers and their activities.
              </p>
            </a>

            <a
              href="/admin/artists"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">🎨</div>

              <h3 className="text-xl font-bold">Artists</h3>

              <p className="text-gray-500 mt-2">
                View approved artists and their profiles.
              </p>
            </a>

            <a
              href="/admin/applications"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">📋</div>

              <h3 className="text-xl font-bold">Applications</h3>

              <p className="text-gray-500 mt-2">
                Approve or reject artist applications.
              </p>
            </a>

            <a
              href="/admin/bookings"
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">📅</div>

              <h3 className="text-xl font-bold">Bookings</h3>

              <p className="text-gray-500 mt-2">
                View customer and artist bookings.
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
