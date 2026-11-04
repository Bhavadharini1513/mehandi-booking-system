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
    <nav className="bg-[#0F2C23] text-stone-100 border-b border-[#C5A059]/30 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[#163E32] border border-[#C5A059]/40 flex items-center justify-center text-[#D4AF37] font-bold">
            M
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-white">
            Maruthani <span className="text-[#C5A059]">Admin</span>
          </span>
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium">
          <Link to="/admin/dashboard" className="text-stone-300 hover:text-[#D4AF37] transition-colors">
            Dashboard
          </Link>
          <Link to="/admin/customers" className="text-stone-300 hover:text-[#D4AF37] transition-colors">
            Customers
          </Link>
          <Link to="/admin/artists" className="text-stone-300 hover:text-[#D4AF37] transition-colors">
            Artists
          </Link>
          <Link to="/admin/applications" className="text-stone-300 hover:text-[#D4AF37] transition-colors">
            Applications
          </Link>
          <Link to="/admin/bookings" className="text-stone-300 hover:text-[#D4AF37] transition-colors">
            Bookings
          </Link>
          <button
            onClick={handleLogout}
            className="bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700/50 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
