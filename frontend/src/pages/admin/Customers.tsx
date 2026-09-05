import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AdminNavbar from "../../components/layouts/AdminNavbar";
import { getCustomers } from "../../services/adminService";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  role: string;
  createdAt: string;
}

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const response = await getCustomers();

      console.log("CUSTOMERS:", response);

      setCustomers(response.customers || []);
    } catch (error: any) {
      console.error(error);

      toast.error(error.response?.data?.message || "Unable to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>

        <p className="text-gray-500 mt-2">View all registered customers.</p>

        {loading ? (
          <div className="text-center py-10">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-xl shadow mt-8 p-10 text-center">
            <p className="text-gray-500">No customers found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="text-4xl">👤</div>

                <h2 className="text-xl font-bold mt-4">{customer.name}</h2>

                <p className="text-gray-600 mt-2">📧 {customer.email}</p>

                <p className="text-gray-600 mt-2">📞 {customer.phone}</p>

                <p className="text-gray-600 mt-2">📍 {customer.city}</p>

                <p className="text-gray-500 mt-3 text-sm">{customer.address}</p>

                <div className="mt-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    CUSTOMER
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
