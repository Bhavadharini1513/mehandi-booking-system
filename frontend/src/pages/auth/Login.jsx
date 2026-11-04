import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

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
  const location = useLocation();

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

  const fillCredentials = (email, password, roleLabel) => {
    setForm({ email, password });
    toast.success(`${roleLabel} demo credentials filled!`, {
      icon: "✨",
      style: {
        borderRadius: "12px",
        background: "#0F2C23",
        color: "#FDFBF7",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser(form);

      if (!res?.token) {
        toast.error("Token not received");
        return;
      }

      if (!res?.user) {
        toast.error("User information not received");
        return;
      }

      login(res.user, res.token);

      toast.success("Login Successful");

      if (res.user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      const redirect = new URLSearchParams(location.search).get("redirect");

      if (redirect && redirect.startsWith("/")) {
        navigate(redirect, { replace: true });
        return;
      }

      if (res.user.role === "artist") {
        navigate("/artist/dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-3 tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          MARUTHANI WORLD SECURE PORTAL
        </span>
        <h1 className="text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Access your royal luxury henné dashboard
        </p>
      </div>

      {/* Quick Demo Credentials Pill Bar */}
      <div className="mb-6 p-3 rounded-2xl bg-stone-50 border border-stone-200/80">
        <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-2 text-center">
          1-Click Quick Demo Login
        </p>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() =>
              fillCredentials("admin@mehandi.com", "Admin@123", "Admin")
            }
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:border-amber-500 hover:text-amber-700 hover:shadow-xs transition-all cursor-pointer"
          >
            👑 Admin
          </button>
          <button
            type="button"
            onClick={() =>
              fillCredentials(
                "priya.bridal@mehandi.com",
                "Password@123",
                "Master Artist",
              )
            }
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:border-emerald-500 hover:text-emerald-700 hover:shadow-xs transition-all cursor-pointer"
          >
            🎨 Artist
          </button>
          <button
            type="button"
            onClick={() =>
              fillCredentials(
                "meera.client@mehandi.com",
                "Password@123",
                "Client",
              )
            }
            className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold bg-white border border-stone-200 text-stone-700 hover:border-blue-500 hover:text-blue-700 hover:shadow-xs transition-all cursor-pointer"
          >
            🛍️ Client
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="admin@mehandi.com"
          value={form.email}
          onChange={handleChange}
        />

        <div>
          <PasswordInput
            label="Password"
            name="password"
            placeholder="Admin@123"
            value={form.password}
            onChange={handleChange}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-stone-400">
              Admin: <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-600 font-mono">Admin@123</code>
            </span>
            <Link
              to="/forgot-password"
              className="text-xs text-emerald-800 font-semibold hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Button text="Sign In to Platform" loading={loading} />
        </div>
      </form>

      <p className="text-center text-sm text-stone-500 mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-emerald-800 font-bold hover:underline"
        >
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
