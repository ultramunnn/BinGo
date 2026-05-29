import React from "react";
import { Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden font-sans">
      <div className="hidden lg:flex lg:w-1/2 h-full relative">
        <img
          src="/assets/images/Beach-Auth.png"
          alt="Beach illustration"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 z-1" />\
        <div className="relative z-20 flex flex-col justify-between h-full px-10 py-8">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <img
              src="/assets/images/logo-white.svg"
              alt="BinGo Logo"
              className="h-9 w-auto"
            />
          </Link>

          <div className="space-y-3 mb-4">
            <h2 className="text-white text-3xl font-bold leading-snug">
              Bersama Jaga Kebersihan Pantai Indonesia
            </h2>
            <p className="text-white/85 text-base leading-relaxed max-w-sm">
              Gunakan AI untuk mengidentifikasi dan memilah sampah di pesisir
              pantai. Setiap scan adalah langkah kecil untuk perubahan besar.
            </p>
          </div>
        </div>
        <svg
          className="absolute top-0 -right-1 h-full w-32 z-10 fill-white"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path d="M0 0 C 50 0, 50 100, 100 100 L 100 0 Z" />
        </svg>
      </div>

      <div className="w-full lg:w-1/2 h-full flex flex-col relative">
        <div className="lg:hidden flex items-center ml-8 justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <img
              src="/assets/images/logo-black.svg"
              alt="BinGo Logo"
              className="h-9 w-auto"
            />
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center px-6 md:px-12 overflow-y-auto py-12">
          <div className="w-full max-w-[420px] my-auto">{children}</div>
        </div>

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
