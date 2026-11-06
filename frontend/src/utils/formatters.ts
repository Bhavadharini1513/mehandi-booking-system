/**
 * Formats location objects or strings into a clean display string
 * Prevents React child rendering errors when location is an object { city, address, pincode }
 */
export const formatLocation = (loc: any, fallback = "Tamil Nadu"): string => {
  if (!loc) return fallback;
  if (typeof loc === "string") {
    const trimmed = loc.trim();
    return trimmed || fallback;
  }
  if (typeof loc === "object") {
    const city = typeof loc.city === "string" ? loc.city.trim() : "";
    const address = typeof loc.address === "string" ? loc.address.trim() : "";
    const state = typeof loc.state === "string" ? loc.state.trim() : "";
    if (city) return city;
    if (address) return address;
    if (state) return state;
    return fallback;
  }
  return String(loc) || fallback;
};

