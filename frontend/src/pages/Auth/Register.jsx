import React, { useState } from "react";
<<<<<<< HEAD
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
=======
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { register } from "../../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi tidak cocok.");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter.");
      return;
    }
    if (!agreed) {
      setError("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)

  return (
    <AuthLayout>
      {/* Back to Home */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors group mb-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Kembali ke Beranda
      </Link>

      {/* Header */}
      <div className="mb-8">
<<<<<<< HEAD
        <h1 className="text-3xl font-bold text-[#333c4d] mb-2">Masuk</h1>
        <p className="text-sm text-gray-400">
          Selamat datang kembali! Silakan masuk ke akun Anda.
        </p>
      </div>

      {/* Form Section */}
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
=======
        <h1 className="text-3xl font-bold text-[#333c4d] mb-2">Daftar</h1>
        <p className="text-sm text-gray-400">
          Buat akun baru untuk mulai menggunakan BinGo.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Form Section */}
      <form className="space-y-5" onSubmit={handleSubmit}>
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Nama Lengkap
          </label>
          <input
            type="text"
<<<<<<< HEAD
            placeholder="John Doe"
=======
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            required
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC] transition-all text-gray-700 bg-white placeholder:text-gray-200"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Alamat Email
          </label>
          <input
            type="email"
<<<<<<< HEAD
            placeholder="contoh@email.com"
=======
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contoh@email.com"
            required
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC] transition-all text-gray-700 bg-white placeholder:text-gray-200"
          />
        </div>

        <div className="relative">
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Kata Sandi
          </label>
          <input
            type={showPassword ? "text" : "password"}
<<<<<<< HEAD
            placeholder="Minimal 8 karakter"
=======
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            required
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC] transition-all text-gray-700 bg-white placeholder:text-gray-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 bottom-[14px] text-gray-300 hover:text-gray-400"
          >
<<<<<<< HEAD
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.644C3.301 8.844 6.88 6 12 6c5.12 0 8.699 2.844 9.964 5.678.045.092.045.203 0 .296C20.699 15.156 17.12 18 12 18c-5.12 0-8.699-2.844-9.964-5.678z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
=======
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.301 8.844 6.88 6 12 6c5.12 0 8.699 2.844 9.964 5.678.045.092.045.203 0 .296C20.699 15.156 17.12 18 12 18c-5.12 0-8.699-2.844-9.964-5.678z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            </svg>
          </button>
        </div>

        <div className="relative">
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Konfirmasi Kata Sandi
          </label>
          <input
            type={showConfirm ? "text" : "password"}
<<<<<<< HEAD
            placeholder="Ulangi kata sandi"
=======
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi kata sandi"
            required
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC] transition-all text-gray-700 bg-white placeholder:text-gray-200"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 bottom-[14px] text-gray-300 hover:text-gray-400"
          >
<<<<<<< HEAD
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.644C3.301 8.844 6.88 6 12 6c5.12 0 8.699 2.844 9.964 5.678.045.092.045.203 0 .296C20.699 15.156 17.12 18 12 18c-5.12 0-8.699-2.844-9.964-5.678z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
=======
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.301 8.844 6.88 6 12 6c5.12 0 8.699 2.844 9.964 5.678.045.092.045.203 0 .296C20.699 15.156 17.12 18 12 18c-5.12 0-8.699-2.844-9.964-5.678z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            </svg>
          </button>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
            className="w-4 h-4 rounded border-gray-300 text-[#4BAFBC] focus:ring-[#4BAFBC]"
          />
          <p className="text-[12px] text-gray-400">
            Saya setuju dengan{" "}
            <Link to="/terms" className="text-[#4BAFBC] font-bold hover:underline">
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link to="/privacy" className="text-[#4BAFBC] font-bold hover:underline">
              Kebijakan Privasi
            </Link>
          </p>
        </div>

        {/* Button */}
<<<<<<< HEAD
        <button className="w-full bg-[#3d4a5d] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-[#2f3948] transition-all">
          Buat Akun
        </button>
      </form>

      {/* Social Login */}
      <div className="relative my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
          <span className="bg-white px-4">Atau daftar dengan</span>
        </div>
      </div>

      <div className="flex gap-4">
        <button className="flex-1 flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-600 text-sm">
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt="G"
          />
          Google
        </button>
        <button className="flex-1 flex items-center justify-center gap-3 py-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all font-bold text-gray-600 text-sm">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
            className="w-5 h-5"
            alt="M"
          />
          Microsoft
        </button>
=======
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3d4a5d] text-white py-4 rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-[#2f3948] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Membuat Akun..." : "Buat Akun"}
        </button>
      </form>

      {/* Login Link */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-400">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-bold text-[#4BAFBC] hover:text-[#3a9da9] transition-colors">
            Masuk
          </Link>
        </p>
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
      </div>
    </AuthLayout>
  );
};

export default Register;
