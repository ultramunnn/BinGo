import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

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
        <h1 className="text-3xl font-bold text-[#333c4d] mb-2">Masuk</h1>
        <p className="text-sm text-gray-400">
          Selamat datang kembali! Silakan masuk ke akun Anda.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">
            Email atau Nomor Telepon
          </label>
          <input
            type="text"
            placeholder="contoh@email.com"
            className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BAFBC]/20 focus:border-[#4BAFBC] transition-all text-gray-700 bg-white placeholder:text-gray-300"
          />
        </div>

        <div className="relative">
          <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">
            Kata Sandi
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Masukkan kata sandi"
            className="w-full px-5 py-3 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4BAFBC]/20 focus:border-[#4BAFBC] transition-all text-gray-700 bg-white placeholder:text-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-9.5 text-gray-300 hover:text-gray-500 transition-colors"
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

        {/* Forgot Password */}
        <div className="flex justify-end">
          <a href="#" className="text-xs font-medium text-[#4BAFBC] hover:text-[#3a9da9] transition-colors">
            Lupa kata sandi?
          </a>
        </div>

        {/* Submit Button */}
        <button className="w-full bg-[#333c4d] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#28303f] active:scale-[0.98] transition-all shadow-sm">
          Masuk
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-7">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-100"></div>
        </div>
        <div className="relative flex justify-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">
          <span className="bg-white px-4">Atau masuk dengan</span>
        </div>
      </div>

      {/* Social Login */}
      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all text-sm font-medium text-gray-600">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>
        <button className="flex-1 flex items-center justify-center gap-2.5 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all text-sm font-medium text-gray-600">
          <svg className="w-5 h-5" viewBox="0 0 23 23">
            <path d="M11 0H0v11h11V0z" fill="#F25022"/>
            <path d="M23 0H12v11h11V0z" fill="#7FBA00"/>
            <path d="M11 12H0v11h11V12z" fill="#00A4EF"/>
            <path d="M23 12H12v11h11V12z" fill="#FFB900"/>
          </svg>
          Microsoft
        </button>
      </div>

      {/* Register Link */}
      <div className="text-center mt-8 space-y-3">
        <p className="text-sm text-gray-400">
          Belum punya akun?{' '}
          <Link to="/register" className="font-bold text-[#4BAFBC] hover:text-[#3a9da9] transition-colors">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
