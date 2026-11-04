import { formatLocation } from "../../utils/formatters";
import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import {
  LuSearch,
  LuRefreshCw,
  LuClipboardList,
  LuCheck,
  LuX,
  LuMail,
  LuPhone,
  LuMapPin,
  LuCalendar,
  LuSparkles,
  LuClock,
  LuStar,
  LuShieldCheck,
  LuFilter,
} from "react-icons/lu";

import {
  ArtistApplication,
  getArtistApplications,
  approveArtist,
  rejectArtist,
} from "../../services/adminService";

function ArtistApplications() {
  const [applications, setApplications] = useState<ArtistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response: any = await getArtistApplications();
      const data = Array.isArray(response) ? response : (response?.applications || response?.data || []);
      setApplications(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("GET ARTIST APPLICATIONS ERROR:", error);
      toast.error(error.response?.data?.message || "Unable to load artist applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    const application = applications.find((item) => item._id === id);
    const artistName = application?.user?.name || "this artist";

    const confirmApprove = window.confirm(
      `Confirm approval for ${artistName}? This user will immediately receive Artist credentials.`,
    );

    if (!confirmApprove) return;

    try {
      setProcessingId(id);
      const response = await approveArtist(id);
      toast.success(response?.message || `Approved ${artistName} successfully!`);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error: any) {
      console.error("APPROVE ARTIST ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to approve artist application");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const application = applications.find((item) => item._id === id);
    const artistName = application?.user?.name || "this artist";

    const confirmReject = window.confirm(
      `Reject ${artistName}'s application? This action cannot be undone.`,
    );

    if (!confirmReject) return;

    try {
      setProcessingId(id);
      const response = await rejectArtist(id);
      toast.success(response?.message || "Artist application rejected");
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error: any) {
      console.error("REJECT ARTIST ERROR:", error);
      toast.error(error.response?.data?.message || "Failed to reject artist application");
    } finally {
      setProcessingId(null);
    }
  };

  // Derive specialties
  const uniqueSpecialties = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((a) => {
      if (a.specialization) set.add(a.specialization);
    });
    return Array.from(set).sort();
  }, [applications]);

  // Filter
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        app.user?.name?.toLowerCase().includes(q) ||
        app.user?.email?.toLowerCase().includes(q) ||
        app.user?.phone?.toLowerCase().includes(q) ||
        app.user?.city?.toLowerCase().includes(q) ||
        app.location?.toLowerCase().includes(q) ||
        app.specialization?.toLowerCase().includes(q);

      const matchesSpecialty =
        specialtyFilter === "all" || app.specialization === specialtyFilter;

      return matchesSearch && matchesSpecialty;
    });
  }, [applications, searchQuery, specialtyFilter]);

  return (
    <div className="space-y-6">
      {/* =========================================================
          PAGE HEADER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-3xl font-bold text-[#0F2C23]">
              Artist Credential Review
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
              {applications.length} Pending
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Carefully review artisan portfolios, experience qualifications, and service territories
            before granting official roster access.
          </p>
        </div>

        <button
          onClick={loadApplications}
          disabled={loading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <LuRefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#C5A059]" : ""}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* =========================================================
          FILTER / SEARCH BAR
      ========================================================= */}
      {applications.length > 0 && (
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3.5">
          <div className="relative flex-1 max-w-lg">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
            <input
              type="text"
              placeholder="Filter applications by applicant name, city, specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F3] border border-stone-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <LuFilter className="w-4 h-4 text-stone-400" />
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="bg-[#FAF8F3] border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
            >
              <option value="all">All Specialties ({applications.length})</option>
              {uniqueSpecialties.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* =========================================================
          APPLICATIONS LIST
      ========================================================= */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-16 text-center">
          <div className="animate-spin inline-block w-8 h-8 border-3 border-[#0F2C23] border-t-transparent rounded-full mb-3"></div>
          <p className="text-sm font-serif font-bold text-stone-800">
            Loading candidate portfolios...
          </p>
        </div>
      ) : filteredApplications.length === 0 ? (
        /* =========================================================
           ROYAL EMPTY STATE
        ========================================================= */
        <div className="bg-gradient-to-br from-[#FDFBF7] via-white to-[#F7F3E9] rounded-3xl border border-[#C5A059]/30 p-12 sm:p-16 text-center shadow-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#FAF8F3] border-2 border-[#C5A059]/40 flex items-center justify-center text-3xl text-[#C5A059] shadow-xs mb-5">
            📋
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#0F2C23]">
            Queue Cleared — No Pending Applications
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-2 leading-relaxed">
            {searchQuery || specialtyFilter !== "all"
              ? `No candidate applications matched your filter "${searchQuery}".`
              : "All artist onboarding applications have been reviewed. New candidate submissions will appear in this workspace."}
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
                Clear Search
              </button>
            )}
            <button
              onClick={loadApplications}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#C5A059] hover:bg-[#b08e48] text-[#0F2C23] shadow-xs transition-colors cursor-pointer"
            >
              Check Again
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApplications.map((application) => {
            const isProcessing = processingId === application._id;

            return (
              <div
                key={application._id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:border-[#C5A059]/60 hover:shadow-md transition-all duration-300"
              >
                {/* Application Header */}
                <div className="bg-gradient-to-r from-[#FDFBF7] via-white to-[#FAF8F3] p-6 border-b border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F2C23] to-[#163E32] text-amber-200 border border-[#C5A059]/40 flex items-center justify-center font-bold text-xl shadow-xs">
                      {application.user?.name ? application.user.name.charAt(0).toUpperCase() : "A"}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-stone-900 leading-snug">
                        {application.user?.name || "Candidate Artist"}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-[#0F2C23]">
                          {application.specialization || "Bridal Mehndi"}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-xs text-stone-500">
                          {application.experience ?? 0} Years Experience
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    Pending Review
                  </span>
                </div>

                {/* Body Details */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Contact & Territory Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-stone-200/70">
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
                        <LuMail className="w-3 h-3 text-[#C5A059]" />
                        Email Address
                      </span>
                      <span className="text-xs font-semibold text-stone-800 mt-1 block truncate">
                        {application.user?.email || "Not provided"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-stone-200/70">
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
                        <LuPhone className="w-3 h-3 text-[#C5A059]" />
                        Phone Number
                      </span>
                      <span className="text-xs font-semibold text-stone-800 mt-1 block font-mono">
                        {application.user?.phone || "Not provided"}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-stone-200/70">
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
                        <LuMapPin className="w-3 h-3 text-[#C5A059]" />
                        Primary Base
                      </span>
                      <span className="text-xs font-semibold text-stone-800 mt-1 block">
                        {formatLocation(application.location || application.user?.city)}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#FAF8F3] border border-stone-200/70">
                      <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider flex items-center gap-1">
                        <LuClock className="w-3 h-3 text-[#C5A059]" />
                        Availability Window
                      </span>
                      <span className="text-xs font-semibold text-stone-800 mt-1 block truncate">
                        {application.availableTime || "Standard Business Hours"}
                      </span>
                    </div>
                  </div>

                  {/* Services & Available Locations */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Services */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Proposed Services
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {application.services && application.services.length > 0 ? (
                          application.services.map((service, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200"
                            >
                              {service}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-stone-400 italic">No services selected</span>
                        )}
                      </div>
                    </div>

                    {/* Locations */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                        Covered Locations
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {application.availableLocations &&
                        application.availableLocations.length > 0 ? (
                          application.availableLocations.map((loc, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200"
                            >
                              📍 {loc}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-stone-400 italic">
                            All Regional Venues
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bio statement */}
                  {application.bio && (
                    <div className="p-4 rounded-2xl bg-[#FAF8F3] border border-stone-200 text-xs text-stone-600 leading-relaxed">
                      <span className="font-bold text-[#0F2C23] block mb-1">Artisan Bio:</span>
                      "{application.bio}"
                    </div>
                  )}

                  {/* Decision Action Buttons */}
                  <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      disabled={isProcessing}
                      onClick={() => handleReject(application._id)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <LuX className="w-4 h-4" />
                      <span>Reject Application</span>
                    </button>

                    <button
                      disabled={isProcessing}
                      onClick={() => handleApprove(application._id)}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0F2C23] to-[#163E32] text-amber-200 border border-amber-500/40 hover:border-amber-400 hover:shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
                    >
                      <LuCheck className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isProcessing ? "Authorizing..." : "Approve & Authorize Artist"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ArtistApplications;
