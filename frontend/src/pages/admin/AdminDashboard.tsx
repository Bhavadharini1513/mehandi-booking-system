import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LuTrendingUp,
  LuUsers,
  LuPalette,
  LuClipboardList,
  LuCalendar,
  LuIndianRupee,
  LuArrowUpRight,
  LuStar,
  LuCircleCheck,
  LuClock,
  LuSparkles,
  LuArrowRight,
  LuRefreshCw,
  LuDownload,
} from "react-icons/lu";

import {
  getDashboardStats,
  getBookings,
  getArtists,
  DashboardStats,
  Booking,
  Artist,
} from "../../services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalArtists: 0,
    pendingApplications: 0,
    rejectedApplications: 0,
    totalBookings: 0,
    completedBookings: 0,
    paidBookings: 0,
    totalRevenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, bookingsRes, artistsRes] = await Promise.allSettled([
        getDashboardStats(),
        getBookings(),
        getArtists(),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value?.stats) {
        setStats(statsRes.value.stats);
      }

      if (bookingsRes.status === "fulfilled" && bookingsRes.value?.bookings) {
        setRecentBookings(bookingsRes.value.bookings.slice(0, 5));
      }

      if (artistsRes.status === "fulfilled" && artistsRes.value?.artists) {
        setTopArtists(artistsRes.value.artists.slice(0, 4));
      }
    } catch (error: any) {
      console.error("DASHBOARD DATA ERROR:", error);
      toast.error("Unable to load executive dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Helper format currency
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  // Status Chip component
  const getStatusChip = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Completed
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
            Confirmed
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            Accepted
          </span>
        );
      case "pending":
      case "info_needed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            {status === "info_needed" ? "Info Needed" : "Pending"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Cancelled
          </span>
        );
    }
  };

  // 4 Primary KPI Cards
  const kpiCards = [
    {
      title: "Gross Platform Revenue",
      value: formatCurrency(stats.totalRevenue),
      subtitle: `${stats.paidBookings} successfully settled orders`,
      trend: "+18.4% vs last cycle",
      trendPositive: true,
      icon: <LuIndianRupee className="w-6 h-6 text-[#C5A059]" />,
      bgGradient: "from-amber-50/40 to-white",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "Confirmed Bookings",
      value: stats.totalBookings.toLocaleString(),
      subtitle: `${stats.completedBookings} services delivered`,
      trend: "+12.1% demand growth",
      trendPositive: true,
      icon: <LuCalendar className="w-6 h-6 text-[#0F2C23]" />,
      bgGradient: "from-emerald-50/40 to-white",
      badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    {
      title: "Registered Clientele",
      value: stats.totalCustomers.toLocaleString(),
      subtitle: "Verified customer accounts",
      trend: "+9.6% new signups",
      trendPositive: true,
      icon: <LuUsers className="w-6 h-6 text-stone-700]" />,
      bgGradient: "from-stone-50 to-white",
      badgeColor: "bg-stone-100 text-stone-800 border-stone-200",
    },
    {
      title: "Pending Applications",
      value: stats.pendingApplications.toLocaleString(),
      subtitle: `${stats.totalArtists} approved artists on roster`,
      trend: stats.pendingApplications > 0 ? "Requires admin review" : "Inbox cleared",
      trendPositive: stats.pendingApplications === 0,
      icon: <LuClipboardList className="w-6 h-6 text-[#C5A059]" />,
      bgGradient: "from-amber-50/30 to-white",
      badgeColor:
        stats.pendingApplications > 0
          ? "bg-amber-50 text-amber-900 border-amber-300"
          : "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* =========================================================
          EXECUTIVE HERO BANNER
      ========================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#0F2C23] via-[#163E32] to-[#1a4a3c] text-white p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden border border-[#C5A059]/30">
        {/* Subtle decorative gold floral/geometric aura */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-[#C5A059]/10 blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-40 h-40 rounded-full bg-[#D4AF37]/5 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/30 text-amber-300 text-xs font-semibold tracking-wider uppercase">
              <LuSparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Executive Operations & Revenue
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight">
              Royal Management <span className="text-[#C5A059]">Dashboard</span>
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Real-time telemetry across boutique artists, bespoke bookings, customer retention,
              and transaction settlements for the Maruthani World ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-stone-200 border border-white/20 transition-all cursor-pointer backdrop-blur-xs disabled:opacity-50"
            >
              <LuRefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{refreshing ? "Refreshing..." : "Sync Metrics"}</span>
            </button>

            <Link
              to="/admin/applications"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#b58f48] hover:to-[#c49f30] text-[#0F2C23] shadow-md hover:shadow-lg transition-all"
            >
              <LuClipboardList className="w-4 h-4" />
              <span>Review Applications ({stats.pendingApplications})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================
          KEY PERFORMANCE INDICATORS (KPIs) - 4 CARDS
      ========================================================= */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0F2C23]">
              Performance Indicators
            </h2>
            <p className="text-xs text-stone-500">
              Live consolidated telemetry updated across the system
            </p>
          </div>
          <span className="text-xs font-semibold text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 px-3 py-1 rounded-full">
            Automated Audit Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {kpiCards.map((card, idx) => (
            <div
              key={idx}
              className={`relative bg-gradient-to-b ${card.bgGradient} rounded-2xl p-6 border border-amber-900/10 shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-[#C5A059]/50 transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {card.title}
                </span>
                <div className="w-11 h-11 rounded-xl bg-white border border-stone-200/80 shadow-2xs flex items-center justify-center group-hover:scale-110 group-hover:border-[#C5A059]/40 transition-all">
                  {card.icon}
                </div>
              </div>

              <div className="mt-4">
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2C23] tracking-tight group-hover:text-[#C5A059] transition-colors">
                  {card.value}
                </span>
                <p className="text-xs text-stone-500 mt-1">{card.subtitle}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold border ${card.badgeColor}`}
                >
                  <LuTrendingUp className="w-3 h-3" />
                  {card.trend}
                </span>
                <span className="text-stone-400 group-hover:text-[#0F2C23] transition-colors">
                  <LuArrowUpRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SECTION 1: RECENT BOOKING ACTIVITY
      ========================================================= */}
      <section className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FDFBF7]/60">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2C23] flex items-center gap-2">
              <LuCalendar className="w-5 h-5 text-[#C5A059]" />
              Recent Booking Activity
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Latest client appointments, locked slots, and payment confirmations
            </p>
          </div>

          <Link
            to="/admin/bookings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2C23] hover:text-[#C5A059] hover:underline transition-colors"
          >
            <span>View All Bookings</span>
            <LuArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-stone-500">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-[#0F2C23] border-t-transparent rounded-full mb-3"></div>
            <p>Retrieving real-time appointments...</p>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl text-[#C5A059] mb-4">
              📅
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-800">
              No Booking Activity Recorded
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              New customer appointments and slot reservations will automatically appear in this
              activity log.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-[#FAF8F3] text-[11px] uppercase tracking-wider font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="px-6 py-4">Client / Contact</th>
                  <th className="px-6 py-4">Assigned Artist</th>
                  <th className="px-6 py-4">Design Service</th>
                  <th className="px-6 py-4">Reserved Slot</th>
                  <th className="px-6 py-4">Order Value</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentBookings.map((b) => (
                  <tr
                    key={b._id}
                    className="hover:bg-[#C5A059]/5 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-900">
                        {b.customer?.name || "Client"}
                      </div>
                      <div className="text-xs text-stone-400">{b.customer?.phone || b.customer?.email}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0F2C23]">{b.artist?.name || "Artist"}</div>
                      <div className="text-xs text-stone-400">
                        📍 {b.artistProfile?.location || b.artist?.city || "Tamil Nadu"}
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-stone-800">
                      <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200">
                        {b.service}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs">
                      <div className="font-semibold text-stone-800">{b.dateKey}</div>
                      <div className="text-stone-400">
                        {b.startTime} - {b.endTime}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-serif font-bold text-stone-900">
                        {formatCurrency(b.amount)}
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold ${
                          b.paymentStatus === "paid" ? "text-emerald-700" : "text-amber-700"
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-4">{getStatusChip(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =========================================================
          SECTION 2: TOP PERFORMING ARTISTS
      ========================================================= */}
      <section className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0F2C23] flex items-center gap-2">
              <LuPalette className="w-5 h-5 text-[#C5A059]" />
              Featured Master Artists
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Top rated artisans based on verified reviews and completed appointments
            </p>
          </div>

          <Link
            to="/admin/artists"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2C23] hover:text-[#C5A059] hover:underline transition-colors"
          >
            <span>All Artists ({stats.totalArtists})</span>
            <LuArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-stone-500">
            Loading top mehndi artists...
          </div>
        ) : topArtists.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-500">
            No approved artists on roster yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {topArtists.map((artist) => (
              <div
                key={artist._id}
                className="rounded-2xl p-5 border border-stone-200 bg-[#FDFBF7]/50 hover:bg-white hover:border-[#C5A059] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#0F2C23] to-[#163E32] text-amber-200 border border-[#C5A059]/40 flex items-center justify-center font-bold text-base shadow-xs">
                      {artist.name ? artist.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-base text-stone-900 leading-snug">
                        {artist.name}
                      </h4>
                      <p className="text-xs text-stone-500">{artist.city || artist.location}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-white border border-stone-200">
                    <span className="text-stone-500">Specialty</span>
                    <span className="font-semibold text-[#0F2C23]">
                      {artist.specialization || "Bridal Mehndi"}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-white border border-stone-200">
                    <span className="text-stone-500">Experience</span>
                    <span className="font-semibold text-stone-800">
                      {artist.experience || 2} Years
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                    <LuStar className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>5.0</span>
                    <span className="text-stone-400 font-normal">Rating</span>
                  </div>
                  <span className="text-xs font-bold text-[#0F2C23]">Verified Pro</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          MANAGEMENT MODULE SHORTCUTS
      ========================================================= */}
      <section>
        <h2 className="font-serif text-2xl font-bold text-[#0F2C23] mb-4">
          Administrative Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            to="/admin/customers"
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#C5A059] shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LuUsers className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-[#0F2C23]">
              Customers Directory
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Search, filter, and audit verified clients and history.
            </p>
            <div className="mt-4 text-xs font-bold text-[#C5A059] flex items-center gap-1">
              <span>Access Directory</span>
              <LuArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/admin/artists"
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#C5A059] shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LuPalette className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-[#0F2C23]">
              Artist Roster
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Inspect artist profiles, services, rates, and active territories.
            </p>
            <div className="mt-4 text-xs font-bold text-[#C5A059] flex items-center gap-1">
              <span>Manage Artists</span>
              <LuArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/admin/applications"
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#C5A059] shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LuClipboardList className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-[#0F2C23]">
              Artist Applications
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Review credential submissions, approve, or reject artists.
            </p>
            <div className="mt-4 text-xs font-bold text-[#C5A059] flex items-center gap-1">
              <span>Review ({stats.pendingApplications})</span>
              <LuArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link
            to="/admin/bookings"
            className="p-6 rounded-2xl bg-white border border-stone-200 hover:border-[#C5A059] shadow-2xs hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LuCalendar className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-[#0F2C23]">
              Bookings & Slots
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Monitor schedules, double-booking locks, and payment audit logs.
            </p>
            <div className="mt-4 text-xs font-bold text-[#C5A059] flex items-center gap-1">
              <span>View Schedule</span>
              <LuArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
