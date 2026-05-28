import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { forgotPassword } from "../../services/authService";

const CheckEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResent(false);
    try {
      await forgotPassword(email);
      setResent(true);
    } catch {
      // silent — same as backend security pattern
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout>
      {/* Back to Home */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors group mb-8"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
        Kembali ke Beranda
      </Link>

      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-green-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#333c4d] mb-2">
          Cek Email Anda
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Kami telah mengirimkan link reset kata sandi ke{" "}
          {email ? (
            <strong className="text-gray-500">{email}</strong>
          ) : (
            "email Anda"
          )}
          . Silakan cek inbox atau folder spam.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <button
          onClick={handleResend}
          disabled={resending || !email}
          className="w-full bg-white text-gray-500 py-4 rounded-xl font-bold text-sm border border-gray-200 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
        >
          {resending ? "Mengirim..." : "Kirim Ulang Email"}
        </button>

        {resent && (
          <p className="text-center text-sm text-green-600">
            Email reset telah dikirim ulang!
          </p>
        )}
      </div>

      {/* Back to Login */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-400">
          Ingat kata sandi?{" "}
          <Link
            to="/login"
            className="font-bold text-[#4BAFBC] hover:text-[#3a9da9] transition-colors"
          >
            Kembali ke Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default CheckEmail;
