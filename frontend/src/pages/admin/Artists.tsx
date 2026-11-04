import React, { useEffect, useState, useMemo } from "react";
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
  LuPalette,
  LuMail,
  LuPhone,
  LuMapPin,
  LuStar,
  LuBriefcase,
  LuSparkles,
  LuCircleCheck,
} from "react-icons/lu";

import { getArtists, Artist } from "../../services/adminService";

const Artists: React.FC = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [sortField, setSortField] = useState<"name" | "experience" | "city">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const itemsPerPage = 8;

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);
      const response = await getArtists();
      if (response && response.success) {
        setArtists(response.artists || []);
      } else {
        setArtists([]);
      }
    } catch (error: any) {
      console.error("ARTISTS PAGE ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to load approved artists");
    } finally {
      setLoading(false);
    }
  };

  // Derive unique specializations
  const uniqueSpecialties = useMemo(() => {
    const set = new Set<string>();
    artists.forEach((a) => {
      if (a.specialization) set.add(a.specialization);
    });
    return Array.from(set).sort();
  }, [artists]);

  // Filter & Search
  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        artist.name?.toLowerCase().includes(q) ||
        artist.email?.toLowerCase().includes(q) ||
        artist.phone?.toLowerCase().includes(q) ||
        artist.city?.toLowerCase().includes(q) ||
        artist.location?.toLowerCase().includes(q) ||
        artist.specialization?.toLowerCase().includes(q);

      const matchesSpecialty =
        specialtyFilter === "all" || artist.specialization === specialtyFilter;

      return matchesSearch && matchesSpecialty;
    });
  }, [artists, searchQuery, specialtyFilter]);

  // Sort
  const sortedArtists = useMemo(() => {
    return [...filteredArtists].sort((a, b) => {
      let valA: any = a[sortField] || "";
      let valB: any = b[sortField] || "";
      if (sortField === "experience") {
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
  }, [filteredArtists, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedArtists.length / itemsPerPage) || 1;
  const paginatedArtists = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedArtists.slice(start, start + itemsPerPage);
  }, [sortedArtists, currentPage]);

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
    if (selectedIds.length === paginatedArtists.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedArtists.map((a) => a._id));
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
      ? artists.filter((a) => selectedIds.includes(a._id))
      : sortedArtists;

    if (!dataToExport.length) {
      toast.error("No artist records to export");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Email",
      "Phone",
      "Specialization",
      "ExperienceYears",
      "Location",
      "City",
      "Services",
      "Status",
    ];
    const rows = dataToExport.map((a) => [
      a._id,
      `"${a.name || ""}"`,
      `"${a.email || ""}"`,
      `"${a.phone || ""}"`,
      `"${a.specialization || ""}"`,
      a.experience || 0,
      `"${a.location || ""}"`,
      `"${a.city || ""}"`,
      `"${(a.services || []).join("; ")}"`,
      `"${a.status || "approved"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Maruthani_Artists_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${dataToExport.length} artist records to CSV`);
  };

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0F2C23]">Verified Artisans Roster</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#C5A059]/20 text-[#0F2C23] border border-[#C5A059]/40">
              {artists.length} Master Artists
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Directory of vetted and approved mehndi artists authorized for client bookings across
            Tamil Nadu.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadArtists}
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
            placeholder="Search by artist name, specialization, city, location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#FAF8F3] border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <LuFilter className="w-4 h-4 text-stone-400" />
            <select
              value={specialtyFilter}
              onChange={(e) => {
                setSpecialtyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#FAF8F3] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Specialties ({artists.length})</option>
              {uniqueSpecialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center border border-stone-200 rounded-xl bg-stone-100 p-0.5">
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
          </div>
        </div>
      </div>

      {/* =========================================================
          CONTENT AREA: GRID OR TABLE
      ========================================================= */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-16 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-3 border-[#0F2C23] border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-serif font-bold text-stone-800">
            Accessing master artisans roster...
          </p>
        </div>
      ) : sortedArtists.length === 0 ? (
        /* =========================================================
           ROYAL EMPTY STATE
        ========================================================= */
        <div className="bg-gradient-to-br from-[#FDFBF7] via-white to-[#F7F3E9] rounded-3xl border border-[#C5A059]/30 p-12 sm:p-16 text-center shadow-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF8F3] border-2 border-[#C5A059]/40 flex items-center justify-center text-3xl text-[#C5A059] shadow-xs mb-5">
            🎨
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0F2C23]">
            No Approved Artists Found
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-2 leading-relaxed">
            {searchQuery || specialtyFilter !== "all"
              ? `No artist records matched your search query "${searchQuery}". Try clearing filters.`
              : "No mehndi artists have been approved yet. Review pending submissions in the Applications suite."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            {(searchQuery || specialtyFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSpecialtyFilter("all");
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            )}
            <button
              onClick={loadArtists}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#b08e48] text-[#0F2C23] shadow-xs transition-colors cursor-pointer"
            >
              Refresh Roster
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* =========================================================
           LUXURY CARD GRID VIEW
        ========================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedArtists.map((artist) => (
            <div
              key={artist._id}
              className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#C5A059] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#0F2C23] to-[#163E32] text-amber-200 border border-[#C5A059]/40 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
                      {artist.name ? artist.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-stone-900 group-hover:text-[#0F2C23] transition-colors leading-snug">
                        {artist.name || "Master Artist"}
                      </h3>
                      <p className="text-xs text-[#C5A059] font-semibold">
                        {artist.specialization || "Bespoke Bridal"}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <LuCircleCheck className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#FDFBF7] border border-stone-200/80">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">
                      Experience
                    </span>
                    <span className="font-bold text-stone-800 mt-0.5 block">
                      {artist.experience || 0} Years Active
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#FDFBF7] border border-stone-200/80">
                    <span className="text-stone-400 block text-[10px] uppercase font-bold tracking-wider">
                      Territory
                    </span>
                    <span className="font-bold text-stone-800 mt-0.5 block truncate">
                      {artist.city || artist.location || "Tamil Nadu"}
                    </span>
                  </div>
                </div>

                {/* Contact items */}
                <div className="mt-4 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <LuMail className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span className="truncate">{artist.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LuPhone className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{artist.phone || "No phone"}</span>
                  </div>
                </div>

                {/* Services Chips */}
                {artist.services && artist.services.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1.5">
                      Services Offered
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {artist.services.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {artist.services.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-stone-100 text-stone-500 text-[11px]">
                          +{artist.services.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bio summary */}
              {artist.bio && (
                <div className="mt-4 pt-3 border-t border-stone-100 text-xs text-stone-500 italic line-clamp-2">
                  "{artist.bio}"
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* =========================================================
           DATA TABLE VIEW
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
                        selectedIds.length === paginatedArtists.length &&
                        paginatedArtists.length > 0
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
                      <span>Artisan Details</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                  <th className="px-5 py-4">Specialization</th>
                  <th
                    onClick={() => toggleSort("experience")}
                    className="px-5 py-4 cursor-pointer hover:text-[#0F2C23]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Experience</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                  <th
                    onClick={() => toggleSort("city")}
                    className="px-5 py-4 cursor-pointer hover:text-[#0F2C23]"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Location</span>
                      <LuArrowUpDown className="w-3 h-3 text-[#C5A059]" />
                    </div>
                  </th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {paginatedArtists.map((artist) => {
                  const isSelected = selectedIds.includes(artist._id);
                  return (
                    <tr
                      key={artist._id}
                      className={`hover:bg-[#C5A059]/5 transition-colors ${
                        isSelected ? "bg-amber-50/50" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectOne(artist._id)}
                          className="rounded text-[#0F2C23] focus:ring-[#D4AF37] cursor-pointer"
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0F2C23] to-[#163E32] text-amber-200 border border-[#C5A059]/30 flex items-center justify-center font-bold text-xs shadow-2xs">
                            {artist.name ? artist.name.charAt(0).toUpperCase() : "A"}
                          </div>
                          <div>
                            <div className="font-semibold text-stone-900">{artist.name}</div>
                            <div className="text-[11px] text-stone-400 font-mono">
                              {artist.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs font-semibold text-[#0F2C23]">
                        {artist.specialization || "Bridal Mehndi"}
                      </td>

                      <td className="px-5 py-4 text-xs text-stone-700">
                        {artist.experience || 0} Years
                      </td>

                      <td className="px-5 py-4 text-xs">
                        📍 {artist.city || artist.location || "Tamil Nadu"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Verified
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
          PAGINATION BAR
      ========================================================= */}
      {sortedArtists.length > 0 && (
        <div className="px-6 py-4 bg-white rounded-2xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600 shadow-2xs">
          <div>
            Showing <span className="font-bold text-stone-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-bold text-stone-900">
              {Math.min(currentPage * itemsPerPage, sortedArtists.length)}
            </span>{" "}
            of <span className="font-bold text-stone-900">{sortedArtists.length}</span> artisans
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <LuChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-semibold text-stone-800 bg-stone-100 border border-stone-200 rounded-lg">
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
      )}
    </div>
  );
};

export default Artists;
