import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, BookOpen, ChevronRight } from "lucide-react";
import NavbarDashboard from "../components/NavbarDashboard";
import DetailSkeleton from "../components/article/DetailSkeleton";
import { ErrorState } from "../components/article/EmptyState";
import { useArticleDetail } from "../hooks/useArticleDetail";

// ─── Breadcrumb ──────────────────────────────────────────────

function Breadcrumb({ title }) {
  return (
    <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
      <Link to="/" className="hover:text-emerald-600 transition-colors">
        Beranda
      </Link>
      <ChevronRight className="w-3 h-3 text-slate-300" />
      <Link to="/article" className="hover:text-emerald-600 transition-colors">
        Artikel
      </Link>
      <ChevronRight className="w-3 h-3 text-slate-300" />
      <span className="text-slate-600 font-medium truncate max-w-48">
        {title}
      </span>
    </nav>
  );
}

// ─── Hero Image ──────────────────────────────────────────────

function HeroImage({ thumbnail, title }) {
  if (!thumbnail) {
    return (
      <div className="w-full h-48 sm:h-64 lg:h-80 bg-linear-to-br from-slate-100 to-slate-200/60 rounded-xl overflow-hidden mb-8 flex items-center justify-center">
        <BookOpen className="w-20 h-20 text-slate-300" />
      </div>
    );
  }

  return (
    <div className="w-full h-48 sm:h-64 lg:h-80 bg-slate-100 rounded-xl overflow-hidden mb-8 relative">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-50 to-transparent" />
    </div>
  );
}

// ─── Table of Contents ───────────────────────────────────────

function TableOfContents({ sections, activeId }) {
  if (sections.length === 0) return null;

  return (
    <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-5 mb-8">
      <h4 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3">
        Daftar Isi
      </h4>
      <ul className="space-y-1.5">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#section-${section.id}`}
              className={`text-sm transition-colors hover:text-emerald-600 ${
                activeId === section.id
                  ? "text-emerald-600 font-medium"
                  : "text-slate-500"
              }`}
              style={{ paddingLeft: `${(section.level - 1) * 12}px` }}
            >
              {section.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Section Content ─────────────────────────────────────────

function ArticleSection({ section }) {
  return (
    <section id={`section-${section.id}`} className="mb-8 scroll-mt-24">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
        {section.title}
      </h2>
      <div
        className="wiki-content text-sm sm:text-base text-slate-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </section>
  );
}

// ─── Lead Content ────────────────────────────────────────────

function LeadContent({ content }) {
  if (!content) return null;

  return (
    <div
      className="wiki-content text-base sm:text-lg text-slate-600 leading-relaxed mb-8 pb-8 border-b border-slate-200"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}

// ─── Main Component ──────────────────────────────────────────

export default function ArticleDetail() {
  const { title } = useParams();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const { article, loading, error, refetch } = useArticleDetail(title);

  useEffect(() => {
    setMounted(true);
  }, []);

  const decodedTitle = useMemo(
    () => (title ? decodeURIComponent(title).replace(/_/g, " ") : ""),
    [title]
  );

  const displayTitle = article?.title || decodedTitle;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <NavbarDashboard />

      <main
        className={`px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-8 max-w-7xl mx-auto transition-opacity duration-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Back button */}
        <button
          onClick={() => navigate("/article")}
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Artikel
        </button>

        {loading && <DetailSkeleton />}

        {error && !loading && (
          <ErrorState message={error} onRetry={refetch} />
        )}

        {!loading && !error && article && (
          <article>
            <Breadcrumb title={displayTitle} />

            <HeroImage
              thumbnail={article.thumbnail}
              title={displayTitle}
            />

            <div className="max-w-3xl">
              {/* Category + meta */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {article.description && (
                  <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">
                    {article.description}
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  Wikipedia
                </span>
                {article.timestamp && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-xs text-slate-400">
                      {new Date(article.timestamp).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-[1.15] tracking-tight mb-5">
                {displayTitle}
              </h1>

              {/* Extract */}
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-6">
                {article.extract}
              </p>

              {/* Author bar */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                    W
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      Wikipedia Contributors
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Sumber terbuka &mdash; Dilisensikan CC BY-SA
                    </p>
                  </div>
                </div>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Baca di Wikipedia
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Table of Contents */}
              <TableOfContents
                sections={article.sections}
                activeId={activeSection}
              />

              {/* Lead content (intro from Wikipedia) */}
              <LeadContent content={article.lead} />

              {/* Article sections */}
              {article.sections.map((section) => (
                <ArticleSection key={section.id} section={section} />
              ))}

              {/* Bottom CTA */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <div className="bg-slate-50 rounded-xl p-6 sm:p-8 text-center">
                  <BookOpen className="w-10 h-10 mx-auto text-emerald-400 mb-3" />
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    Ingin Membaca Lebih Lanjut?
                  </h3>
                  <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">
                    Artikel ini bersumber dari Wikipedia. Baca versi lengkapnya
                    untuk mendapatkan referensi dan tautan lebih detail.
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Baca di Wikipedia
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        )}
      </main>

      {/* Wikipedia content styling */}
      <style>{`
        .wiki-content p {
          margin-bottom: 1rem;
        }
        .wiki-content p:last-child {
          margin-bottom: 0;
        }
        .wiki-content a {
          color: #059669;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .wiki-content a:hover {
          color: #047857;
        }
        .wiki-content b, .wiki-content strong {
          font-weight: 600;
          color: #1e293b;
        }
        .wiki-content ul, .wiki-content ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .wiki-content li {
          margin-bottom: 0.375rem;
        }
        .wiki-content ul {
          list-style-type: disc;
        }
        .wiki-content ol {
          list-style-type: decimal;
        }
        .wiki-content sup {
          font-size: 0.7em;
          vertical-align: super;
          color: #94a3b8;
        }
        .wiki-content .mw-empty-elt {
          display: none;
        }
        .wiki-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          font-size: 0.875rem;
        }
        .wiki-content th, .wiki-content td {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e2e8f0;
          text-align: left;
        }
        .wiki-content th {
          background: #f8fafc;
          font-weight: 600;
          color: #334155;
        }
        .wiki-content blockquote {
          border-left: 3px solid #10b981;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #64748b;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
