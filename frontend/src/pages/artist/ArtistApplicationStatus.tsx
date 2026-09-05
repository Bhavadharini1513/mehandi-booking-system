import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getMyApplication } from "../../services/artistService";

interface Application {
  status: "pending" | "approved" | "rejected";
  experience: number;
  specialization: string;
  location: string;
}

function ArtistApplicationStatus() {
  const navigate = useNavigate();

  const [application, setApplication] = useState<Application | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const response = await getMyApplication();

        setApplication(response.profile);
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Unable to load application",
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-emerald-700 text-xl">Loading...</p>
      </div>
    );
  }

  if (!application) {
    return null;
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-emerald-700 text-center">
          Artist Application
        </h1>

        <div className="mt-8 text-center">
          {application.status === "pending" && (
            <>
              <div className="text-5xl">⏳</div>

              <h2 className="text-2xl font-bold mt-4">Application Pending</h2>

              <p className="text-gray-600 mt-3">
                Your application has been submitted successfully.
              </p>

              <p className="text-gray-600">Please wait for admin approval.</p>
            </>
          )}

          {application.status === "approved" && (
            <>
              <div className="text-5xl">✅</div>

              <h2 className="text-2xl font-bold text-green-700 mt-4">
                Application Approved
              </h2>

              <button
                onClick={() => navigate("/artist/dashboard")}
                className="mt-6 bg-emerald-600 text-white px-6 py-3 rounded-lg"
              >
                Go to Artist Dashboard
              </button>
            </>
          )}

          {application.status === "rejected" && (
            <>
              <div className="text-5xl">❌</div>

              <h2 className="text-2xl font-bold text-red-600 mt-4">
                Application Rejected
              </h2>

              <p className="text-gray-600 mt-3">
                Your artist application was not approved.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 border-t pt-6 space-y-3">
          <p>
            <strong>Experience:</strong> {application.experience} years
          </p>

          <p>
            <strong>Specialization:</strong> {application.specialization}
          </p>

          <p>
            <strong>Location:</strong> {application.location}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ArtistApplicationStatus;
