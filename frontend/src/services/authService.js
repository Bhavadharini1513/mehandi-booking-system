import axiosInstance from "../utils/axiosInstance";

// REGISTER
export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);

  return response.data;
};

// LOGIN
export const loginUser = async (userData) => {
  const response = await axiosInstance.post("/auth/login", userData);

  return response.data;
};

// GET PROFILE
export const getProfile = async () => {
  const response = await axiosInstance.get("/user/profile");

  return response.data;
};

// UPDATE PROFILE
export const updateProfile = async (profileData) => {
  const response = await axiosInstance.put("/user/profile", profileData);

  return response.data;
};

// CHANGE PASSWORD
export const changePassword = async (passwordData) => {
  const response = await axiosInstance.put(
    "/user/change-password",
    passwordData,
  );

  return response.data;
};

// DASHBOARD
export const getDashboard = async () => {
  const response = await axiosInstance.get("/user/dashboard");

  return response.data;
};

// FORGOT PASSWORD - ask the server to e-mail a reset link
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });

  return response.data;
};

// RESET PASSWORD - set a new password using the token from the e-mail link
export const resetPassword = async (token, password) => {
  const response = await axiosInstance.post(
    `/auth/reset-password/${token}`,
    { password },
  );

  return response.data;
};
