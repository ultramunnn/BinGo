import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      navigate("/check-email", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengirim email reset");
    } finally {
      setLoading(false);
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
        <div className="w-16 h-16 rounded-2xl bg-[#4BAFBC]/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-[#4BAFBC]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#333c4d] mb-2">
          Lupa Kata Sandi?
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Jangan khawatir! Masukkan email yang terdaftar dan kami akan
          mengirimkan link untuk mengatur ulang kata sandi Anda.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Alamat Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh@email.com"
            required
            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC] transition-all text-gray-700 bg-white placeholder:text-gray-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-[#3d4a5d] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-[#2f3948] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Mengirim..." : "Kirim Link Reset"}
        </button>
      </form>

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

export default ForgotPassword;
