import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      <Link to="/home" className="text-2xl font-bold text-pink-600">
        Mehandi
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/home" className="text-gray-700 hover:text-pink-600">
          Home
        </Link>

        <Link to="/services" className="text-gray-700 hover:text-pink-600">
          Services
        </Link>

        <Link to="/artists" className="text-gray-700 hover:text-pink-600">
          Artists
        </Link>

        {token ? (
          <>
            <Link to="/profile" className="text-gray-700 hover:text-pink-600">
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
