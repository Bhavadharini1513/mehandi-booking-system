import axios from "axios";

const rawUrl = import.meta.env.VITE_API_URL || "";
const cleanUrl = rawUrl.replace(/\/+$/, "");
export const baseURL = cleanUrl
  ? cleanUrl.endsWith("/api")
    ? cleanUrl
    : `${cleanUrl}/api`
  : "/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired — clear session and force re-login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (error.response?.status === 403) {
      console.log("Access denied: insufficient role");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
