import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../components/layouts/AuthLayout";
import PasswordInput from "../../components/common/PasswordInput";
import Button from "../../components/common/Button";

import { resetPassword } from "../../services/authService";
import { passwordRules } from "../../utils/validation";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordRules.pattern.value.test(form.password)) {
      toast.error(passwordRules.pattern.message);
      return;
    }

    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await resetPassword(token, form.password);

      toast.success("Password changed. Please log in.");

      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center text-green-600">
        Choose a New Password
      </h1>

      <p className="text-center mb-8 text-gray-600">
        Use at least 8 characters with upper-case, lower-case, a number and a
        special character.
      </p>

      <form onSubmit={handleSubmit}>
        <PasswordInput
          label="New Password"
          name="password"
          placeholder="Enter new password"
          value={form.password}
          onChange={handleChange}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirm"
          placeholder="Re-enter new password"
          value={form.confirm}
          onChange={handleChange}
        />

        <Button text="Reset Password" loading={loading} />
      </form>

      <p className="text-center mt-6">
        <Link to="/login" className="text-green-600 font-bold">
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ResetPassword;
