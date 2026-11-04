import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getArtistById, PublicArtist } from "../../services/artistService";

function ArtistDetails() {
  const { id } = useParams();

  const [artist, setArtist] = useState<PublicArtist | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtist = async () => {
      try {
        const response = await getArtistById(id as string);

        setArtist(response.artist);
      } catch (error: any) {
        if (error.response?.status !== 404) {
          toast.error(error.response?.data?.message || "Unable to load artist");
        }
      } finally {
        setLoading(false);
      }
    };

    loadArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        Loading artist...
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Artist not found</h1>

          <Link to="/artists" className="text-emerald-700 mt-4 inline-block">
            ← Back to Artists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <Link to="/artists" className="text-emerald-700 font-semibold">
          ← Back to Artists
        </Link>

        <div className="bg-white rounded-3xl shadow-xl mt-6 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white p-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-28 h-28 rounded-full bg-white text-5xl flex items-center justify-center">
                {artist.profileImage ? (
                  <img
                    src={artist.profileImage}
                    alt={artist.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  "🌿"
                )}
              </div>

              <div>
                <h1 className="text-4xl font-bold">{artist.name}</h1>

                <p className="text-emerald-50 mt-1">{artist.specialization}</p>

                <p className="mt-2">📍 {artist.location}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-4 gap-5">
              <div className="bg-pink-50 rounded-xl p-5">
                <p className="text-gray-500">Price</p>

                <p className="text-2xl font-bold text-pink-700">
                  ₹{artist.pricePerHour}
                  <span className="text-sm font-normal"> / hour</span>
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-5">
                <p className="text-gray-500">Experience</p>

                <p className="text-2xl font-bold text-emerald-800">
                  {artist.experience} years
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-5">
                <p className="text-gray-500">Rating</p>

                <p className="text-2xl font-bold text-emerald-800">
                  {artist.rating.toFixed(1)} / 5
                </p>
              </div>

              <div className="bg-emerald-50 rounded-xl p-5">
                <p className="text-gray-500">Available Time</p>

                <p className="text-lg font-bold text-emerald-800">
                  {artist.availableTime || "Contact artist"}
                </p>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-emerald-900">
                About the Artist
              </h2>

              <p className="text-gray-600 mt-3 leading-7">{artist.bio}</p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-emerald-900">Services</h2>

              <div className="flex flex-wrap gap-3 mt-4">
                {artist.services.map((service) => (
                  <span
                    key={service}
                    className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold text-emerald-900">
                Available Locations
              </h2>

              <div className="flex flex-wrap gap-3 mt-4">
                {[artist.location, ...artist.availableLocations]
                  .filter(
                    (item, index, array) =>
                      item && array.indexOf(item) === index,
                  )
                  .map((item) => (
                    <span
                      key={item}
                      className="border border-emerald-200 px-4 py-2 rounded-full text-gray-700"
                    >
                      📍 {item}
                    </span>
                  ))}
              </div>
            </section>

            <div className="mt-10">
              <Link
                to={`/book/${artist._id}`}
                className="inline-block bg-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-700"
              >
                Book This Artist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistDetails;
