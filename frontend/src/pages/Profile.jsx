import React from "react";
import { useNavigate } from "react-router-dom";
import NavbarDashboard from "../components/NavbarDashboard";

const IconScan = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
);

const IconTrash = ({ className = "w-6 h-6" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconEdit = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const user = {
  name: "Ruben George",
  email: "rubengeo@gmail.com",
  avatar: "https://i.pravatar.cc/150?u=ruben",
  totalScans: 8,
  topMaterial: "Plastik",
};

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarDashboard />

      <main className="max-w-3xl mx-auto px-4 py-6 lg:py-10">
        <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs relative">
          <button
            onClick={() => navigate("/settings")}
            className="absolute top-4 right-4 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm px-2 py-2 md:px-4 md:py-2 rounded-xl transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <IconEdit className="w-4 h-4" />
              Edit Profile
            </span>
          </button>

          <div className="flex flex-col items-center pt-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-slate-100 shadow-sm"
            />
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              {user.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Dampak Hijau Kamu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                <IconScan className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 leading-none">
                  {user.totalScans}
                </p>
                <p className="text-sm text-slate-500 mt-1">Kali Scan</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <IconTrash className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 leading-none">
                  {user.topMaterial}
                </p>
                <p className="text-sm text-slate-500 mt-1">Sampah Terbanyak</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
