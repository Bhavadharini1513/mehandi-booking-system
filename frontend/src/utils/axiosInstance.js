import axios from "axios";

const axiosInstance = axios.create({
  // "/api" works in development (Vite proxy) and in Docker (nginx proxy)
  baseURL: import.meta.env.VITE_API_URL || "/api",
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
      console.log("Unauthorized request");
    }

    if (error.response?.status === 403) {
      console.log("Admin access denied");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
