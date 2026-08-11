import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

import { getProfile, updateProfile } from "../../services/authService";

const Profile = () => {
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =========================
     LOAD PROFILE
  ========================= */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();

        if (response.success) {
          setFormData({
            name: response.user.name || "",
            email: response.user.email || "",
            phone: response.user.phone || "",
            address: response.user.address || "",
            city: response.user.city || "",
          });
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* =========================
     HANDLE INPUT
  ========================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     UPDATE PROFILE
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      setSaving(true);

      const response = await updateProfile({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
      });

      if (response.success) {
        updateUser(response.user);

        setFormData({
          name: response.user.name || "",
          email: response.user.email || "",
          phone: response.user.phone || "",
          address: response.user.address || "",
          city: response.user.city || "",
        });

        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Navbar */}

      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between">
          <Link to="/dashboard" className="text-emerald-700 font-semibold">
            ← Dashboard
          </Link>

          <h1 className="font-bold text-xl">My Profile</h1>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow p-8">
          {/* Profile Header */}

          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-4xl">
              👤
            </div>

            <h2 className="text-2xl font-bold mt-4">{formData.name}</h2>

            <p className="text-gray-500">{formData.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}

            <div>
              <label className="block font-medium mb-2">Full Name</label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Email */}

            <div>
              <label className="block font-medium mb-2">Email</label>

              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full border rounded-lg px-4 py-3 bg-gray-100 text-gray-500"
              />

              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed.
              </p>
            </div>

            {/* Phone */}

            <div>
              <label className="block font-medium mb-2">Phone Number</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Address */}

            <div>
              <label className="block font-medium mb-2">Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter your address"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* City */}

            <div>
              <label className="block font-medium mb-2">City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Role */}

            <div>
              <label className="block font-medium mb-2">Account Type</label>

              <input
                type="text"
                value="Customer"
                disabled
                className="w-full border rounded-lg px-4 py-3 bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;
