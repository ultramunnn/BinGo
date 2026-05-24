import { ExternalLink } from "lucide-react";

const colorMap = {
  emerald: {
    badge: "text-emerald-700 bg-emerald-50 border-emerald-100",
    bullet: "bg-emerald-400 shadow-emerald-400/40",
    hover: "group-hover:text-emerald-700",
    accent: "from-emerald-400 to-emerald-200",
    icon: "text-emerald-300/70",
  },
  slate: {
    badge: "text-slate-600 bg-slate-50 border-slate-100",
    bullet: "bg-slate-400 shadow-slate-400/40",
    hover: "group-hover:text-slate-700",
    accent: "from-slate-400 to-slate-200",
    icon: "text-slate-300/70",
  },
  amber: {
    badge: "text-amber-700 bg-amber-50 border-amber-100",
    bullet: "bg-amber-400 shadow-amber-400/40",
    hover: "group-hover:text-amber-700",
    accent: "from-amber-400 to-amber-200",
    icon: "text-amber-300/70",
  },
  lime: {
    badge: "text-lime-700 bg-lime-50 border-lime-100",
    bullet: "bg-lime-400 shadow-lime-400/40",
    hover: "group-hover:text-lime-700",
    accent: "from-lime-400 to-lime-200",
    icon: "text-lime-300/70",
  },
  sky: {
    badge: "text-sky-700 bg-sky-50 border-sky-100",
    bullet: "bg-sky-400 shadow-sky-400/40",
    hover: "group-hover:text-sky-700",
    accent: "from-sky-400 to-sky-200",
    icon: "text-sky-300/70",
  },
  orange: {
    badge: "text-orange-700 bg-orange-50 border-orange-100",
    bullet: "bg-orange-400 shadow-orange-400/40",
    hover: "group-hover:text-orange-700",
    accent: "from-orange-400 to-orange-200",
    icon: "text-orange-300/70",
  },
};

function getColors(color) {
  return colorMap[color] || colorMap.emerald;
}

/**
 * Reusable article card with thumbnail, category badge, extract, and link.
 *
 * @param {{ article: Object, index?: number, featured?: boolean }} props
 */
export default function ArticleCard({ article, index = 0, featured = false }) {
  const colors = getColors(article.color);

  if (featured) {
    return <FeaturedArticleCard article={article} colors={colors} />;
  }

  return (
    <article
      className="group relative bg-white rounded-xl border border-slate-200/60 overflow-hidden hover:shadow-md hover:border-slate-300/60 transition-all duration-300 flex flex-col animate-[fadeInUp_0.5s_ease-out_both]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className={`h-0.5 bg-linear-to-r ${colors.accent}`} />

      {/* Thumbnail */}
      <div className="h-36 bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
        {article.thumbnail ? (
          <img
            src={article.thumbnail}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <svg
            className={`w-10 h-10 ${colors.icon}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6V7.5z"
            />
          </svg>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md border ${colors.badge}`}
          >
            {article.category}
          </span>
        </div>

        <h3
          className={`text-[15px] font-bold text-slate-800 leading-snug mb-3 ${colors.hover} transition-colors duration-300`}
        >
          {article.title}
        </h3>

        <div className="flex gap-2.5 mb-4 flex-1">
          <span
            className={`mt-1.5 w-2 h-2 rounded-full shrink-0 shadow-sm ${colors.bullet}`}
          />
          <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3">
            {article.extract}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-400 capitalize">
            {article.description}
          </span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
          >
            Baca
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

function FeaturedArticleCard({ article, colors }) {
  return (
    <article className="group relative sm:col-span-2 lg:col-span-2 bg-white rounded-xl border border-slate-200/60 overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5 h-48 md:h-auto bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
          {article.thumbnail ? (
            <img
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <svg
              className={`w-20 h-20 ${colors.icon}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={0.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          )}
          <div className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-emerald-700 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200/50">
            Featured
          </div>
        </div>

        <div className="md:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-lg border ${colors.badge}`}
            >
              {article.category}
            </span>
          </div>

          <h2
            className={`text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-3 ${colors.hover} transition-colors duration-300`}
          >
            {article.title}
          </h2>

          <div className="flex gap-3 mb-5">
            <span
              className={`mt-2 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${colors.bullet}`}
            />
            <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
              {article.extract}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 capitalize">
              {article.description}
            </span>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:gap-2.5 transition-all duration-300"
            >
              Baca di Wikipedia
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
