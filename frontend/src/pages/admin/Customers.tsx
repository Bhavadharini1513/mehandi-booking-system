import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { formatLocation } from "../../utils/formatters";
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
  LuUsers,
  LuMail,
  LuPhone,
  LuMapPin,
  LuCalendar,
  LuCheck,
  LuSparkles,
} from "react-icons/lu";

import { Customer, getCustomers } from "../../services/adminService";

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [sortField, setSortField] = useState<"name" | "email" | "city" | "createdAt">("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const itemsPerPage = 8;

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const response: any = await getCustomers();
      const data = Array.isArray(response) ? response : (response?.customers || response?.data || []);
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Unable to load customer directory");
    } finally {
      setLoading(false);
    }
  };

  // Derive unique cities for filter dropdown
  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    customers.forEach((c) => {
      const cityStr = formatLocation(c.city);
      if (cityStr && cityStr !== "Tamil Nadu") set.add(cityStr);
    });
    return Array.from(set).sort();
  }, [customers]);

  // Filter & Search
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const q = searchQuery.toLowerCase();
      const cityStr = formatLocation(customer.city);
      const matchesSearch =
        customer.name?.toLowerCase().includes(q) ||
        customer.email?.toLowerCase().includes(q) ||
        customer.phone?.toLowerCase().includes(q) ||
        cityStr.toLowerCase().includes(q);

      const matchesCity = cityFilter === "all" || cityStr === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [customers, searchQuery, cityFilter]);

  // Sort
  const sortedCustomers = useMemo(() => {
    return [...filteredCustomers].sort((a, b) => {
      let valA: any = a[sortField] || "";
      let valB: any = b[sortField] || "";
      if (sortField === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredCustomers, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCustomers.slice(start, start + itemsPerPage);
  }, [sortedCustomers, currentPage]);

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
    if (selectedIds.length === paginatedCustomers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCustomers.map((c) => c._id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // CSV Export
  const exportToCSV = () => {
    const dataToExport = selectedIds.length
      ? customers.filter((c) => selectedIds.includes(c._id))
      : sortedCustomers;

    if (!dataToExport.length) {
      toast.error("No customer records to export");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Address", "City", "RegisteredDate"];
    const rows = dataToExport.map((c) => [
      c._id,
      `"${c.name || ""}"`,
      `"${c.email || ""}"`,
      `"${c.phone || ""}"`,
      `"${typeof c.address === "object" ? formatLocation(c.address) : (c.address || "")}"`,
      `"${formatLocation(c.city)}"`,
      `"${new Date(c.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Maruthani_Customers_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${dataToExport.length} customer records to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0F2C23]">Client Directory</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A059]/20 text-[#0F2C23] border border-[#C5A059]/40">
              {customers.length} Accounts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Search, filter, inspect, and export verified clientele records across all service
            locations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCustomers}
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
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
          <input
            type="text"
            placeholder="Search by client name, email, phone, city..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#FAF8F3] border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all"
          />
        </div>

        {/* Filters and View Toggle */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <LuFilter className="w-4 h-4 text-stone-400" />
            <select
              value={cityFilter}
              onChange={(e) => {
                setCityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#FAF8F3] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Cities ({customers.length})</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

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
          CONTENT AREA: TABLE OR GRID
      ========================================================= */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-16 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-3 border-[#0F2C23] border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-serif font-bold text-stone-800">
            Fetching verified clientele directory...
          </p>
        </div>
      ) : sortedCustomers.length === 0 ? (
        /* =========================================================
           ROYAL EMPTY STATE
        ========================================================= */
        <div className="bg-gradient-to-br from-[#FDFBF7] via-white to-[#F7F3E9] rounded-3xl border border-[#C5A059]/30 p-12 sm:p-16 text-center shadow-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF8F3] border-2 border-[#C5A059]/40 flex items-center justify-center text-3xl text-[#C5A059] shadow-xs mb-5">
            👥
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0F2C23]">
            No Matching Customers Found
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-2 leading-relaxed">
            {searchQuery || cityFilter !== "all"
              ? `No client records matched your search query "${searchQuery}". Try clearing search filters or refreshing.`
              : "There are currently no registered customers in the database. New customer signups will appear here."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {(searchQuery || cityFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCityFilter("all");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={loadCustomers}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#b08e48] text-[#0F2C23] shadow-xs transition-colors cursor-pointer"
            >
              Refresh Directory
            </button>
          </div>
        </div>
      ) : viewMode === "table" ? (
        /* =========================================================
           DENSE DATA TABLE VIEW
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
                        selectedIds.length === paginatedCustomers.length &&
                        paginatedCustomers.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="rounded text-[#0F2C23] focus:ring-[#D4AF37] cursor-pointer"
                    />
                  </th>
                  <th
                    onClick={() => toggleSort("name")}
                    className="px-5 py-4 cursor-pointer hover:text-[#0F2C23]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Customer Details</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("email")}
                    className="px-5 py-4 cursor-pointer hover:text-[#0F2C23]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Email Address</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                  <th className="px-5 py-4">Phone Number</th>
                  <th
                    onClick={() => toggleSort("city")}
                    className="px-5 py-4 cursor-pointer hover:text-[#0F2C23]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Location / City</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("createdAt")}
                    className="px-5 py-4 cursor-pointer hover:text-[#0F2C23]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Registration</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedCustomers.map((customer) => {
                  const isSelected = selectedIds.includes(customer._id);
                  return (
                    <tr
                      key={customer._id}
                      className={`hover:bg-[#C5A059]/5 transition-colors ${
                        isSelected ? "bg-amber-50/50" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(customer._id)}
                          className="rounded text-[#0F2C23] focus:ring-[#D4AF37] cursor-pointer"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0F2C23] to-[#163E32] text-amber-200 border border-[#C5A059]/30 flex items-center justify-center font-bold text-xs shadow-2xs">
                            {customer.name ? customer.name.charAt(0).toUpperCase() : "C"}
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900">{customer.name}</div>
                            <div className="text-[11px] text-stone-400">ID: {customer._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-stone-600 font-mono text-xs">
                        {customer.email}
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-stone-800">
                        {customer.phone || "—"}
                      </td>

                      <td className="px-5 py-4 text-xs">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 font-medium">
                          📍 {formatLocation(customer.city)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-stone-500 font-medium">
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "—"}
                      </td>
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
                {Math.min(currentPage * itemsPerPage, sortedCustomers.length)}
              </span>{" "}
              of <span className="font-bold text-stone-900">{sortedCustomers.length}</span> records
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
           CARD GRID VIEW
        ========================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {paginatedCustomers.map((customer) => (
            <div
              key={customer._id}
              className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-[#C5A059] shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0F2C23] to-[#163E32] text-amber-200 border border-[#C5A059]/40 flex items-center justify-center font-bold text-sm shadow-xs">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : "C"}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-stone-900 leading-snug">
                      {customer.name}
                    </h3>
                    <p className="text-xs text-stone-500">ID: {customer._id.slice(-6)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <LuMail className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuPhone className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{customer.phone || "No phone registered"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuMapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{formatLocation(customer.city)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Active
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Customers;
