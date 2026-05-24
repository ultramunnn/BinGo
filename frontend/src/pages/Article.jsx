import { useState, useEffect, useMemo } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import {
  ArticleCard,
  LoadingSkeleton,
  EmptyState,
  ErrorState,
} from "../components/article";
import { getCategoryFilters } from "../constants/wikipediaTopics";
import { useWikipediaArticles } from "../hooks/useWikipediaArticles";

const filters = getCategoryFilters();

const IconBottle = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M10 2h4v3.5l2 2V22H8V7.5l2-2V2z" />
    <path d="M8 12h8" />
  </svg>
);

const IconCan = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <rect x="6" y="4" width="12" height="16" rx="2" />
    <path d="M6 8h12M6 12h12M6 16h12" />
    <path d="M10 4V2m4 2V2" />
  </svg>
);

const IconGlass = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M8 2l1 8c0 2.21 1.79 4 4 4s4-1.79 4-4l1-8H8z" />
    <path d="M6 2h12" />
    <path d="M9 14v8h6v-8" />
  </svg>
);

const IconSachet = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M7 3h10l1 4v14a1 1 0 01-1 1H7a1 1 0 01-1-1V7l1-4z" />
    <path d="M6 7h12" />
    <path d="M9 3l-1 4m7-4l1 4" />
    <path d="M10 12h4m-4 3h4" />
  </svg>
);

const IconArrowRight = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M5 12h14m-4-4l4 4-4 4" />
  </svg>
);

const IconScan = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-6 h-6"
  >
    <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
    <path d="M7 12h10" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

const IconCheck = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const IconX = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-4 h-4"
  >
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const WasteItem = ({ icon, label, delay }) => (
  <div
    className="flex flex-col items-center gap-1.5 animate-[fadeInUp_0.5s_ease-out_both]"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-emerald-300/80">
      {icon}
    </div>
    <span className="text-[10px] text-emerald-300/60 font-medium">{label}</span>
  </div>
);

const FlowArrow = () => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-0.5">
      <div className="w-4 h-0.5 bg-emerald-400/40 rounded-full" />
      <div className="w-6 h-0.5 bg-emerald-400/60 rounded-full" />
      <div className="w-8 h-0.5 bg-emerald-400/80 rounded-full" />
    </div>
    <IconArrowRight />
    <div className="flex items-center gap-0.5">
      <div className="w-4 h-0.5 bg-emerald-400/40 rounded-full" />
      <div className="w-6 h-0.5 bg-emerald-400/60 rounded-full" />
      <div className="w-8 h-0.5 bg-emerald-400/80 rounded-full" />
    </div>
  </div>
);

const OutputBox = ({ type, title, items }) => {
  const isRecyclable = type === "recyclable";

  return (
    <div
      className={`flex-1 rounded-lg p-3 sm:p-4 border ${
        isRecyclable
          ? "bg-emerald-900/50 border-emerald-500/50"
          : "bg-rose-950/50 border-rose-500/50"
      }`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center ${
            isRecyclable ? "bg-emerald-500/30" : "bg-rose-500/30"
          }`}
        >
          {isRecyclable ? <IconCheck /> : <IconX />}
        </div>
        <span
          className={`text-[11px] font-bold tracking-wider uppercase ${
            isRecyclable ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {title}
        </span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li
            key={i}
            className={`flex items-center gap-2 text-[12px] ${
              isRecyclable ? "text-emerald-200/70" : "text-rose-200/70"
            }`}
          >
            <span
              className={`w-1 h-1 rounded-full ${
                isRecyclable ? "bg-emerald-400/60" : "bg-rose-400/60"
              }`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const HeroSection = () => (
  <section className="relative mb-10">
    <div className="relative rounded-md overflow-hidden bg-linear-to-br from-slate-950 to-teal-950">
      <div className="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%221%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-slate-500/[0.06]" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-teal-500/[0.05]" />

      <div className="relative px-5 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white text-center leading-[1.2] tracking-tight mb-3 max-w-3xl mx-auto">
          MEMAHAMI JALUR SAMPAH:{" "}
          <span className="text-slate-400">JANGAN SALAH PILIH,</span> JANGAN
          SAMPAI JADI RESIDU!
        </h1>

        <p className="text-sm sm:text-base text-slate-200/60 text-center max-w-xl mx-auto leading-relaxed">
          Pusat Edukasi BinGo: Pahami, Pilah, dan Kurangi Sampah demi Pesisir
          yang Lebih Bersih.
        </p>
      </div>
    </div>
  </section>
);

const FilterBar = ({ active, onSelect }) => (
  <div className="flex flex-wrap gap-2 mb-8">
    {filters.map(({ id, label }) => {
      const isActive = active === id;
      return (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`relative px-4 py-2 text-sm font-medium rounded-md border transition-all duration-300 cursor-pointer ${
            isActive
              ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
              : "bg-white text-slate-500 border-slate-200/80 hover:border-slate-300 hover:text-slate-700 hover:shadow-sm"
          }`}
        >
          {label}
        </button>
      );
    })}
  </div>
);

const Article = () => {
  const [activeTopic, setActiveTopic] = useState("all");
  const [mounted, setMounted] = useState(false);

  const { articles, loading, error, refetch } = useWikipediaArticles(
    activeTopic,
    2,
  );

  const uniqueArticles = useMemo(
    () => Array.from(new Map(articles.map((a) => [a.id, a])).values()),
    [articles]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const featured = uniqueArticles[0] || null;
  const rest = uniqueArticles.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <NavbarDashboard />

      <main
        className={`px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-8 max-w-7xl mx-auto transition-opacity duration-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <HeroSection />
        <FilterBar active={activeTopic} onSelect={setActiveTopic} />

        {loading && <LoadingSkeleton count={5} />}

        {error && !loading && <ErrorState message={error} onRetry={refetch} />}

        {!loading && !error && uniqueArticles.length === 0 && <EmptyState />}

        {!loading && !error && uniqueArticles.length > 0 && (
          <section>
            {featured && (
              <div className="mb-5">
                <ArticleCard article={featured} featured />
              </div>
            )}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((article, i) => (
                <ArticleCard
                  key={article.id || article.title}
                  article={article}
                  index={i}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanLine {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(400px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default Article;
