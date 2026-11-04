import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { User } from "../types/User";

// Shape of the value provided by <AuthProvider>
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
}

const useAuth = (): AuthContextValue => {
  return useContext(AuthContext) as unknown as AuthContextValue;
};

export default useAuth;
