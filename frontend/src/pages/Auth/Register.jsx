import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors = {};
    if (!fullName.trim()) errors.fullName = "Nama lengkap wajib diisi.";
    if (!email.trim()) errors.email = "Email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Format email tidak valid.";
    if (!password) errors.password = "Kata sandi wajib diisi.";
    else if (password.length < 6) errors.password = "Kata sandi minimal 6 karakter.";
    if (!confirmPassword) errors.confirmPassword = "Konfirmasi kata sandi wajib diisi.";
    else if (password !== confirmPassword) errors.confirmPassword = "Kata sandi dan konfirmasi tidak cocok.";
    if (!agreed) errors.agreed = "Anda harus menyetujui Syarat & Ketentuan.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const data = await register(email, password, fullName);
      if (data && data.requiresVerification) {
        navigate("/check-email", { state: { email, type: "verification" } });
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registrasi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
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

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#333c4d] mb-2">Daftar</h1>
        <p className="text-sm text-gray-400">
          Buat akun baru untuk mulai menjelajah.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div
            onClick={() => setError("")}
            className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 cursor-pointer hover:bg-red-100 transition-colors"
          >
            {error}
          </div>
        )}

        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Nama Lengkap
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setFieldErrors((prev) => ({ ...prev, fullName: "" })); }}
              placeholder="Nama lengkap Anda"
              autoComplete="name"
              className={`w-full pl-10 pr-5 py-3.5 rounded-xl border ${fieldErrors.fullName ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-100 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC]"} focus:outline-none focus:ring-2 transition-all text-sm text-gray-700 bg-white placeholder:text-gray-300`}
            />
            {fieldErrors.fullName && <p className="text-xs text-red-500 mt-1 ml-1">{fieldErrors.fullName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Alamat Email
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
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
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((prev) => ({ ...prev, email: "" })); }}
              placeholder="contoh@email.com"
              autoComplete="email"
              className={`w-full pl-10 pr-5 py-3.5 rounded-xl border ${fieldErrors.email ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-100 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC]"} focus:outline-none focus:ring-2 transition-all text-sm text-gray-700 bg-white placeholder:text-gray-300`}
            />
            {fieldErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">{fieldErrors.email}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
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
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, password: "" })); }}
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              className={`w-full pl-10 pr-12 py-3.5 rounded-xl border ${fieldErrors.password ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-100 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC]"} focus:outline-none focus:ring-2 transition-all text-sm text-gray-700 bg-white placeholder:text-gray-300`}
            />
            {fieldErrors.password && <p className="text-xs text-red-500 mt-1 ml-1">{fieldErrors.password}</p>}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                {showPassword ? (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-[0.1em]">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
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
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((prev) => ({ ...prev, confirmPassword: "" })); }}
              placeholder="Ulangi kata sandi"
              autoComplete="new-password"
              className={`w-full pl-10 pr-12 py-3.5 rounded-xl border ${fieldErrors.confirmPassword ? "border-red-400 focus:ring-red-200 focus:border-red-400" : "border-gray-100 focus:ring-[#4BAFBC]/10 focus:border-[#4BAFBC]"} focus:outline-none focus:ring-2 transition-all text-sm text-gray-700 bg-white placeholder:text-gray-300`}
            />
            {fieldErrors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{fieldErrors.confirmPassword}</p>}
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                {showConfirm ? (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-3 py-1">
          <input
            type="checkbox"
            checked={agreed}
            onChange={() => { setAgreed(!agreed); setFieldErrors((prev) => ({ ...prev, agreed: "" })); }}
            className="w-4 h-4 rounded border-gray-300 text-[#4BAFBC] focus:ring-[#4BAFBC] mt-0.5"
          />
          <div>
          <p className="text-[12px] text-gray-400 leading-relaxed">
            Saya setuju dengan{" "}
            <Link
              to="/terms"
              className="text-[#4BAFBC] font-bold hover:underline"
            >
              Syarat & Ketentuan
            </Link>{" "}
            dan{" "}
            <Link
              to="/privacy"
              className="text-[#4BAFBC] font-bold hover:underline"
            >
              Kebijakan Privasi
            </Link>
          </p>
          {fieldErrors.agreed && <p className="text-xs text-red-500 mt-1">{fieldErrors.agreed}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3d4a5d] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-[#2f3948] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
        >
          {loading ? "Mendaftar..." : "Buat Akun"}
        </button>
      </form>

      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
          <span className="bg-white px-4">Atau daftar dengan</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all text-sm font-medium text-gray-600">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Daftar dengan Google
        </button>
      </div>

      <p className="mt-8 text-center text-[13px] text-gray-400">
        Sudah punya akun?{" "}
        <Link
          to="/login"
          className="font-bold text-[#4BAFBC] hover:underline transition-all"
        >
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
