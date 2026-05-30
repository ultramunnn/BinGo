import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const SearchBar = ({ beaches, onSelect }) => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const filteredBeaches = useMemo(() => {
    if (!query.trim()) return beaches;
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return beaches.filter((b) => {
      const name = b.name.toLowerCase();
      return words.every((w) => name.includes(w));
    });
  }, [beaches, query]);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && beaches.length > 0) {
      setQuery(q);
      const match = beaches.find((b) =>
        b.name.toLowerCase().includes(q.toLowerCase())
      );
      if (match) onSelect(match);
    }
  }, [searchParams]);

  const handleSelect = useCallback((beach) => {
    onSelect(beach);
    setQuery("");
  }, [onSelect]);

  return (
    <div className="fixed top-18 left-1/2 -translate-x-1/2 z-1000 w-full max-w-md px-4">
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-500">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari pantai..."
          className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-400 shadow-lg transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
          >
            <svg className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
      {query.trim() && (
        <div className="mt-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 max-h-72 overflow-y-auto">
          {filteredBeaches.length > 0 ? (
            <>
              <div className="px-4 py-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                {filteredBeaches.length} pantai ditemukan
              </div>
              {filteredBeaches.slice(0, 15).map((beach) => (
                <button
                  key={beach.id}
                  onClick={() => handleSelect(beach)}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <svg className="w-3.5 h-3.5 text-red-500 shrink-0" viewBox="0 0 24 36" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" />
                  </svg>
                  <span className="truncate">{beach.name}</span>
                </button>
              ))}
              {filteredBeaches.length > 15 && (
                <div className="px-4 py-2 text-[10px] text-slate-400 text-center border-t border-slate-100">
                  +{filteredBeaches.length - 15} lagi — ketik lebih spesifik
                </div>
              )}
            </>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-slate-400">Pantai tidak ditemukan</p>
              <p className="text-[10px] text-slate-300 mt-1">Coba kata kunci lain</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchBar);
