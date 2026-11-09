import React, { Component, useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import {
  LuLayoutDashboard,
  LuUsers,
  LuPalette,
  LuClipboardList,
  LuCalendar,
  LuSettings,
  LuSearch,
  LuBell,
  LuMenu,
  LuX,
  LuLogOut,
  LuShieldCheck,
  LuExternalLink,
  LuSparkles,
} from "react-icons/lu";


class AdminErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ADMIN ERROR BOUNDARY CAUGHT:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-stone-200/80 shadow-xs text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 text-2xl mb-4">
            ⚠️
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">
            Module Rendering Issue
          </h2>
          <p className="text-sm text-stone-500 max-w-md mb-6">
            An unexpected error occurred while rendering this administrative module:{" "}
            <span className="font-mono text-xs text-rose-600 block mt-1">
              {this.state.error?.message || "Unknown error"}
            </span>
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#0F2C23] text-[#FDFBF7] font-semibold text-sm hover:bg-[#163E32] transition-colors cursor-pointer"
          >
            Reload Module
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const adminName =
    user?.name && !user.name.toLowerCase().includes("jeeva")
      ? user.name
      : "Bhava Dharini";

  // Keyboard shortcut listener: Ctrl + K or Cmd + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setNotificationsOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Signed out of Administrative Suite");
    navigate("/login");
  };

  const navLinks = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LuLayoutDashboard className="w-5 h-5" />,
      badge: null,
    },
    {
      label: "Customers",
      path: "/admin/customers",
      icon: <LuUsers className="w-5 h-5" />,
      badge: null,
    },
    {
      label: "Artists",
      path: "/admin/artists",
      icon: <LuPalette className="w-5 h-5" />,
      badge: "Verified",
    },
    {
      label: "Applications",
      path: "/admin/applications",
      icon: <LuClipboardList className="w-5 h-5" />,
      badge: "Review",
    },
    {
      label: "Bookings",
      path: "/admin/bookings",
      icon: <LuCalendar className="w-5 h-5" />,
      badge: null,
    },
  ];

  const quickSearchOptions = [
    { label: "View Revenue & Dashboard Analytics", path: "/admin/dashboard", category: "Metrics" },
    { label: "Inspect Registered Customers", path: "/admin/customers", category: "Users" },
    { label: "Browse Approved Mehndi Artists", path: "/admin/artists", category: "Artists" },
    { label: "Review Pending Artist Applications", path: "/admin/applications", category: "Tasks" },
    { label: "Monitor Real-Time Bookings", path: "/admin/bookings", category: "Operations" },
  ].filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col font-sans antialiased text-stone-900">
      {/* =========================================================
          TOP FIXED ENTERPRISE HEADER
      ========================================================= */}
      <header className="fixed top-0 left-0 right-0 h-18 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger + Desktop Brand */}
        <div className="flex items-center gap-3 lg:gap-6">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation"
            className="lg:hidden p-2.5 rounded-lg text-stone-600 hover:text-[#0F2C23] hover:bg-stone-100 transition-colors cursor-pointer"
          >
            {mobileOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
          </button>

          <Link to="/admin/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F2C23] to-[#163E32] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37] shadow-sm shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <LuSparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-tight text-[#0F2C23] leading-tight">
                Maruthani <span className="text-[#C5A059]">World</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-600">
                Enterprise Suite
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar with Ctrl + K */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between bg-stone-100/90 hover:bg-stone-100 border border-stone-200 text-stone-400 rounded-xl px-3.5 py-2 text-sm transition-all shadow-2xs hover:border-[#C5A059]/50 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-stone-500">
              <LuSearch className="w-4 h-4 text-[#C5A059]" />
              <span>Quick search resources, artists, clients...</span>
            </div>
            <kbd className="hidden sm:inline-flex items-center gap-1 bg-white border border-stone-300 rounded px-2 py-0.5 text-[11px] font-semibold text-stone-500 shadow-2xs">
              Ctrl + K
            </kbd>
          </button>
        </div>

        {/* Right: Environment Badge, Notifications, User Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Environment Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>PROD</span>
          </div>

          {/* Quick Search on mobile */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 cursor-pointer"
          >
            <LuSearch className="w-5 h-5" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              className="relative p-2.5 rounded-xl text-stone-600 hover:text-[#0F2C23] hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <LuBell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#C5A059] ring-2 ring-white"></span>
            </button>

            {/* Notification Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-base text-[#0F2C23]">
                      Notifications
                    </span>
                    <span className="bg-[#C5A059]/15 text-[#0F2C23] text-xs font-bold px-2 py-0.5 rounded-full">
                      3 New
                    </span>
                  </div>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2.5 text-xs text-stone-600">
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100 hover:bg-amber-50 transition-colors">
                    <p className="font-semibold text-stone-900">New Artist Application</p>
                    <p className="text-stone-500 mt-0.5">
                      A new mehndi artist has submitted credentials for review.
                    </p>
                    <span className="text-[10px] text-amber-700 font-medium">10 mins ago</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 transition-colors">
                    <p className="font-semibold text-stone-900">Payment Confirmed</p>
                    <p className="text-stone-500 mt-0.5">
                      Booking #BK-9421 confirmed via Razorpay gateway.
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium">1 hour ago</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 hover:bg-stone-100/70 transition-colors">
                    <p className="font-semibold text-stone-900">System Healthy</p>
                    <p className="text-stone-500 mt-0.5">
                      MongoDB Atlas latency is 38ms. All background cron tasks operating normally.
                    </p>
                    <span className="text-[10px] text-stone-400 font-medium">Today</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0F2C23] to-[#C5A059] text-white flex items-center justify-center font-bold text-sm shadow-xs ring-2 ring-[#C5A059]/30">
              {adminName ? adminName.charAt(0).toUpperCase() : "B"}
            </div>
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-bold text-stone-900 leading-tight">
                {adminName}
              </span>
              <span className="text-[11px] text-[#C5A059] font-medium flex items-center gap-1">
                <LuShieldCheck className="w-3 h-3 text-[#C5A059]" />
                System Administrator
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          DESKTOP COLLAPSIBLE LEFT SIDEBAR
      ========================================================= */}
      <aside
        className={`hidden lg:flex flex-col fixed top-18 bottom-0 left-0 ${
          sidebarCollapsed ? "w-20" : "w-68"
        } bg-[#0F2C23] text-stone-200 border-r border-[#C5A059]/20 transition-all duration-300 z-30 shadow-xl`}
      >
        {/* Navigation Section */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]/80">
            {!sidebarCollapsed && "Core Management"}
          </div>

          {navLinks.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex items-center ${
                  sidebarCollapsed ? "justify-center px-2" : "justify-between px-3.5"
                } py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-[#163E32] to-[#1e4e40] text-amber-200 shadow-sm border border-[#C5A059]/40"
                    : "text-stone-300 hover:bg-[#163E32]/70 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? "text-[#D4AF37]" : "text-stone-400 group-hover:text-[#D4AF37]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </div>

                {!sidebarCollapsed && item.badge && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-amber-300 border border-[#C5A059]/40">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-bold uppercase tracking-widest text-[#C5A059]/80">
            {!sidebarCollapsed && "Portals & Tools"}
          </div>

          <Link
            to="/home"
            target="_blank"
            rel="noopener noreferrer"
            title={sidebarCollapsed ? "Live Storefront" : undefined}
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center px-2" : "gap-3 px-3.5"
            } py-2.5 rounded-xl text-sm font-medium text-stone-300 hover:bg-[#163E32]/70 hover:text-white transition-all`}
          >
            <LuExternalLink className="w-4 h-4 text-[#C5A059]" />
            {!sidebarCollapsed && <span>Customer Storefront</span>}
          </Link>
        </div>

        {/* Sidebar Footer with Collapse Toggle & Logout */}
        <div className="p-4 border-t border-[#C5A059]/20 bg-[#0c241c] space-y-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              sidebarCollapsed ? "justify-center" : "gap-3 px-3"
            } py-2.5 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/60 hover:text-rose-100 transition-colors cursor-pointer`}
          >
            <LuLogOut className="w-4 h-4 text-rose-400" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full text-center text-[11px] text-stone-400 hover:text-amber-200 transition-colors py-1 cursor-pointer"
          >
            {sidebarCollapsed ? "Expand »" : "« Collapse Sidebar"}
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE SLIDE-IN NAVIGATION DRAWER
      ========================================================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          ></div>

          {/* Drawer Body */}
          <div className="relative w-80 max-w-[85vw] bg-[#0F2C23] text-stone-200 h-full flex flex-col p-6 shadow-2xl z-10 border-r border-[#C5A059]/30">
            <div className="flex items-center justify-between pb-6 border-b border-[#C5A059]/20">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#163E32] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37]">
                  <LuSparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold text-amber-100">
                    Maruthani
                  </span>
                  <p className="text-[10px] text-[#C5A059] uppercase tracking-wider font-semibold">
                    Admin Portal
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-[#163E32]"
              >
                <LuX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 py-6 space-y-2 overflow-y-auto">
              {navLinks.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 min-h-[46px] rounded-xl text-base font-medium transition-all ${
                      isActive
                        ? "bg-[#163E32] text-amber-200 border border-[#C5A059]/40 font-semibold"
                        : "text-stone-300 hover:bg-[#163E32]/50 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={isActive ? "text-[#D4AF37]" : "text-stone-400"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#C5A059]/20 text-amber-300">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-[#C5A059]/20 mt-4">
                <Link
                  to="/home"
                  target="_blank"
                  className="flex items-center gap-3 px-4 min-h-[46px] text-stone-300 hover:text-white rounded-xl hover:bg-[#163E32]/50"
                >
                  <LuExternalLink className="w-4 h-4 text-[#C5A059]" />
                  <span>Customer Storefront</span>
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-[#C5A059]/20">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 min-h-[46px] bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded-xl font-semibold border border-rose-700/40 transition-colors"
              >
                <LuLogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          COMMAND PALETTE SEARCH MODAL (Ctrl + K)
      ========================================================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSearchOpen(false)}
          ></div>
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center border-b border-stone-200 px-4 py-3.5 gap-3 bg-stone-50/50">
              <LuSearch className="w-5 h-5 text-[#C5A059]" />
              <input
                type="text"
                autoFocus
                placeholder="Type a resource or page name (e.g., Bookings, Artists)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-sm text-stone-900 focus:outline-none placeholder:text-stone-400"
              />
              <kbd className="text-[10px] bg-white border border-stone-200 rounded px-1.5 py-0.5 text-stone-400 font-semibold shadow-2xs">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400 px-3 py-2">
                Quick Navigation
              </p>
              {quickSearchOptions.length === 0 ? (
                <div className="p-8 text-center text-sm text-stone-500">
                  No matching resources found for "{searchQuery}".
                </div>
              ) : (
                quickSearchOptions.map((opt) => (
                  <button
                    key={opt.path}
                    onClick={() => {
                      navigate(opt.path);
                      setSearchOpen(false);
                    }}
                    className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                      <span className="text-sm font-medium text-stone-800 group-hover:text-[#0F2C23]">
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 bg-stone-100 px-2 py-0.5 rounded group-hover:bg-[#C5A059]/15 group-hover:text-[#0F2C23]">
                      {opt.category}
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span>Use arrows to navigate</span>
              <span>Maruthani World Command Center</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MAIN CONTENT AREA
      ========================================================= */}
      <main
        className={`flex-1 transition-all duration-300 pt-18 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-68"
        }`}
      >
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"><AdminErrorBoundary key={location.pathname}>{children || <Outlet />}</AdminErrorBoundary></div>
      </main>
    </div>
  );
}

export default AdminLayout;
