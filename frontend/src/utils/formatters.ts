/**
 * Formats location objects or strings into a clean display string
 * Prevents React child rendering errors when location is an object { city, address, pincode }
 */
export const formatLocation = (loc: any, fallback = "Tamil Nadu"): string => {
  if (!loc) return fallback;
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    if (loc.city && loc.address && loc.city !== loc.address) {
      return `${loc.city}`;
    }
    return loc.city || loc.address || fallback;
  }
  return fallback;
};

