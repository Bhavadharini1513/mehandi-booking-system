import { useEffect, useState } from "react";

import { getArtistProfile } from "../../services/artistService";

import { ArtistProfile } from "../../types/Artist";

function ArtistDashboard() {
  const [profile, setProfile] = useState<ArtistProfile | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfile = async (): Promise<void> => {
      try {
        const data = await getArtistProfile();

        setProfile(data.profile);
      } catch (error: any) {
        console.error(
          "Artist profile error:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-emerald-700">Loading Artist Dashboard...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Artist profile not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-emerald-800">
          Artist Dashboard
        </h1>

        <p className="text-gray-600 mt-2">
          Manage your Mehandi artist profile.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold">{profile.user.name}</h2>

          <p className="text-gray-500 mt-1">{profile.user.email}</p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div>
              <p className="font-semibold">Experience</p>

              <p className="text-gray-600">{profile.experience} years</p>
            </div>

            <div>
              <p className="font-semibold">Specialization</p>

              <p className="text-gray-600">{profile.specialization}</p>
            </div>

            <div>
              <p className="font-semibold">Location</p>

              <p className="text-gray-600">{profile.location}</p>
            </div>

            <div>
              <p className="font-semibold">Status</p>

              <span className="inline-block mt-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                {profile.status}
              </span>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-lg">About</h3>

            <p className="text-gray-600 mt-2">{profile.bio}</p>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-lg">Services</h3>

            <div className="flex flex-wrap gap-2 mt-3">
              {profile.services.map((service: string, index: number) => (
                <span
                  key={index}
                  className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistDashboard;
