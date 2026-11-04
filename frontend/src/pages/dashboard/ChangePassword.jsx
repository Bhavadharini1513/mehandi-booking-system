import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { changePassword } from "../../services/authService";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const passwordValid =
    formData.newPassword.length >= 8 &&
    /[A-Z]/.test(formData.newPassword) &&
    /[a-z]/.test(formData.newPassword) &&
    /[0-9]/.test(formData.newPassword) &&
    /[@$!%*?&]/.test(formData.newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      toast.error("Enter your current password");
      return;
    }

    if (!passwordValid) {
      toast.error("New password does not meet the requirements");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.success) {
        toast.success("Password changed successfully");

        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f3]">
      {/* Header */}

      <nav className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link to="/dashboard" className="text-emerald-700 font-semibold">
            ← Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow p-8">
          <div className="text-center mb-8">
            <div className="text-5xl">🔐</div>

            <h1 className="text-3xl font-bold mt-4">Change Password</h1>

            <p className="text-gray-500 mt-2">
              Keep your Maruthani World account secure.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Current Password */}

            <div>
              <label className="block font-medium mb-2">Current Password</label>

              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Enter current password"
              />
            </div>

            {/* New Password */}

            <div>
              <label className="block font-medium mb-2">New Password</label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 pr-20 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Enter new password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sm text-emerald-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Password Requirements */}

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium mb-3">Password must contain:</p>

              <Requirement
                valid={formData.newPassword.length >= 8}
                text="At least 8 characters"
              />

              <Requirement
                valid={/[A-Z]/.test(formData.newPassword)}
                text="One uppercase letter"
              />

              <Requirement
                valid={/[a-z]/.test(formData.newPassword)}
                text="One lowercase letter"
              />

              <Requirement
                valid={/[0-9]/.test(formData.newPassword)}
                text="One number"
              />

              <Requirement
                valid={/[@$!%*?&]/.test(formData.newPassword)}
                text="One special character"
              />
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block font-medium mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Confirm new password"
              />

              {formData.confirmPassword && (
                <p
                  className={`text-sm mt-2 ${
                    formData.newPassword === formData.confirmPassword
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {formData.newPassword === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "✕ Passwords do not match"}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold hover:bg-emerald-800 disabled:opacity-50"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

/* =========================
   PASSWORD REQUIREMENT
========================= */

const Requirement = ({ valid, text }) => {
  return (
    <div
      className={`flex items-center gap-2 text-sm mb-2 ${
        valid ? "text-green-600" : "text-gray-500"
      }`}
    >
      <span>{valid ? "✓" : "○"}</span>

      <span>{text}</span>
    </div>
  );
};

export default ChangePassword;
