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
    const requestUrl = error.config?.url || "";
    const isAuthRoute =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/forgot-password") ||
      requestUrl.includes("/auth/reset-password");

    // Only redirect to /login on expired/invalid sessions for protected APIs,
    // NEVER when the user is actively submitting credentials on an auth page.
    if (error.response?.status === 401 && !isAuthRoute) {
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
