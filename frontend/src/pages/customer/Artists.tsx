import { formatLocation } from "../../utils/formatters";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getApprovedArtists,
  getServices,
  PublicArtist,
  ServiceItem,
} from "../../services/artistService";

/* ============================================================
   LOCAL REALISTIC ARTIST PORTRAITS
============================================================ */
const LOCAL_ARTIST_PORTRAITS: Record<string, string> = {
  "priya sundaram": "/assets/artists/priya-sundaram.webp",
  "ananya sharma": "/assets/artists/ananya-sharma.webp",
  "kavitha rajan": "/assets/artists/kavitha-rajan.webp",
  "meera patel": "/assets/artists/meera-patel.webp",
  "ritu verma": "/assets/artists/ritu-verma.webp",
  "arjun reddy": "/assets/artists/arjun-reddy.webp",
};

const DEFAULT_FEMALE_PORTRAIT = "/assets/artists/priya-sundaram.webp";
const DEFAULT_MALE_PORTRAIT = "/assets/artists/arjun-reddy.webp";

const getArtistAvatar = (artist: any): string => {
  if (
    artist.profileImage &&
    typeof artist.profileImage === "string" &&
    artist.profileImage.startsWith("/assets/")
  ) {
    return artist.profileImage;
  }
  const nameLower = (artist.name || artist.user?.name || "").toLowerCase().trim();
  if (LOCAL_ARTIST_PORTRAITS[nameLower]) {
    return LOCAL_ARTIST_PORTRAITS[nameLower];
  }
  for (const [key, path] of Object.entries(LOCAL_ARTIST_PORTRAITS)) {
    if (nameLower.includes(key) || key.includes(nameLower)) {
      return path;
    }
  }
  if (
    nameLower.includes("arjun") ||
    nameLower.includes("kumar") ||
    nameLower.includes("rahul") ||
    nameLower.includes("raj") ||
    nameLower.includes("arun")
  ) {
    return DEFAULT_MALE_PORTRAIT;
  }
  return DEFAULT_FEMALE_PORTRAIT;
};

/* ============================================================
   MAIN PAGE
============================================================ */

function Artists() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [artists, setArtists] = useState<PublicArtist[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [service, setService] = useState(searchParams.get("service") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [loading, setLoading] = useState(true);

  const loadArtists = async (
    selectedService = service,
    selectedLocation = location,
  ) => {
    try {
      setLoading(true);
      const response = await getApprovedArtists(selectedService, selectedLocation);
      setArtists(response.artists || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Unable to load artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getServices();
        setServices(response.services || []);
      } catch {
        // Artist list can still load.
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    const initialService = searchParams.get("service") || "";
    const initialLocation = searchParams.get("location") || "";
    setService(initialService);
    setLocation(initialLocation);
    loadArtists(initialService, initialLocation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (service) next.set("service", service);
    if (location) next.set("location", location);
    setSearchParams(next);
    await loadArtists(service, location);
  };

  const clearFilters = async () => {
    setService("");
    setLocation("");
    setSearchParams({});
    await loadArtists("", "");
  };

  return (
    <div className="min-h-screen bg-emerald-50 px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">
            ARTIST DIRECTORY
          </p>
          <h1 className="text-4xl font-serif font-bold text-emerald-950 mt-2">
            Find Your Mehandi Artist
          </h1>
          <p className="text-gray-600 mt-3">
            Explore verified master artisans, browse specialty portfolios, and book your session.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow p-5 mb-8 grid md:grid-cols-4 gap-4"
        >
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 text-stone-800"
          >
            <option value="">All Services</option>
            {services.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Search location (e.g. Chennai, Madurai)"
            className="border border-gray-200 rounded-lg px-4 py-3 text-stone-800 placeholder:text-gray-400"
          />

          <button
            type="submit"
            className="bg-emerald-700 text-white rounded-lg px-5 py-3 font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
          >
            Search Artists
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="border border-gray-300 rounded-lg px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </form>

        {loading ? (
          <div className="text-center py-16 text-emerald-700">
            <div className="w-10 h-10 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading artists...
          </div>
        ) : artists.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center max-w-md mx-auto">
            <div className="text-3xl mb-2">🌿</div>
            <h2 className="text-xl font-serif font-semibold text-stone-900">No matching artists</h2>
            <p className="text-gray-500 mt-2">Try another service or location filter.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => {
              const avatarSrc = getArtistAvatar(artist);
              return (
                <div
                  key={artist._id}
                  className="bg-white rounded-2xl shadow overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Realistic Master Artisan Portrait Banner */}
                    <div className="w-full h-56 bg-emerald-950/10 overflow-hidden relative border-b border-stone-100">
                      <img
                        src={avatarSrc}
                        alt={artist.name || artist.user?.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            DEFAULT_FEMALE_PORTRAIT;
                        }}
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0F2C23]/85 text-amber-300 backdrop-blur-xs border border-amber-400/30 shadow-xs flex items-center gap-1">
                        <span>✓</span> Verified Artisan
                      </div>
                    </div>

                    <div className="p-6">
                      <h2 className="text-2xl font-serif font-bold text-emerald-950">
                        {artist.name}
                      </h2>

                      <p className="text-emerald-700 font-medium text-sm mt-1">
                        {artist.specialization}
                      </p>

                      <div className="mt-4 space-y-2 text-stone-600 text-sm">
                        <p className="flex items-center gap-1.5">
                          <span>📍</span> {formatLocation(artist.location)}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span>⭐</span> {(artist.rating ?? 5).toFixed(1)} / 5 ({artist.totalReviews ?? 0} reviews)
                        </p>
                        <p className="flex items-center gap-1.5">
                          <span>💼</span> {artist.experience} years master experience
                        </p>
                        {artist.availableTime && (
                          <p className="flex items-center gap-1.5">
                            <span>🕘</span> {artist.availableTime}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {(artist.services || []).map((item) => (
                          <span
                            key={item}
                            className="bg-emerald-50 text-emerald-800 border border-emerald-200/60 px-2.5 py-0.5 rounded-full text-xs font-medium"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      to={`/artists/${artist._id}`}
                      className="block text-center bg-emerald-700 text-white rounded-xl py-3 font-semibold hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      View Portfolio & Book
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Artists;
