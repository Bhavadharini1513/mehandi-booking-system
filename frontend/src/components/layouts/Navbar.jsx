import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { LuMenu, LuX, LuSparkles, LuCalendar, LuUser, LuLogOut, LuArrowRight } from "react-icons/lu";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F2C23] to-[#163E32] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37] shadow-xs group-hover:scale-105 transition-transform">
              <LuSparkles className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-[#0F2C23] leading-tight">
                Maruthani <span className="text-[#C5A059]">World</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-600 font-semibold">
                Haute Mehndi Couture
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className="text-stone-700 hover:text-[#0F2C23] hover:underline underline-offset-8 decoration-[#C5A059] decoration-2 transition-all"
            >
              Home
            </Link>
            <Link
              to="/services"
              className="text-stone-700 hover:text-[#0F2C23] hover:underline underline-offset-8 decoration-[#C5A059] decoration-2 transition-all"
            >
              Services
            </Link>
            <Link
              to="/artists"
              className="text-stone-700 hover:text-[#0F2C23] hover:underline underline-offset-8 decoration-[#C5A059] decoration-2 transition-all"
            >
              Artists
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-[#0F2C23] font-semibold text-xs hover:bg-amber-100 transition-colors"
              >
                Admin Suite
              </Link>
            )}

            {user?.role === "artist" && (
              <Link
                to="/artist/dashboard"
                className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold text-xs hover:bg-emerald-100 transition-colors"
              >
                Artist Dashboard
              </Link>
            )}

            {user?.role === "customer" && (
              <Link
                to="/become-artist"
                className="text-stone-700 hover:text-[#C5A059] transition-colors"
              >
                Become an Artist
              </Link>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3.5">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/my-bookings"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-[#0F2C23] bg-stone-100 hover:bg-stone-200/80 border border-stone-200 transition-colors"
                >
                  <LuCalendar className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{user.role === "artist" ? "Bookings Queue" : "My Bookings"}</span>
                </Link>

                <Link
                  to="/profile"
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0F2C23] to-[#163E32] text-amber-200 border border-[#C5A059]/40 flex items-center justify-center font-bold text-xs shadow-xs"
                  title="Profile Settings"
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LuLogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-[#0F2C23] hover:text-[#C5A059] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-[#0F2C23] to-[#163E32] text-amber-200 border border-amber-500/30 hover:border-amber-400 px-4 py-2 rounded-lg text-sm font-semibold shadow-xs hover:shadow-md transition-all"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
            >
              {mobileMenuOpen ? <LuX className="w-6 h-6" /> : <LuMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-stone-800 hover:bg-stone-50"
          >
            Home
          </Link>
          <Link
            to="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-stone-800 hover:bg-stone-50"
          >
            Services
          </Link>
          <Link
            to="/artists"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-medium text-stone-800 hover:bg-stone-50"
          >
            Artists
          </Link>

          {user && (
            <>
              {user.role === "admin" && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-semibold text-[#0F2C23] bg-amber-50"
                >
                  Admin Suite
                </Link>
              )}
              {user.role === "artist" && (
                <Link
                  to="/artist/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-semibold text-emerald-800 bg-emerald-50"
                >
                  Artist Dashboard
                </Link>
              )}
              {user.role === "customer" && (
                <Link
                  to="/become-artist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-stone-800 hover:bg-stone-50"
                >
                  Become an Artist
                </Link>
              )}
              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-stone-800 hover:bg-stone-50"
              >
                {user.role === "artist" ? "Bookings Queue" : "My Bookings"}
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-stone-800 hover:bg-stone-50"
              >
                Profile Settings
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-rose-700 hover:bg-rose-50"
              >
                Sign Out ({user.name})
              </button>
            </>
          )}

          {!user && (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg font-semibold text-[#0F2C23] border border-stone-300"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg font-semibold bg-[#0F2C23] text-amber-200"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
