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

const HeroSection = () => (
  <section className="relative mb-10">
    <div className="relative rounded-md overflow-hidden">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 50 1300 440"
      >
        <rect fill="#020618" width="540" height="450" />
        <defs>
          <linearGradient
            id="a"
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="0"
            y1="0"
            y2="100%"
            gradientTransform="rotate(205,640,316)"
          >
            <stop offset="0" stop-color="#020618" />
            <stop offset="1" stop-color="#022F2E" />
          </linearGradient>
          <pattern
            patternUnits="userSpaceOnUse"
            id="b"
            width="402"
            height="335"
            x="0"
            y="0"
            viewBox="0 0 1080 900"
          >
            <g fill-opacity="0.03">
              <polygon fill="#444" points="90 150 0 300 180 300" />
              <polygon points="90 150 180 0 0 0" />
              <polygon fill="#AAA" points="270 150 360 0 180 0" />
              <polygon fill="#DDD" points="450 150 360 300 540 300" />
              <polygon fill="#999" points="450 150 540 0 360 0" />
              <polygon points="630 150 540 300 720 300" />
              <polygon fill="#DDD" points="630 150 720 0 540 0" />
              <polygon fill="#444" points="810 150 720 300 900 300" />
              <polygon fill="#FFF" points="810 150 900 0 720 0" />
              <polygon fill="#DDD" points="990 150 900 300 1080 300" />
              <polygon fill="#444" points="990 150 1080 0 900 0" />
              <polygon fill="#DDD" points="90 450 0 600 180 600" />
              <polygon points="90 450 180 300 0 300" />
              <polygon fill="#666" points="270 450 180 600 360 600" />
              <polygon fill="#AAA" points="270 450 360 300 180 300" />
              <polygon fill="#DDD" points="450 450 360 600 540 600" />
              <polygon fill="#999" points="450 450 540 300 360 300" />
              <polygon fill="#999" points="630 450 540 600 720 600" />
              <polygon fill="#FFF" points="630 450 720 300 540 300" />
              <polygon points="810 450 720 600 900 600" />
              <polygon fill="#DDD" points="810 450 900 300 720 300" />
              <polygon fill="#AAA" points="990 450 900 600 1080 600" />
              <polygon fill="#444" points="990 450 1080 300 900 300" />
              <polygon fill="#222" points="90 750 0 900 180 900" />
              <polygon points="270 750 180 900 360 900" />
              <polygon fill="#DDD" points="270 750 360 600 180 600" />
              <polygon points="450 750 540 600 360 600" />
              <polygon points="630 750 540 900 720 900" />
              <polygon fill="#444" points="630 750 720 600 540 600" />
              <polygon fill="#AAA" points="810 750 720 900 900 900" />
              <polygon fill="#666" points="810 750 900 600 720 600" />
              <polygon fill="#999" points="990 750 900 900 1080 900" />
              <polygon fill="#999" points="180 0 90 150 270 150" />
              <polygon fill="#444" points="360 0 270 150 450 150" />
              <polygon fill="#FFF" points="540 0 450 150 630 150" />
              <polygon points="900 0 810 150 990 150" />
              <polygon fill="#222" points="0 300 -90 450 90 450" />
              <polygon fill="#FFF" points="0 300 90 150 -90 150" />
              <polygon fill="#FFF" points="180 300 90 450 270 450" />
              <polygon fill="#666" points="180 300 270 150 90 150" />
              <polygon fill="#222" points="360 300 270 450 450 450" />
              <polygon fill="#FFF" points="360 300 450 150 270 150" />
              <polygon fill="#444" points="540 300 450 450 630 450" />
              <polygon fill="#222" points="540 300 630 150 450 150" />
              <polygon fill="#AAA" points="720 300 630 450 810 450" />
              <polygon fill="#666" points="720 300 810 150 630 150" />
              <polygon fill="#FFF" points="900 300 810 450 990 450" />
              <polygon fill="#999" points="900 300 990 150 810 150" />
              <polygon points="0 600 -90 750 90 750" />
              <polygon fill="#666" points="0 600 90 450 -90 450" />
              <polygon fill="#AAA" points="180 600 90 750 270 750" />
              <polygon fill="#444" points="180 600 270 450 90 450" />
              <polygon fill="#444" points="360 600 270 750 450 750" />
              <polygon fill="#999" points="360 600 450 450 270 450" />
              <polygon fill="#666" points="540 600 630 450 450 450" />
              <polygon fill="#222" points="720 600 630 750 810 750" />
              <polygon fill="#FFF" points="900 600 810 750 990 750" />
              <polygon fill="#222" points="900 600 990 450 810 450" />
              <polygon fill="#DDD" points="0 900 90 750 -90 750" />
              <polygon fill="#444" points="180 900 270 750 90 750" />
              <polygon fill="#FFF" points="360 900 450 750 270 750" />
              <polygon fill="#AAA" points="540 900 630 750 450 750" />
              <polygon fill="#FFF" points="720 900 810 750 630 750" />
              <polygon fill="#222" points="900 900 990 750 810 750" />
              <polygon fill="#222" points="1080 300 990 450 1170 450" />
              <polygon fill="#FFF" points="1080 300 1170 150 990 150" />
              <polygon points="1080 600 990 750 1170 750" />
              <polygon fill="#666" points="1080 600 1170 450 990 450" />
              <polygon fill="#DDD" points="1080 900 1170 750 990 750" />
            </g>
          </pattern>
        </defs>
        <rect x="0" y="0" fill="url(#a)" width="100%" height="100%" />
        <rect x="0" y="0" fill="url(#b)" width="100%" height="100%" />
      </svg>

      <div className="relative px-5 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white text-center leading-[1.2] tracking-tight mb-3 max-w-3xl mx-auto">
          MEMAHAMI JALUR SAMPAH:{" "}
          <span className="text-slate-500">JANGAN SALAH PILIH,</span> JANGAN
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
    [articles],
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
