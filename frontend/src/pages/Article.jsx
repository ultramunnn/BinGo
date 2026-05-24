import { useState, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import { ArticleCard, LoadingSkeleton, EmptyState, ErrorState } from "../components/article";
import { getCategoryFilters } from "../constants/wikipediaTopics";
import { useWikipediaArticles } from "../hooks/useWikipediaArticles";

const filters = getCategoryFilters();

// ─── Hero Section ────────────────────────────────────────────

const HeroSection = () => (
  <section className="relative mb-10">
    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
      <span className="hover:text-emerald-600 cursor-pointer transition-colors">
        Beranda
      </span>
      <svg
        className="w-3 h-3 text-slate-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
      <span className="text-slate-600 font-medium">Artikel Edukasi</span>
    </nav>

    <div className="relative w-full h-48 sm:h-64 lg:h-80 bg-linear-to-br from-slate-100 to-slate-200/60 overflow-hidden mb-8">
      <div className="absolute inset-0 opacity-[0.12] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2310b981%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%221.5%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-50 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-20 h-20 text-emerald-300/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      </div>
    </div>

    <div className="max-w-3xl">
      <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100 mb-4">
        Edukasi Lingkungan
      </span>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-5">
        Pusat Edukasi Pengelolaan Sampah & Daur Ulang
      </h1>

      <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-6">
        Pelajari artikel dari Wikipedia tentang daur ulang plastik, pengelolaan
        sampah, kompos, dan topik lingkungan lainnya. Pengetahuan ini membantumu
        memilah sampah dengan lebih tepat saat menggunakan fitur AI Scan BinGo.
      </p>

      <div className="flex flex-wrap gap-6 sm:gap-8 pb-6 border-b border-slate-200">
        {[
          { value: "6", label: "Topik Edukasi" },
          { value: "Wikipedia", label: "Sumber Artikel" },
          { value: "Real-time", label: "Data Terkini" },
        ].map((stat, i) => (
          <div key={i}>
            <p className="text-xl sm:text-2xl font-black text-emerald-600">
              {stat.value}
            </p>
            <p className="text-[11px] text-slate-400 max-w-30 leading-tight">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ─── Filter Bar ──────────────────────────────────────────────

const FilterBar = ({ active, onSelect }) => (
  <div className="flex flex-wrap gap-2 mb-8">
    {filters.map(({ id, label }) => {
      const isActive = active === id;
      return (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`relative px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-300 cursor-pointer ${
            isActive
              ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20"
              : "bg-white text-slate-500 border-slate-200/80 hover:border-slate-300 hover:text-slate-700 hover:shadow-sm"
          }`}
        >
          {label}
          {isActive && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-emerald-400" />
          )}
        </button>
      );
    })}
  </div>
);

// ─── Main Component ──────────────────────────────────────────

const Article = () => {
  const [activeTopic, setActiveTopic] = useState("all");
  const [mounted, setMounted] = useState(false);

  const { articles, loading, error, refetch } = useWikipediaArticles(
    activeTopic,
    2
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const featured = articles[0] || null;
  const rest = articles.slice(1);

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

        {error && !loading && (
          <ErrorState message={error} onRetry={refetch} />
        )}

        {!loading && !error && articles.length === 0 && (
          <EmptyState />
        )}

        {!loading && !error && articles.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured && (
              <ArticleCard article={featured} featured />
            )}
            {rest.map((article, i) => (
              <ArticleCard
                key={article.id || article.title}
                article={article}
                index={i}
              />
            ))}
          </section>
        )}
      </main>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Article;
