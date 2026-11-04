import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getApprovedArtists,
  getServices,
  PublicArtist,
  ServiceItem,
} from "../../services/artistService";

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

      const response = await getApprovedArtists(
        selectedService,
        selectedLocation,
      );

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

    if (service) {
      next.set("service", service);
    }

    if (location) {
      next.set("location", location);
    }

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
          <p className="text-emerald-600 font-semibold">ARTIST DIRECTORY</p>

          <h1 className="text-4xl font-bold text-emerald-900 mt-2">
            Find Your Mehandi Artist
          </h1>

          <p className="text-gray-600 mt-3">
            Filter approved artists by service or location.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow p-5 mb-8 grid md:grid-cols-4 gap-4"
        >
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="border rounded-lg px-4 py-3"
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
            placeholder="Search location"
            className="border rounded-lg px-4 py-3"
          />

          <button
            type="submit"
            className="bg-emerald-600 text-white rounded-lg px-5 py-3 font-semibold hover:bg-emerald-700"
          >
            Search Artists
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className="border border-gray-300 rounded-lg px-5 py-3 font-semibold"
          >
            Clear
          </button>
        </form>

        {loading ? (
          <div className="text-center py-16 text-emerald-700">
            Loading artists...
          </div>
        ) : artists.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold">No matching artists</h2>

            <p className="text-gray-500 mt-2">
              Try another service or location.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <div
                key={artist._id}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                <div className="h-36 bg-gradient-to-r from-emerald-100 to-pink-100 flex items-center justify-center">
                  {artist.profileImage ? (
                    <img
                      src={artist.profileImage}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl shadow">
                      🌿
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-emerald-900">
                    {artist.name}
                  </h2>

                  <p className="text-emerald-700 font-medium mt-1">
                    {artist.specialization}
                  </p>

                  <div className="mt-4 space-y-2 text-gray-600 text-sm">
                    <p>📍 {artist.location}</p>

                    <p>⭐ {artist.rating.toFixed(1)} / 5</p>

                    <p>💼 {artist.experience} years experience</p>

                    {artist.availableTime && <p>🕘 {artist.availableTime}</p>}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {artist.services.map((item) => (
                      <span
                        key={item}
                        className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={`/artists/${artist._id}`}
                    className="block text-center mt-6 bg-emerald-600 text-white rounded-lg py-3 font-semibold hover:bg-emerald-700"
                  >
                    View Artist
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Artists;
