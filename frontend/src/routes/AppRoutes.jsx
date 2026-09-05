import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Home from "../pages/customer/Home";
import BecomeArtist from "../pages/artist/BecomeArtist";
import ArtistDashboard from "../pages/artist/ArtistDashboard";

import ProtectedRoute from "../routes/ProtectedRoute";
import Navbar from "../components/layouts/Navbar";
import ArtistApplicationStatus from "../pages/artist/ArtistApplicationStatus";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminNavbar from "../components/layouts/AdminNavbar";
import Customers from "../pages/admin/Customers";
import Artists from "../pages/admin/Artists";
import ArtistApplications from "../pages/admin/ArtistApplications";
import Bookings from "../pages/admin/Bookings";

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
      <Route
        path="/"
        element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        }
      />

      <Route path="/login" element={<Login />} />

      {/* Register */}
      <Route path="/register" element={<Register />} />

      {/* Customer Home */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <CustomerLayout>
              <Home />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* Become Artist */}
      <Route
        path="/become-artist"
        element={
          <ProtectedRoute>
            <CustomerLayout>
              <BecomeArtist />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* Artist Dashboard */}
      <Route
        path="/artist/dashboard"
        element={
          <ProtectedRoute>
            <CustomerLayout>
              <ArtistDashboard />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/artist/application-status"
        element={
          <ProtectedRoute>
            <CustomerLayout>
              <ArtistApplicationStatus />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />
      {/* ================= ADMIN ================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <Customers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/artists"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <Artists />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/applications"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <ArtistApplications />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout>
              <Bookings />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
