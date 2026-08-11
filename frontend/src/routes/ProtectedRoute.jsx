import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
