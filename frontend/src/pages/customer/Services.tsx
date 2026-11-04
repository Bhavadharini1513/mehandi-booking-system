import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getServices, ServiceItem } from "../../services/artistService";

function Services() {
  const [services, setServices] = useState<ServiceItem[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await getServices();

        setServices(response.services || []);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Unable to load services");
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-emerald-600 font-semibold">MEHANDI SERVICES</p>

          <h1 className="text-4xl font-bold text-emerald-900 mt-2">
            Choose a Mehandi Service
          </h1>

          <p className="text-gray-600 mt-3">
            Select a service to see approved artists who provide it.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-emerald-700">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold">No services available</h2>

            <p className="text-gray-500 mt-2">
              Approved artists have not added services yet.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.name}
                to={`/artists?service=${encodeURIComponent(service.name)}`}
                className="bg-white rounded-2xl shadow hover:shadow-xl p-7 border border-transparent hover:border-emerald-300 transition"
              >
                <div className="text-4xl">🌿</div>

                <h2 className="text-2xl font-bold text-emerald-800 mt-4">
                  {service.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  {service.artistCount} approved{" "}
                  {service.artistCount === 1 ? "artist" : "artists"}
                </p>

                <span className="inline-block mt-5 text-emerald-700 font-semibold">
                  View Artists →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
