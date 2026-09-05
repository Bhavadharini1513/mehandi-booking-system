import axiosInstance from "../utils/axiosInstance";

// ==========================================
// ADMIN DASHBOARD STATS
// ==========================================

export const getDashboardStats = async () => {
  const response = await axiosInstance.get("/admin/stats");

  return response.data;
};

// ==========================================
// GET CUSTOMERS
// ==========================================

export const getCustomers = async () => {
  const response = await axiosInstance.get("/admin/customers");

  return response.data;
};

// ==========================================
// GET APPROVED ARTISTS
// ==========================================

export const getArtists = async () => {
  const response = await axiosInstance.get("/admin/artists");

  return response.data;
};
