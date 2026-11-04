import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/*
  Guards a page.

    <ProtectedRoute allowedRoles={["customer"]}> <Page /> </ProtectedRoute>

  * not logged in           -> /login (and come back after logging in)
  * logged in, wrong role   -> /
*/
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!token || !user) {
    const redirect = encodeURIComponent(location.pathname + location.search);

    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
