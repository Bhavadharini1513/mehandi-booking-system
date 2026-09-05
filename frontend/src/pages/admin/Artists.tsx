import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminNavbar from "../../components/layouts/AdminNavbar";
import { getArtists } from "../../services/adminService";

interface Artist {
  _id: string;
  experience: number;
  specialization: string;
  bio: string;
  location: string;
  availableLocations: string[];
  availableTime: string;
  services: string[];
  user: {
    name: string;
    email: string;
    phone: string;
    city: string;
    role: string;
  };
}

function Artists() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  const loadArtists = async () => {
    try {
      const response = await getArtists();

      console.log("ARTISTS:", response);

      setArtists(response.artists || []);
    } catch (error: any) {
      console.error(error);

      toast.error(error.response?.data?.message || "Unable to load artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtists();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold">Approved Artists</h1>

        <p className="text-gray-500 mt-2">View all approved mehendi artists.</p>

        {loading ? (
          <div className="text-center py-10">Loading artists...</div>
        ) : artists.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 mt-8 text-center">
            No approved artists found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {artists.map((artist) => (
              <div
                key={artist._id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{artist.user?.name}</h2>

                    <p className="text-gray-500">{artist.specialization}</p>
                  </div>

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full h-fit text-sm">
                    APPROVED
                  </span>
                </div>

                <div className="mt-6 space-y-2">
                  <p>📧 {artist.user?.email}</p>

                  <p>📞 {artist.user?.phone}</p>

                  <p>📍 {artist.location}</p>

                  <p>⭐ Experience: {artist.experience} years</p>

                  <p>🕐 Available: {artist.availableTime}</p>
                </div>

                <div className="mt-5">
                  <p className="font-semibold">Services</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {artist.services?.map((service, index) => (
                      <span
                        key={index}
                        className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold">Bio</p>

                  <p className="text-gray-600 mt-2">{artist.bio}</p>
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
