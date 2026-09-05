import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getDashboardStats } from "../../services/adminService";

interface Stats {
  totalCustomers: number;
  totalArtists: number;
  pendingApplications: number;
  rejectedApplications: number;
  totalBookings: number;
  completedBookings: number;
}

interface ManagementCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
}

function ManagementCard({
  title,
  description,
  icon,
  link,
}: ManagementCardProps) {
  return (
    <Link
      to={link}
      className="bg-white rounded-2xl shadow-md p-6
                 hover:shadow-xl hover:-translate-y-1
                 transition-all duration-300 block"
    >
      <div className="text-4xl mb-4">{icon}</div>

      <h3 className="text-xl font-bold text-gray-800">{title}</h3>

      <p className="text-gray-500 mt-2">{description}</p>

      <div className="mt-4 text-emerald-700 font-semibold">Manage →</div>
    </Link>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    totalArtists: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalBookings: 0,
    completedBookings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);

      const response = await getDashboardStats();

      setStats(response.stats);
    } catch (error: any) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Unable to load dashboard statistics",
      );
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: "👥",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      title: "Approved Artists",
      value: stats.totalArtists,
      icon: "🎨",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications,
      icon: "⏳",
      bg: "bg-yellow-50",
      text: "text-yellow-600",
    },
    {
      title: "Rejected Applications",
      value: stats.rejectedApplications,
      icon: "❌",
      bg: "bg-red-50",
      text: "text-red-600",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: "📅",
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
    {
      title: "Completed Bookings",
      value: stats.completedBookings,
      icon: "✅",
      bg: "bg-green-50",
      text: "text-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}

      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <p className="text-emerald-200 font-medium">
            Mehandi Management System
          </p>

          <h1 className="text-4xl font-bold mt-2">Admin Dashboard</h1>

          <p className="mt-3 text-emerald-100">
            Monitor and manage customers, artists, applications and bookings.
          </p>
        </div>
      </div>

      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* STATISTICS */}

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Website Overview
        </h2>

        {loading ? (
          <div className="bg-white rounded-xl p-10 text-center shadow">
            <p className="text-emerald-700">Loading dashboard...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card) => (
              <div
                key={card.title}
                className={`${card.bg}
                            rounded-2xl
                            p-6
                            shadow-sm
                            hover:shadow-md
                            transition`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 font-medium">{card.title}</p>

                    <p className={`text-4xl font-bold mt-3 ${card.text}`}>
                      {card.value}
                    </p>
                  </div>

                  <div className="text-4xl">{card.icon}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MANAGEMENT */}

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800">Management</h2>

          <p className="text-gray-500 mt-2 mb-6">
            Manage all major activities of the Mehandi website from here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ManagementCard
              title="Customers"
              description="View all registered customers."
              icon="👥"
              link="/admin/customers"
            />

            <ManagementCard
              title="Artists"
              description="View approved mehendi artists."
              icon="🎨"
              link="/admin/artists"
            />

            <ManagementCard
              title="Artist Applications"
              description="Review and approve or reject artist applications."
              icon="📋"
              link="/admin/applications"
            />

            <ManagementCard
              title="Bookings & Activities"
              description="Monitor customer and artist bookings."
              icon="📅"
              link="/admin/bookings"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
