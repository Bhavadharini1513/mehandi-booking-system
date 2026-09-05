import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Admin logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="bg-emerald-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/admin/dashboard" className="text-2xl font-bold">
            🌿 Mehandi Admin
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/admin/dashboard" className="hover:text-emerald-200">
              Dashboard
            </Link>

            <Link to="/admin/customers" className="hover:text-emerald-200">
              Customers
            </Link>

            <Link to="/admin/artists" className="hover:text-emerald-200">
              Artists
            </Link>

            <Link to="/admin/applications" className="hover:text-emerald-200">
              Applications
            </Link>

            <Link to="/admin/bookings" className="hover:text-emerald-200">
              Bookings
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
