import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { forgotPassword, resendVerificationEmail } from "../../services/authService";

const CheckEmail = () => {
  const location = useLocation();
  const email = location.state?.email || "";
  const type = location.state?.type || "reset"; // "reset" or "verification"
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    setResent(false);
    try {
      if (type === "verification") {
        await resendVerificationEmail(email);
      } else {
        await forgotPassword(email);
      }
      setResent(true);
    } catch {
    } finally {
      setResending(false);
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

      <div className="flex justify-center mb-6">
        <div className=" flex items-center justify-center">
          <svg
            className="w-30 h-30"
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
          >
            <style>{`.cls-1{fill:#f57c00;}.cls-2{fill:#999;}.cls-3{fill:#666;}`}</style>
            <g data-name="outline color" id="outline_color">
              <path className="cls-1" d="M59,60H23a1,1,0,0,1-1-1V35a1,1,0,0,1,1-1H59a1,1,0,0,1,1,1V59A1,1,0,0,1,59,60ZM24,58H58V36H24Z" />
              <path className="cls-1" d="M41,51a1,1,0,0,1-.52-.15l-18-11a1,1,0,1,1,1-1.7L41,48.83,58.48,38.15a1,1,0,1,1,1,1.7l-18,11A1,1,0,0,1,41,51Z" />
              <path className="cls-2" d="M19,54.08a1,1,0,0,1-.67-.26,4.88,4.88,0,0,1-1.22-1.68L4.46,23.84A5,5,0,0,1,7,17.23L28.19,7.75A1,1,0,0,1,29,9.57L7.8,19.05a3,3,0,0,0-1.52,4l12.65,28.3a3.15,3.15,0,0,0,.74,1A1,1,0,0,1,19,54.08Z" />
              <path className="cls-3" d="M19,33.23a.94.94,0,0,1-.63-.23,8.87,8.87,0,0,1-2.54-3.31A9,9,0,0,1,25.12,17.1a1,1,0,0,1-.24,2,7,7,0,0,0-5.25,12.38A1,1,0,0,1,19,33.23Z" />
              <path className="cls-2" d="M54.33,32a.92.92,0,0,1-.36-.07,1,1,0,0,1-.57-1.29l4.41-11.53a3,3,0,0,0-1.73-3.86L33.65,6.67a3,3,0,0,0-2.3.07A3,3,0,0,0,29.77,8.4l-3.84,10L21,31.36a1,1,0,1,1-1.86-.72l8.77-23a5,5,0,0,1,6.46-2.87l22.42,8.57a5,5,0,0,1,2.89,6.44L55.26,31.36A1,1,0,0,1,54.33,32Z" />
              <path className="cls-3" d="M37.15,30.48a1.15,1.15,0,0,1-.36-.07A9,9,0,1,1,48.43,18.85a1,1,0,0,1-.58,1.29,1,1,0,0,1-1.29-.58,7,7,0,1,0-9.06,9,1,1,0,0,1-.35,1.94Z" />
              <path className="cls-3" d="M40,25a2.86,2.86,0,0,1-1.07-.2,3,3,0,0,1-1.67-1.57A3,3,0,1,1,40,25Zm0-4a1,1,0,0,0-.93.65,1,1,0,0,0,0,.76,1,1,0,0,0,.56.53,1,1,0,1,0,.71-1.87A.92.92,0,0,0,40,21Z" />
              <path className="cls-3" d="M42.66,29.23a2.95,2.95,0,0,1-2.73-1.79,2.91,2.91,0,0,1-.06-2.28l1.78-4.67a1,1,0,1,1,1.87.72l-1.79,4.67a1,1,0,0,0,1.35,1.26,1,1,0,0,0,.52-.55l3-7.74a1,1,0,0,1,1.87.71l-3,7.74A3,3,0,0,1,43.89,29,2.92,2.92,0,0,1,42.66,29.23Z" />
            </g>
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#333c4d] mb-2">
          {type === "verification" ? "Verifikasi Email Anda" : "Cek Email Anda"}
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          {type === "verification"
            ? "Kami telah mengirimkan link verifikasi email ke "
            : "Kami telah mengirimkan link reset kata sandi ke "}
          {email ? (
            <strong className="text-gray-500">{email}</strong>
          ) : (
            "email Anda"
          )}
          . Silakan cek inbox atau folder spam.
        </p>
      </div>

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
            {type === "verification"
              ? "Email verifikasi telah dikirim ulang!"
              : "Email reset telah dikirim ulang!"}
          </p>
        )}
      </div>

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
