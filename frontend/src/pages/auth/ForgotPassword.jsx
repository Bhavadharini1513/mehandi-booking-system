import { Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";

function ForgotPassword() {
  return (
    <AuthLayout>
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

        <p className="text-gray-500 text-center mt-2 mb-6">
          Enter your email to reset your password.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-3 border rounded-xl mb-4 outline-none focus:border-rose-500"
        />

        <button
          type="button"
          className="w-full py-3 rounded-xl bg-rose-600 text-white font-semibold"
        >
          Send Reset Link
        </button>

        <div className="text-center mt-5">
          <Link to="/login" className="text-rose-600">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPassword;
