import { createContext, useEffect, useState } from "react";
import { getProfile } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Authentication status
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      // No token
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getProfile();

        console.log("PROFILE RESPONSE:", data);

        if (data.success && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "Authentication error:",
          error.response?.data || error.message,
        );

        // Don't immediately remove token here
        // while testing authentication
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
