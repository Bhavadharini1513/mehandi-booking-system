import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-green-700">
          Welcome to Dashboard
        </h1>

        <div className="mt-6 bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold">Hello, {user?.name}</h2>

          <p className="mt-2">Email: {user?.email}</p>

          <p>Role: {user?.role}</p>

          <p>Phone: {user?.phone}</p>

          <p>City: {user?.city}</p>

          <button
            onClick={handleLogout}
            className="mt-6 bg-red-500 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
