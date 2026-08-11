
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

import { registerUser } from "../../services/authService";

function Register() {
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Registration successful
      alert(response.data.message || "Registration successful!");

      // Navigate to Login page
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center text-green-600">
        Maruthani World
      </h1>

      <p className="text-center text-gray-500 mt-2 mb-8">
        Create your account
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          value={form.name}
          onChange={handleChange}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter password"
          value={form.password}
          onChange={handleChange}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          placeholder="Confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <Button text="Create Account" loading={loading} />
      </form>

      <p className="text-center text-gray-600 mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-green-600 font-semibold hover:text-pink-700 hover:underline"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;

