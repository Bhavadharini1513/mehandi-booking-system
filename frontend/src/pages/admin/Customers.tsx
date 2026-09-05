import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Customer, getCustomers } from "../../services/adminService";

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);

      const response = await getCustomers();

      setCustomers(response.customers || []);
    } catch (error: any) {
      console.error(error);

      toast.error(error.response?.data?.message || "Unable to load customers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>

        <p className="text-gray-500 mt-2">View all registered customers.</p>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-10 text-center mt-8">
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center mt-8">
            No customers found.
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md mt-8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="text-left p-4">Name</th>

                    <th className="text-left p-4">Email</th>

                    <th className="text-left p-4">Phone</th>

                    <th className="text-left p-4">City</th>

                    <th className="text-left p-4">Registered</th>
                  </tr>
                </thead>

                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-4 font-semibold">{customer.name}</td>

                      <td className="p-4">{customer.email}</td>

                      <td className="p-4">{customer.phone}</td>

                      <td className="p-4">{customer.city}</td>

                      <td className="p-4">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;
