import React, { useState, useEffect, useCallback } from "react";

let addToastFn = null;

export const toast = {
  error: (msg) => addToastFn?.({ type: "error", message: msg }),
  success: (msg) => addToastFn?.({ type: "success", message: msg }),
  warning: (msg) => addToastFn?.({ type: "warning", message: msg }),
};

const ICONS = {
  error: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
    </svg>
  ),
  success: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" />
    </svg>
  ),
};

const STYLES = {
  error: "bg-red-50 border-red-200 text-red-700",
  success: "bg-emerald-50 border-emerald-200 text-emerald-700",
  warning: "bg-amber-50 border-amber-200 text-amber-700",
};

const ICON_COLORS = {
  error: "text-red-500",
  success: "text-emerald-500",
  warning: "text-amber-500",
};

const ToastItem = ({ toast: t, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(t.id), 3500);
    return () => clearTimeout(timer);
  }, [t.id, onRemove]);

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-fade-in ${STYLES[t.type]}`}
      style={{ animation: "fade-in 0.25s ease-out" }}
    >
      <span className={ICON_COLORS[t.type]}>{ICONS[t.type]}</span>
      <p className="text-xs font-semibold flex-1">{t.message}</p>
      <button
        onClick={() => onRemove(t.id)}
        className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    addToastFn = ({ type, message }) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);
    };
    return () => { addToastFn = null; };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-2 w-full max-w-sm px-4">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
