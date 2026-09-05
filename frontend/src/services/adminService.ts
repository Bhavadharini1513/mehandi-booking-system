import axiosInstance from "../utils/axiosInstance";

// ======================================================
// DASHBOARD STATS TYPE
// ======================================================

export interface DashboardStats {
  totalCustomers: number;
  totalArtists: number;
  pendingApplications: number;
  rejectedApplications: number;
  totalBookings: number;
  completedBookings: number;
}

// ======================================================
// CUSTOMER TYPE
// ======================================================

export interface Customer {
  _id: string;

  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;

  role: string;

  createdAt: string;
}

// ======================================================
// ARTIST APPLICATION TYPE
// ======================================================

export interface ArtistApplication {
  _id: string;

  experience: number;

  specialization: string;

  bio: string;

  location: string;

  availableLocations?: string[];

  availableTime?: string;

  services: string[];

  profileImage?: string;

  status: "pending" | "approved" | "rejected";

  createdAt: string;

  // User model information
  user: {
    _id: string;

    name: string;

    email: string;

    phone: string;

    address: string;

    city: string;

    role: string;
  };
}

// ======================================================
// APPROVED ARTIST TYPE
// ======================================================
//
// IMPORTANT:
//
// Backend /api/admin/artists returns:
//
// {
//   _id,
//   userId,
//   name,
//   email,
//   phone,
//   address,
//   city,
//   role,
//   experience,
//   specialization,
//   location,
//   services,
//   bio,
//   status,
//   createdAt
// }
//
// Therefore user information is directly
// available as artist.name, artist.phone, etc.
// ======================================================

export interface Artist {
  // ArtistProfile ID
  _id: string;

  // User ID
  userId: string;

  // ====================================================
  // USER MODEL DATA
  // ====================================================

  name: string;

  email: string;

  phone: string;

  address: string;

  city: string;

  role: string;

  // ====================================================
  // ARTIST PROFILE DATA
  // ====================================================

  experience: number;

  specialization: string;

  bio: string;

  location: string;

  services: string[];

  // Optional fields
  availableLocations?: string[];

  availableTime?: string;

  profileImage?: string;

  // ====================================================
  // STATUS
  // ====================================================

  status: "pending" | "approved" | "rejected" | string;

  createdAt: string;
}

// ======================================================
// BOOKING TYPE
// ======================================================

export interface Booking {
  _id: string;

  // ====================================================
  // CUSTOMER
  // ====================================================

  customer: {
    _id: string;

    name: string;

    email: string;

    phone: string;

    city: string;
  };

  // ====================================================
  // ARTIST
  // ====================================================

  artist: {
    _id: string;

    name: string;

    email: string;

    phone: string;

    city: string;
  };

  // ====================================================
  // ARTIST PROFILE
  // ====================================================

  artistProfile?: {
    _id: string;

    location: string;

    specialization: string;
  };

  // ====================================================
  // BOOKING DETAILS
  // ====================================================

  bookingDate: string;

  startTime: string;

  endTime: string;

  service: string;

  status: "pending" | "confirmed" | "cancelled" | "completed";

  notes?: string;

  createdAt: string;
}

// ======================================================
// GET DASHBOARD STATS
// ======================================================

export const getDashboardStats = async (): Promise<{
  success: boolean;
  stats: DashboardStats;
}> => {
  try {
    const response = await axiosInstance.get("/admin/stats");

    console.log("DASHBOARD STATS:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "GET DASHBOARD STATS ERROR:",
      error.response?.data || error.message || error,
    );

    throw error;
  }
};

// ======================================================
// GET CUSTOMERS
// ======================================================

export const getCustomers = async (): Promise<{
  success: boolean;
  count: number;
  customers: Customer[];
}> => {
  try {
    const response = await axiosInstance.get("/admin/customers");

    console.log("CUSTOMERS API RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "GET CUSTOMERS ERROR:",
      error.response?.data || error.message || error,
    );

    throw error;
  }
};

// ======================================================
// GET APPROVED ARTISTS
// ======================================================

export const getArtists = async (): Promise<{
  success: boolean;
  count: number;
  artists: Artist[];
}> => {
  try {
    const response = await axiosInstance.get("/admin/artists");

    console.log("APPROVED ARTISTS API RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "GET APPROVED ARTISTS ERROR:",
      error.response?.data || error.message || error,
    );

    throw error;
  }
};

// ======================================================
// GET ARTIST APPLICATIONS
// ======================================================

export const getArtistApplications = async (): Promise<{
  success: boolean;
  count: number;
  applications: ArtistApplication[];
}> => {
  try {
    const response = await axiosInstance.get("/admin/applications");

    console.log("ARTIST APPLICATIONS API RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "GET ARTIST APPLICATIONS ERROR:",
      error.response?.data || error.message || error,
    );

    throw error;
  }
};

// ======================================================
// APPROVE ARTIST
// ======================================================

export const approveArtist = async (id: string) => {
  try {
    const response = await axiosInstance.put(
      `/admin/applications/${id}/approve`,
    );

    console.log("APPROVE ARTIST RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "APPROVE ARTIST ERROR:",
      error.response?.data || error.message || error,
    );

    throw error;
  }
};

// ======================================================
// REJECT ARTIST
// ======================================================

export const rejectArtist = async (id: string) => {
  try {
    const response = await axiosInstance.put(
      `/admin/applications/${id}/reject`,
    );

    console.log("REJECT ARTIST RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "REJECT ARTIST ERROR:",
      error.response?.data || error.message || error,
    );

    throw error;
  }
};

// ======================================================
// GET BOOKINGS
// ======================================================

export const getBookings = async (): Promise<{
  success: boolean;
  count: number;
  bookings: Booking[];
}> => {
  try {
    const response = await axiosInstance.get("/admin/bookings");

    console.log("BOOKINGS API RESPONSE:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "GET BOOKINGS ERROR:",
      error.response?.data || error.message || error,
    );

    throw error;
  }
};
