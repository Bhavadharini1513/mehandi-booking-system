import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        <Link to="/" className="text-2xl font-bold text-pink-600">
          Mehandi
        </Link>

        <div className="flex items-center gap-5">
          <Link to="/" className="text-gray-700 hover:text-pink-600">
            Home
          </Link>

          <Link to="/services" className="text-gray-700 hover:text-pink-600">
            Services
          </Link>

          <Link to="/artists" className="text-gray-700 hover:text-pink-600">
            Artists
          </Link>

          {user ? (
            <>
              {user.role === "artist" && (
                <Link
                  to="/artist/dashboard"
                  className="text-gray-700 hover:text-pink-600"
                >
                  Artist Dashboard
                </Link>
              )}

              {user.role === "customer" && (
                <Link
                  to="/become-artist"
                  className="text-gray-700 hover:text-pink-600"
                >
                  Become Artist
                </Link>
              )}

              <Link to="/profile" className="text-gray-700 hover:text-pink-600">
                Profile
              </Link>

              <Link
                to="/my-bookings"
                className="text-gray-700 hover:text-pink-600"
              >
                {user.role === "artist" ? "Booking Requests" : "My Bookings"}
              </Link>

              <span className="hidden md:inline text-sm text-gray-500">
                {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
