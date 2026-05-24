import { FileSearch, RefreshCw } from "lucide-react";

export function EmptyState({ message = "Belum ada artikel untuk kategori ini." }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
        <FileSearch className="w-8 h-8 text-slate-300" />
      </div>
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-red-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}
