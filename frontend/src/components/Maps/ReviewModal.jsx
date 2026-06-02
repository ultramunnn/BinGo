import React, { useState, useRef } from "react";
import { toast } from "../Toast";

const ReviewModal = ({ open, onClose, beachName, onSubmit, user }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const MAX_SIZE = 1 * 1024 * 1024; // 1MB
  const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Format gambar tidak didukung. Gunakan JPG, JPEG, atau PNG.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error(`Ukuran gambar terlalu besar (${(file.size / 1024 / 1024).toFixed(2)}MB). Maksimal 1MB.`);
      e.target.value = "";
      return;
    }

    if (image) URL.revokeObjectURL(image.url);
    setImage({ file, url: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const removeImage = () => {
    if (image) URL.revokeObjectURL(image.url);
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!rating || !text.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ rating, message: text.trim(), image: image?.file });
      setRating(0);
      setText("");
      removeImage();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Gagal mengirim ulasan";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">{beachName}</h3>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
          <div className="flex items-center gap-3">
            {user?.photo_url ? (
              <img
                src={user.photo_url}
                alt={user.full_name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm shrink-0">
                {(user?.full_name || "??").trim().split(/\s+/).length >= 2
                  ? ((user.full_name.trim().split(/\s+/)[0][0] + user.full_name.trim().split(/\s+/)[1][0]).toUpperCase())
                  : (user?.full_name || "??").slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-slate-800">{user?.full_name || "Anonim"}</p>
              <p className="text-[10px] text-slate-400">Ulasan publik</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}
                className="cursor-pointer p-0.5 transition-transform hover:scale-110"
              >
                <svg
                  className="w-8 h-8 transition-colors"
                  fill={(hover || rating) >= i ? "#f59e0b" : "#e2e8f0"}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bagikan pengalaman Anda tentang tempat ini..."
            rows={4}
            className="w-full resize-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-400 transition-colors"
          />

          {image && (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
              <img src={image.url} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />
            </svg>
            Tambahkan foto
          </button>
        </div>

        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rating || !text.trim() || submitting}
            className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {submitting ? "Mengirim..." : "Posting"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
