import React, { useState, useRef } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import { useAuth } from "../context/AuthContext";
import { updateProfile, uploadPhoto, changePassword } from "../services/authService";

const IconCamera = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
);

const Settings = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });

  const avatarUrl = avatarPreview || user?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || "U")}&background=4BAFBC&color=fff`;

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      setMessage({ type: "error", text: "Ukuran foto maksimal 1MB." });
      return;
    }
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Hanya file gambar yang diizinkan." });
      return;
    }

    setSelectedFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setMessage({ type: "", text: "" });
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setMessage({ type: "", text: "" });
    try {
      const data = await uploadPhoto(selectedFile);
      updateUser(data.user);
      setSelectedFile(null);
      setAvatarPreview(null);
      setMessage({ type: "success", text: "Foto profil berhasil diperbarui." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Gagal mengupload foto." });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ type: "error", text: "Nama lengkap wajib diisi." });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const data = await updateProfile({ fullName: fullName.trim() });
      updateUser(data.user);
      setMessage({ type: "success", text: "Profil berhasil diperbarui." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Gagal memperbarui profil." });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (!currentPassword) {
      setPasswordMessage({ type: "error", text: "Password saat ini wajib diisi." });
      return;
    }
    if (!newPassword) {
      setPasswordMessage({ type: "error", text: "Password baru wajib diisi." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "Password baru minimal 6 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordMessage({ type: "error", text: "Password baru harus berbeda dari password lama." });
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage({ type: "success", text: "Password berhasil diperbarui." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage({ type: "error", text: err.response?.data?.error || "Gagal memperbarui password." });
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarDashboard />

      <main className="max-w-2xl mx-auto px-4 py-6 lg:py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Pengaturan Akun</h1>

        {message.text && (
          <div
            onClick={() => setMessage({ type: "", text: "" })}
            className={`mb-6 px-4 py-3 rounded-xl text-sm cursor-pointer transition-colors ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                : "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Data Diri</h2>

          <div className="flex items-center gap-4 mb-6">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-100"
            />
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <IconCamera className="w-4 h-4" />
                  Ubah Foto
                </button>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleUploadPhoto}
                    disabled={uploading}
                    className="px-4 py-2 text-sm font-medium text-white bg-[#4BAFBC] hover:bg-[#3a9da9] rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {uploading ? "Mengupload..." : "Upload"}
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1.5">JPG, PNG. Maks 1MB.</p>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">
              Nama Lengkap
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-colors"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full px-4 py-2.5 text-sm text-slate-400 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed"
            />
            <p className="text-xs text-slate-400 mt-1">Email tidak dapat diubah.</p>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>

        <form onSubmit={handleUpdatePassword} className="bg-white mb-14 md:mb-2 p-6 rounded-2xl border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Ubah Password</h2>

          {passwordMessage.text && (
            <div
              onClick={() => setPasswordMessage({ type: "", text: "" })}
              className={`mb-5 px-4 py-3 rounded-xl text-sm cursor-pointer transition-colors ${
                passwordMessage.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-700 hover:bg-green-100"
                  : "bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
              }`}
            >
              {passwordMessage.text}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-colors"
                placeholder="Masukkan password saat ini"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((p) => ({ ...p, current: !p.current }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPasswords.current ? (
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                ) : (
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password Baru
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-colors"
                placeholder="Minimal 6 karakter"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPasswords.new ? (
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                ) : (
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-11 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:bg-white transition-colors"
                placeholder="Ketik ulang password baru"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPasswords.confirm ? (
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
                ) : (
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={changingPassword}
              className="px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
            >
              {changingPassword ? "Memperbarui..." : "Perbarui Password"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Settings;
