import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Link reset tidak valid atau tidak ditemukan.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengatur ulang kata sandi. Link mungkin sudah kedaluwarsa.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#333c4d] mb-2">Link Tidak Valid</h1>
          <p className="text-sm text-gray-400 mb-8">Link reset tidak ditemukan atau sudah kedaluwarsa.</p>
          <Link
            to="/forgot-password"
            className="inline-block bg-[#3d4a5d] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2f3948] transition-all"
          >
            Minta Link Baru
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#333c4d] mb-2">Berhasil!</h1>
          <p className="text-sm text-gray-400 mb-8">Kata sandi Anda telah berhasil diubah. Silakan login dengan kata sandi baru.</p>
          <Link
            to="/login"
            className="inline-block bg-[#3d4a5d] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2f3948] transition-all"
          >
            Ke Halaman Login
          </Link>
        </div>
      </AuthLayout>
    );
  }

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
          Atur Ulang Kata Sandi
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          Buat kata sandi baru yang kuat untuk akun Anda.
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
        <div className="relative">
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Kata Sandi Baru
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
            minLength={6}
            className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC] transition-all text-gray-700 bg-white placeholder:text-gray-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 bottom-[14px] text-gray-300 hover:text-gray-400"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.301 8.844 6.88 6 12 6c5.12 0 8.699 2.844 9.964 5.678.045.092.045.203 0 .296C20.699 15.156 17.12 18 12 18c-5.12 0-8.699-2.844-9.964-5.678z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>

        <div className="relative">
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi baru"
            required
            className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC] transition-all text-gray-700 bg-white placeholder:text-gray-200"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 bottom-[14px] text-gray-300 hover:text-gray-400"
          >
            {showConfirm ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.301 8.844 6.88 6 12 6c5.12 0 8.699 2.844 9.964 5.678.045.092.045.203 0 .296C20.699 15.156 17.12 18 12 18c-5.12 0-8.699-2.844-9.964-5.678z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3d4a5d] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-[#2f3948] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Menyimpan..." : "Simpan Kata Sandi Baru"}
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

export default ResetPassword;
