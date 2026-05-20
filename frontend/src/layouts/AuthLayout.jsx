import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      {/* Sisi Kiri: Illustration Panel */}
      <div
        className="hidden lg:flex lg:w-[45%] h-full relative flex-col"
      >
        <img
          src="/assets/images/beach-auth.svg"
          alt="Beach illustration"
          className="absolute inset-0 w-full h-full object-cover object-left"
        />

        {/* Logo - Kasih z-20 supaya nimbul di atas gradient */}
        <div className="relative z-20 p-8">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-4 h-4 text-white"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              BINGO
            </span>
          </Link>
        </div>

        {/* Content - Kasih z-20 supaya nimbul di atas gradient */}
        <div className="relative z-20 mt-auto mb-16 p-8 space-y-4">
          <h2 className="text-white text-2xl font-bold leading-snug max-w-[320px]">
            Bersama Jaga Kebersihan Pantai Indonesia
          </h2>
          <p className="text-white text-sm leading-relaxed max-w-[300px] opacity-90">
            Gunakan AI untuk mengidentifikasi dan memilah sampah di pesisir
            pantai. Setiap scan adalah langkah kecil untuk perubahan besar.
          </p>
        </div>
      </div>

      {/* Sisi Kanan: Form */}
      <div className="w-full lg:w-[55%] h-full flex flex-col relative">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="w-4 h-4 text-black"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tighter text-black">
              BINGO
            </span>
          </Link>
          <Link
            to="/"
            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
          >
            Beranda
          </Link>
        </div>

        {/* Form Content - Centered */}
        <div className="flex-1 flex flex-col items-center px-6 md:px-12 overflow-y-auto py-12">
          <div className="w-full max-w-[420px] my-auto">{children}</div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 text-center">
          <p className="text-[11px] text-gray-300 font-medium">
            &copy; 2026 BinGo. Capstone Project DBS Foundation x Dicoding.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
