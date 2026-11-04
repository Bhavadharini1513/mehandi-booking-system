import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email.trim());

      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="text-5xl mb-4">📧</div>

          <h1 className="text-2xl font-bold text-green-700">Check your email</h1>

          <p className="text-gray-600 mt-3">
            If an account exists for <strong>{email}</strong>, we have sent a
            link to reset your password. The link is valid for 15 minutes.
          </p>

          <Link
            to="/login"
            className="inline-block mt-8 text-green-600 font-bold"
          >
            ← Back to Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h1 className="text-3xl font-bold text-center text-green-600">
        Forgot Password
      </h1>

      <p className="text-center mb-8 text-gray-600">
        Enter your email and we will send you a reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button text="Send Reset Link" loading={loading} />
      </form>

      <p className="text-center mt-6">
        <Link to="/login" className="text-green-600 font-bold">
          Back to Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPassword;
