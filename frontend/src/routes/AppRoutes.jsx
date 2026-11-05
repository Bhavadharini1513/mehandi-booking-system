import React, { Component } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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
import Dashboard from "../pages/dashboard/Dashboard";
import ChangePassword from "../pages/dashboard/ChangePassword";

import ProtectedRoute from "./ProtectedRoute";

import Navbar from "../components/layouts/Navbar";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../components/layouts/AdminLayout";
import Customers from "../pages/admin/Customers";
import AdminArtists from "../pages/admin/Artists";
import ArtistApplications from "../pages/admin/ArtistApplications";
import Bookings from "../pages/admin/Bookings";

class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("GLOBAL ERROR BOUNDARY CAUGHT:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[500px] flex flex-col items-center justify-center p-8 bg-[#FAF8F3] text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-3xl mb-4 shadow-xs">
            🌿
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">
            Module Refresh Required
          </h2>
          <p className="text-sm text-stone-500 max-w-md mb-6">
            A temporary layout issue occurred. Click below to reload:
            <span className="font-mono text-xs text-rose-600 block mt-1">
              {this.state.error?.message || "Unknown error"}
            </span>
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-6 py-2.5 rounded-xl bg-[#0F2C23] text-[#FDFBF7] font-semibold text-sm hover:bg-[#163E32] transition-colors cursor-pointer shadow-xs"
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function CustomerLayout({ children }) {
  const location = useLocation();
  return (
    <>
      <Navbar />
      <GlobalErrorBoundary key={location.pathname}>
        {children}
      </GlobalErrorBoundary>
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
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["customer", "artist", "admin"]}>
            <CustomerLayout>
              <Dashboard />
            </CustomerLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute allowedRoles={["customer", "artist", "admin"]}>
            <CustomerLayout>
              <ChangePassword />
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
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="artists" element={<AdminArtists />} />
        <Route path="applications" element={<ArtistApplications />} />
        <Route path="bookings" element={<Bookings />} />
      </Route>

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
