import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/common/Input";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import { loginUser } from "../../services/authService";

import toast from "react-hot-toast";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser(form);

      

      if (!res.token) {
        toast.error("Token not received");
        return;
      }

      login(res.user, res.token);

      toast.success("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);

      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center text-green-600">
        Welcome Back
      </h1>

      <p className="text-center mb-8">Login to continue</p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter Email"
          value={form.email}
          onChange={handleChange}
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
        />

        <Button text="Login" loading={loading} />
      </form>

      <p className="text-center mt-6">
        Don't have an account?
        <Link to="/register" className="text-green-600 ml-2 font-bold">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
