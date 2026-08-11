import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-4xl font-bold">Welcome {user?.name}</h1>

      <p>{user?.email}</p>

      <p>{user?.role}</p>

      <button
        onClick={logout}
        className="mt-6 bg-red-600 text-white px-6 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
