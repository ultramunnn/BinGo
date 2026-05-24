import React, { useState } from "react";
import NavbarDashboard from "../components/NavbarDashboard";

const IconCamera = ({ className = "w-5 h-5" }) => (
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
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const IconEye = ({ className = "w-5 h-5" }) => (
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
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = ({ className = "w-5 h-5" }) => (
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
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const initialProfile = {
  avatar: "https://i.pravatar.cc/150?u=ruben",
  name: "Ruben George",
  email: "rubengeo@gmail.com",
};

const initialPassword = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const Settings = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [passwords, setPasswords] = useState(initialPassword);
  const [avatarPreview, setAvatarPreview] = useState(initialProfile.avatar);
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // TODO: hubungkan dengan API backend
    console.log("Simpan profil:", { ...profile, avatar: avatarPreview });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    // TODO: hubungkan dengan API backend
    console.log("Perbarui password:", passwords);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarDashboard />

      <main className="max-w-2xl mx-auto px-4 py-6 lg:py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Pengaturan Akun
        </h1>

        <form
          onSubmit={handleSaveProfile}
          className="bg-white p-6 rounded-2xl border border-slate-100 mb-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-5">
            Data Diri
          </h2>

          <div className="flex items-center gap-4 mb-6">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                <IconCamera className="w-4 h-4" />
                Ubah Foto
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-400 mt-1.5">
                JPG, PNG. Maks 2MB.
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Nama Lengkap
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-colors"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-colors"
              placeholder="Masukkan email"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>

        <form
          onSubmit={handleUpdatePassword}
          className="bg-white p-6 rounded-2xl border mb-6 border-slate-100"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-5">
            Keamanan
          </h2>

          <div className="mb-4">
            <label
              htmlFor="oldPassword"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Password Lama
            </label>
            <div className="relative">
              <input
                id="oldPassword"
                name="oldPassword"
                type={showPasswords.old ? "text" : "password"}
                value={passwords.oldPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2.5 pr-11 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-colors"
                placeholder="Masukkan password lama"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("old")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPasswords.old ? (
                  <IconEyeOff className="w-4.5 h-4.5" />
                ) : (
                  <IconEye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Password Baru
            </label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2.5 pr-11 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-colors"
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPasswords.new ? (
                  <IconEyeOff className="w-4.5 h-4.5" />
                ) : (
                  <IconEye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2.5 pr-11 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-colors"
                placeholder="Ketik ulang password baru"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPasswords.confirm ? (
                  <IconEyeOff className="w-4.5 h-4.5" />
                ) : (
                  <IconEye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Perbarui Password
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Settings;
