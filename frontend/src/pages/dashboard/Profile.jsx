import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

import { getProfile, updateProfile } from "../../services/authService";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

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

          updateUser(response.user);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-5">
          <Link to="/home" className="text-emerald-700 font-semibold">
            ← Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow p-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-4xl">
              {user?.role === "artist" ? "🌿" : "👤"}
            </div>

            <h2 className="text-2xl font-bold mt-4">{formData.name}</h2>

            <p className="text-gray-500">{formData.email}</p>

            <span className="inline-block mt-2 bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full capitalize">
              {user?.role}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label className="block font-medium mb-2">Phone Number</label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Address</label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">City</label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
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
