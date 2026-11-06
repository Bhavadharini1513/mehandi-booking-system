import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getServices, ServiceItem } from "../../services/artistService";

export interface DisplayServiceItem extends ServiceItem {
  displayName: string;
}

const LOCAL_SERVICE_PHOTOS: Record<string, string> = {
  "Arabic Design": "/assets/services/arabic-design.webp",
  "Bridal Mehndi": "/assets/services/bridal-mehndi.webp",
  "Custom Portrait Henna": "/assets/services/custom-portrait.webp",
  "Festive Mehndi": "/assets/services/festive-mehndi.webp",
  "Figure Henna": "/assets/services/figure-henna.webp",
  "Gujarati Henna": "/assets/services/gujarati-henna.webp",
  "Indo-western Fusion": "/assets/services/indo-western.webp",
  "Minimalist Wrist": "/assets/services/minimalist-wrist.webp",
  "Party Henna": "/assets/services/party-henna.webp",
  "Royal Marwari": "/assets/services/royal-marwari.webp",
  "Sangeet Event": "/assets/services/sangeet-event.webp",
  "Traditional Mehndi": "/assets/services/traditional-mehndi.webp",
};

const DEFAULT_SERVICE_PHOTO = "/assets/services/bridal-mehndi.webp";

const POPULAR_SERVICES: ServiceItem[] = [
  { name: "Bridal Mehndi", artistCount: 3 },
  { name: "Arabic Design", artistCount: 2 },
  { name: "Festive Mehndi", artistCount: 2 },
  { name: "Custom Portrait Henna", artistCount: 1 },
  { name: "Figure Henna", artistCount: 2 },
  { name: "Gujarati Henna", artistCount: 2 },
  { name: "Indo-western Fusion", artistCount: 1 },
  { name: "Minimalist Wrist", artistCount: 1 },
  { name: "Party Henna", artistCount: 2 },
  { name: "Royal Marwari", artistCount: 3 },
  { name: "Sangeet Event", artistCount: 2 },
  { name: "Traditional Mehndi", artistCount: 3 },
];

// Helper function to standardize service names
const normalizeCategoryName = (name: string): string => {
  const lower = (name || "").toLowerCase().trim();
  if (lower === "arabic" || lower === "arabic design") return "Arabic Design";
  if (lower === "bridal" || lower === "bridal mehndi") return "Bridal Mehndi";
  if (lower === "traditional" || lower === "traditional mehndi")
    return "Traditional Mehndi";
  if (lower === "festive" || lower === "festive mehndi")
    return "Festive Mehndi";
  if (
    lower === "minimalist" ||
    lower === "minimalist wrist" ||
    lower === "minimalist patterns" ||
    lower === "minimal"
  )
    return "Minimalist Wrist";
  if (lower === "party" || lower === "party henna") return "Party Henna";
  if (lower === "marwari" || lower === "royal marwari") return "Royal Marwari";
  if (lower === "sangeet" || lower === "sangeet event") return "Sangeet Event";
  if (lower === "figure" || lower === "figure henna") return "Figure Henna";
  if (lower === "gujarati" || lower === "gujarati henna") return "Gujarati Henna";
  if (
    lower === "indo-western" ||
    lower === "indo western" ||
    lower === "indo-western fusion"
  )
    return "Indo-western Fusion";
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
};

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

  const sourceServices =
    services.length > 0 ? services : loading ? [] : POPULAR_SERVICES;

  // Deduplicate array based on normalized name
  const uniqueServicesMap = new Map<string, DisplayServiceItem>();
  sourceServices.forEach((service: any) => {
    const rawName = service.name || service.category || "";
    if (!rawName.trim()) return;
    const normalizedTitle = normalizeCategoryName(rawName);
    if (!uniqueServicesMap.has(normalizedTitle)) {
      uniqueServicesMap.set(normalizedTitle, {
        ...service,
        displayName: normalizedTitle,
      });
    } else {
      // Merge artist counts if duplicate entries exist
      const existing = uniqueServicesMap.get(normalizedTitle)!;
      existing.artistCount =
        (existing.artistCount || 1) + (service.artistCount || 1);
    }
  });

  const displayServices = Array.from(uniqueServicesMap.values());

  return (
    <div className="min-h-screen bg-[#FAF8F5] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-100/70 text-emerald-900 border border-emerald-200/80 mb-3 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            HAUTE MEHNDI COUTURE
          </span>

          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Curated Henna Styles & Services
          </h1>

          <p className="text-stone-600 max-w-2xl mx-auto mt-3 text-sm sm:text-base">
            Select a bespoke henna category to discover verified master artisans, explore portfolios, and reserve custom dates.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-500">
            <div className="w-10 h-10 border-3 border-[#0F2C23] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-serif text-lg text-stone-700">
              Loading curated collections...
            </p>
          </div>
        ) : displayServices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl mx-auto mb-4">
              🌿
            </div>
            <h2 className="text-xl font-serif font-bold text-stone-900">
              No services cataloged yet
            </h2>
            <p className="text-stone-500 text-sm mt-2">
              Approved artisans have not added services yet. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayServices.map((service) => {
              const imageSrc =
                LOCAL_SERVICE_PHOTOS[service.displayName] ||
                DEFAULT_SERVICE_PHOTO;

              return (
                <Link
                  key={service.displayName}
                  to={`/artists?service=${encodeURIComponent(
                    service.name || service.displayName,
                  )}`}
                  className="group flex flex-col bg-white rounded-2xl shadow-xs hover:shadow-xl overflow-hidden border border-amber-900/10 hover:border-[#D4AF37]/50 transition-all duration-300"
                >
                  <div className="w-full h-52 bg-amber-900/10 overflow-hidden rounded-t-2xl relative border-b border-[#FAF8F5]">
                    <img
                      src={imageSrc}
                      alt={service.displayName}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          DEFAULT_SERVICE_PHOTO;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-stone-900 group-hover:text-[#0F2C23] transition-colors">
                        {service.displayName}
                      </h2>

                      <p className="text-stone-500 text-sm mt-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>
                          {service.artistCount} approved{" "}
                          {service.artistCount === 1
                            ? "master artist"
                            : "master artists"}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-sm font-semibold text-[#0F2C23] group-hover:text-[#C5A059] transition-colors">
                      <span>Explore Artisans</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;
