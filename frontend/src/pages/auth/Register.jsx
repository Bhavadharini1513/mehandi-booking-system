import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

import { registerUser } from "../../services/authService";

import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password confirmation
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        password: form.password,
        role: form.role,
      });

      toast.success("Registration successful! Please login.");

      navigate("/login");
    } catch (error) {
      console.error("REGISTER ERROR:", error.response?.data || error);

      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center text-green-600">
        Create Account
      </h1>

      <p className="text-center text-gray-500 mb-8">Join Maruthani World</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}

        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* Email */}

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        {/* Phone */}

        <Input
          label="Phone Number"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={form.phone}
          onChange={handleChange}
          required
        />

        {/* Address */}

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>

          <textarea
            name="address"
            placeholder="Enter your address"
            value={form.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* City */}

        <Input
          label="City"
          type="text"
          name="city"
          placeholder="Enter your city"
          value={form.city}
          onChange={handleChange}
          required
        />

        {/* Role */}

        <div>
          <label className="block text-sm font-medium mb-2">Register As</label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="customer">Customer</option>

            <option value="artist">Artist</option>
          </select>
        </div>

        {/* Password */}

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
        />

        {/* Confirm Password */}

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        {/* Submit */}

        <Button text="Create Account" loading={loading} />
      </form>

      {/* Login */}

      <p className="text-center mt-6 text-gray-600">
        Already have an account?
        <Link
          to="/login"
          className="text-green-600 ml-2 font-bold hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
