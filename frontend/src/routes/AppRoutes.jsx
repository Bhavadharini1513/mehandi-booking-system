import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Home from "../pages/customer/Home";
import Services from "../pages/customer/Services";
import Artists from "../pages/customer/Artists";
import ArtistDetails from "../pages/customer/ArtistDetails";
import BookArtist from "../pages/customer/BookArtist";
import MyBookings from "../pages/customer/MyBookings";
import Payment from "../pages/customer/Payment";
import Chat from "../pages/customer/Chat";
import TypeScriptDemo from "../typescript-demo/TypeScriptDemo";

import BecomeArtist from "../pages/artist/BecomeArtist";
import ArtistDashboard from "../pages/artist/ArtistDashboard";
import ArtistApplicationStatus from "../pages/artist/ArtistApplicationStatus";

import Profile from "../pages/dashboard/Profile";

import ProtectedRoute from "./ProtectedRoute";

import Navbar from "../components/layouts/Navbar";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminNavbar from "../components/layouts/AdminNavbar";
import Customers from "../pages/admin/Customers";
import AdminArtists from "../pages/admin/Artists";
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
      {/* ================= PUBLIC ================= */}

      <Route
        path="/"
        element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        }
      />

      <Route
        path="/home"
        element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        }
      />

      <Route
        path="/services"
        element={
          <CustomerLayout>
            <Services />
          </CustomerLayout>
        }
      />

      <Route
        path="/artists"
        element={
          <CustomerLayout>
            <Artists />
          </CustomerLayout>
        }
      />

      <Route
        path="/artists/:id"
        element={
          <CustomerLayout>
            <ArtistDetails />
          </CustomerLayout>
        }
      />

      {/* ================= AUTH ================= */}

      <Route
        path="/login"
        element={
          <CustomerLayout>
            <Login />
          </CustomerLayout>
        }
      />

      <Route path="/register" element={<Register />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* TypeScript concepts demo (syllabus Units II & III) */}
      <Route
        path="/typescript-demo"
        element={
          <CustomerLayout>
            <TypeScriptDemo />
          </CustomerLayout>
        }
      />

      {/* ================= CUSTOMER ================= */}

      <Route
        path="/book/:id"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerLayout>
              <BookArtist />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute allowedRoles={["customer", "artist"]}>
            <CustomerLayout>
              <MyBookings />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/pay/:bookingId"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerLayout>
              <Payment />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:bookingId"
        element={
          <ProtectedRoute allowedRoles={["customer", "artist"]}>
            <CustomerLayout>
              <Chat />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["customer", "artist"]}>
            <CustomerLayout>
              <Profile />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/become-artist"
        element={
          <ProtectedRoute allowedRoles={["customer"]}>
            <CustomerLayout>
              <BecomeArtist />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/artist/application-status"
        element={
          <ProtectedRoute allowedRoles={["customer", "artist"]}>
            <CustomerLayout>
              <ArtistApplicationStatus />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= ARTIST ================= */}

      <Route
        path="/artist/dashboard"
        element={
          <ProtectedRoute allowedRoles={["artist"]}>
            <CustomerLayout>
              <ArtistDashboard />
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
              <AdminArtists />
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

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <CustomerLayout>
            <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-50">
              <h1 className="text-5xl font-bold text-emerald-800">404</h1>
              <p className="text-gray-600 mt-2">This page does not exist.</p>
              <a href="/" className="text-emerald-700 font-semibold mt-4">
                ← Go home
              </a>
            </div>
          </CustomerLayout>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
