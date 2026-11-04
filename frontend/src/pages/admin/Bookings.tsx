import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  LuSearch,
  LuDownload,
  LuRefreshCw,
  LuFilter,
  LuLayoutGrid,
  LuTable,
  LuArrowUpDown,
  LuChevronLeft,
  LuChevronRight,
  LuCalendar,
  LuClock,
  LuIndianRupee,
  LuMapPin,
  LuCircleCheck,
  LuAlertCircle,
  LuXCircle,
  LuUser,
  LuPalette,
  LuSparkles,
} from "react-icons/lu";

import { Booking, getBookings } from "../../services/adminService";

function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortField, setSortField] = useState<"dateKey" | "amount" | "status">("dateKey");
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const itemsPerPage = 8;

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
      toast.error(error.response?.data?.message || "Unable to load appointment registry");
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        b.customer?.name?.toLowerCase().includes(q) ||
        b.customer?.email?.toLowerCase().includes(q) ||
        b.artist?.name?.toLowerCase().includes(q) ||
        b.artist?.email?.toLowerCase().includes(q) ||
        b.service?.toLowerCase().includes(q) ||
        b.dateKey?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || b.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, searchQuery, statusFilter, paymentFilter]);

  // Sort
  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort((a, b) => {
      let valA: any = a[sortField] || "";
      let valB: any = b[sortField] || "";
      if (sortField === "amount") {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredBookings, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage) || 1;
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedBookings.slice(start, start + itemsPerPage);
  }, [sortedBookings, currentPage]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedBookings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedBookings.map((b) => b._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Currency Formatter
  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt || 0);
  };

  // Status Chip
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
      case "info_needed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Info Needed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            {status.replace("_", " ")}
          </span>
        );
    }
  };

  // CSV Export
  const exportToCSV = () => {
    const dataToExport = selectedIds.length
      ? bookings.filter((b) => selectedIds.includes(b._id))
      : sortedBookings;

    if (!dataToExport.length) {
      toast.error("No booking records to export");
      return;
    }

    const headers = [
      "BookingID",
      "CustomerName",
      "CustomerEmail",
      "ArtistName",
      "ArtistEmail",
      "Service",
      "DateKey",
      "StartTime",
      "EndTime",
      "Status",
      "PaymentStatus",
      "AmountINR",
    ];

    const rows = dataToExport.map((b) => [
      b._id,
      `"${b.customer?.name || ""}"`,
      `"${b.customer?.email || ""}"`,
      `"${b.artist?.name || ""}"`,
      `"${b.artist?.email || ""}"`,
      `"${b.service || ""}"`,
      b.dateKey,
      b.startTime,
      b.endTime,
      b.status,
      b.paymentStatus,
      b.amount,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Maruthani_Bookings_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${dataToExport.length} booking records to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0F2C23]">
              Appointments & Slot Telemetry
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A059]/20 text-[#0F2C23] border border-[#C5A059]/40">
              {bookings.length} Bookings Logged
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time schedule monitor, unique double-booking prevention locks, and payment
            settlements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadBookings}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer"
          >
            <LuRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#C5A059]" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0F2C23] to-[#163E32] text-amber-200 border border-amber-500/30 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <LuDownload className="w-3.5 h-3.5" />
            <span>Export CSV {selectedIds.length > 0 && `(${selectedIds.length})`}</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          ACTION BAR (SEARCH + FILTERS + VIEW TOGGLE)
      ========================================================= */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
        <div className="relative flex-1 max-w-lg">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
          <input
            type="text"
            placeholder="Search by client, artist, service, date (YYYY-MM-DD)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#FAF8F3] border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <LuFilter className="w-4 h-4 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#FAF8F3] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="accepted">Accepted</option>
              <option value="pending">Pending</option>
              <option value="info_needed">Info Needed</option>
              <option value="cancelled">Cancelled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => {
              setPaymentFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#FAF8F3] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid (Confirmed)</option>
            <option value="unpaid">Unpaid</option>
            <option value="refund_pending">Refund Pending</option>
          </select>

          {/* Table / Grid Toggle */}
          <div className="flex items-center border border-stone-200 rounded-xl bg-stone-100 p-0.5">
            <button
              onClick={() => setViewMode("table")}
              aria-label="Table View"
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-[#0F2C23] shadow-2xs font-bold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <LuTable className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              aria-label="Grid View"
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-[#0F2C23] shadow-2xs font-bold"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <LuLayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          CONTENT: TABLE OR GRID
      ========================================================= */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-16 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-3 border-[#0F2C23] border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-serif font-bold text-stone-800">
            Retrieving appointment registry & slot telemetry...
          </p>
        </div>
      ) : sortedBookings.length === 0 ? (
        /* =========================================================
           ROYAL EMPTY STATE
        ========================================================= */
        <div className="bg-gradient-to-br from-[#FDFBF7] via-white to-[#F7F3E9] rounded-3xl border border-[#C5A059]/30 p-12 sm:p-16 text-center shadow-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF8F3] border-2 border-[#C5A059]/40 flex items-center justify-center text-3xl text-[#C5A059] shadow-xs mb-5">
            📅
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0F2C23]">
            No Matching Bookings Found
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-2 leading-relaxed">
            {searchQuery || statusFilter !== "all" || paymentFilter !== "all"
              ? `No booking records matched your filters. Try resetting status or search keywords.`
              : "No customer bookings have been placed yet. As appointments are scheduled, they will appear here in real time."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {(searchQuery || statusFilter !== "all" || paymentFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            )}
            <button
              onClick={loadBookings}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#b08e48] text-[#0F2C23] shadow-xs transition-colors cursor-pointer"
            >
              Refresh Bookings
            </button>
          </div>
        </div>
      ) : viewMode === "table" ? (
        /* =========================================================
           DENSE DATA TABLE
        ========================================================= */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-[#FAF8F3] text-[11px] uppercase tracking-wider font-bold text-stone-500 border-b border-stone-200 sticky top-0 z-10">
                <tr>
                  <th className="px-5 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.length === paginatedBookings.length &&
                        paginatedBookings.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded text-[#0F2C23] focus:ring-[#D4AF37] cursor-pointer"
                    />
                  </th>
                  <th className="px-5 py-4">Client</th>
                  <th className="px-5 py-4">Assigned Artist</th>
                  <th className="px-5 py-4">Couture Service</th>
                  <th
                    onClick={() => toggleSort("dateKey")}
                    className="px-5 py-4 cursor-pointer hover:text-[#0F2C23]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Date & Slot</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("amount")}
                    className="px-5 py-4 cursor-pointer hover:text-[#0F2C23]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Settlement</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("status")}
                    className="px-5 py-4 cursor-pointer hover:text-[#0F2C23]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Lifecycle</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedBookings.map((b) => {
                  const isSelected = selectedIds.includes(b._id);
                  return (
                    <tr
                      key={b._id}
                      className={`hover:bg-[#C5A059]/5 transition-colors ${
                        isSelected ? "bg-amber-50/50" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(b._id)}
                          className="rounded text-[#0F2C23] focus:ring-[#D4AF37] cursor-pointer"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-stone-900">
                          {b.customer?.name || "Client"}
                        </div>
                        <div className="text-xs text-stone-400">
                          {b.customer?.phone || b.customer?.email}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-semibold text-[#0F2C23]">
                          {b.artist?.name || "Artist"}
                        </div>
                        <div className="text-xs text-stone-400">
                          📍 {b.artistProfile?.location || b.artist?.city || "Tamil Nadu"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200">
                          {b.service}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs">
                        <div className="font-semibold text-stone-800 flex items-center gap-1">
                          <LuCalendar className="w-3.5 h-3.5 text-[#C5A059]" />
                          <span>{b.dateKey}</span>
                        </div>
                        <div className="text-stone-400 mt-0.5 flex items-center gap-1">
                          <LuClock className="w-3.5 h-3.5" />
                          <span>
                            {b.startTime} - {b.endTime}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-serif font-bold text-stone-900">
                          {formatCurrency(b.amount)}
                        </div>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider ${
                            b.paymentStatus === "paid"
                              ? "text-emerald-700"
                              : b.paymentStatus === "refund_pending"
                              ? "text-rose-700"
                              : "text-amber-700"
                          }`}
                        >
                          {b.paymentStatus.replace("_", " ")}
                        </span>
                      </td>

                      <td className="px-5 py-4">{getStatusChip(b.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* =========================================================
              PAGINATION BAR
          ========================================================= */}
          <div className="px-6 py-4 bg-[#FAF8F3] border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
            <div>
              Showing <span className="font-bold text-stone-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-bold text-stone-900">
                {Math.min(currentPage * itemsPerPage, sortedBookings.length)}
              </span>{" "}
              of <span className="font-bold text-stone-900">{sortedBookings.length}</span> records
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <LuChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 font-semibold text-stone-800 bg-white border border-stone-200 rounded-lg">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <LuChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
           INTERACTIVE GRID VIEW
        ========================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#C5A059] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                      ID: {b._id.slice(-6)}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-stone-900 mt-0.5">
                      {b.service}
                    </h3>
                  </div>
                  {getStatusChip(b.status)}
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAF8F3] border border-stone-200/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Client</span>
                      <span className="font-bold text-stone-900">{b.customer?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Artist</span>
                      <span className="font-bold text-[#0F2C23]">{b.artist?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-stone-600">
                    <span className="flex items-center gap-1.5">
                      <LuCalendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      {b.dateKey}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <LuClock className="w-3.5 h-3.5" />
                      {b.startTime} - {b.endTime}
                    </span>
                  </div>

                  {b.notes && (
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-500 italic text-[11px] line-clamp-2">
                      Notes: {b.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">
                    Order Total
                  </span>
                  <span className="font-serif font-bold text-lg text-stone-900">
                    {formatCurrency(b.amount)}
                  </span>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                    b.paymentStatus === "paid"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {b.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bookings;
