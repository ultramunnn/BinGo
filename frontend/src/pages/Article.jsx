import { useState, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";

// ─── Mock Data ───────────────────────────────────────────────
const categories = [
  "Semua",
  "Mitos Daur Ulang",
  "Mengenal Residu",
  "Panduan AI Scan",
  "Aksi Pesisir",
];

const articles = [
  {
    id: 1,
    category: "Mitos Daur Ulang",
    title:
      "Anatomi Sampah Saset: Kenapa Kemasan Multi-layer Jadi Musuh Utama Daur Ulang?",
    excerpt:
      "Kemasan saset seperti sachet kopi, sampo, dan bumbu instan terbuat dari beberapa lapisan material berbeda — plastik, aluminium, dan lem — yang dipres menjadi satu. Kombinasi ini membuatnya hampir mustahil dipisahkan oleh fasilitas daur ulang konvensional. Hasilnya? Ribuan ton kemasan saset berakhir di TPA atau terbawa arus ke pantai setiap tahun.",
    date: "22 Mei 2026",
    readTime: "5 menit",
    tag: "Fakta Penting",
    featured: true,
  },
  {
    id: 2,
    category: "Mengenal Residu",
    title:
      "Efek Mikroplastik & Degradasi Matahari pada Sampah Plastik Pesisir",
    excerpt:
      "Sinar UV dan air laut secara perlahan memecah plastik menjadi partikel mikroplastik berukuran kurang dari 5mm. Plastik yang sudah mengalami degradasi fotooksidasi ini kehilangan elastisitas dan struktur polimernya, menjadikannya residu yang tidak layak daur ulang — bahkan oleh mesin sortir AI sekalipun.",
    date: "18 Mei 2026",
    readTime: "7 menit",
    tag: "Dampak Lingkungan",
    featured: false,
  },
  {
    id: 3,
    category: "Panduan AI Scan",
    title:
      "Cara Membedakan Sampah Layak Daur Ulang vs Sampah Residu lewat Fitur BinGo",
    excerpt:
      "Fitur AI Scan pada BinGo menggunakan Computer Vision untuk menganalisis kondisi fisik sampah — termasuk tingkat degradasi, jenis material, dan kelayakan daur ulang. Pelajari cara membaca indikator hasil scan agar kamu bisa memilah sampah dengan lebih tepat di lapangan.",
    date: "14 Mei 2026",
    readTime: "6 menit",
    tag: "Tutorial",
    featured: false,
  },
  {
    id: 4,
    category: "Aksi Pesisir",
    title:
      "Protokol Beach Cleanup Efektif: Dari Kumpulkan Sampah sampai Input Data ke BinGo",
    excerpt:
      "Membersihkan pantai bukan hanya soal memungut sampah. Dengan protokol yang terstruktur — mulai dari zona sampling, klasifikasi jenis sampah, hingga pencatatan data ke platform BinGo — setiap aksi pesisir bisa menghasilkan data yang bermanfaat untuk penelitian dan kebijakan lingkungan.",
    date: "10 Mei 2026",
    readTime: "8 menit",
    tag: "Panduan Relawan",
    featured: false,
  },
  {
    id: 5,
    category: "Mitos Daur Ulang",
    title:
      "Label Segitiga Tanda Daur Ulang? Ternyata Bukan Jaminan Bisa Didaur Ulang!",
    excerpt:
      "Banyak orang menganggap simbol segitiga angka 1-7 pada kemasan plastik berarti produk tersebut pasti bisa didaur ulang. Faktanya, simbol itu hanya menunjukkan jenis resin plastik — bukan jaminan bahwa fasilitas daur ulang di kotamu bisa mengolahnya. Terutama untuk plastik tipe 3 (PVC), 6 (PS), dan 7 (Other).",
    date: "6 Mei 2026",
    readTime: "4 menit",
    tag: "Fakta Penting",
    featured: false,
  },
  {
    id: 6,
    category: "Mengenal Residu",
    title:
      "Microbeads, Film Plastik Tipis & Sampah Tak Kasat Mata yang Mengancam Ekosistem Pantai",
    excerpt:
      "Selain sampah plastik besar, pantai Indonesia juga terancam oleh microbeads dari produk kosmetik dan film plastik ultra-tipis yang sulit terdeteksi oleh mata telanjang. Sampah-sampah ini lolos dari proses pembersihan manual dan hanya bisa diidentifikasi melalui analisis laboratorium atau teknologi AI canggih.",
    date: "2 Mei 2026",
    readTime: "6 menit",
    tag: "Dampak Lingkungan",
    featured: false,
  },
];

// ─── SVG Components ──────────────────────────────────────────

const RecycleIcon = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none">
    <path
      d="M32 8L20 28h24L32 8z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M20 28l-8 16h40l-8-16"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 44h40v8H12z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    <path
      d="M28 52v4m8-4v4"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// ─── Hero Section ────────────────────────────────────────────

const HeroSection = () => (
  <section className="relative mb-10">

    {/* Hero image — full width cinematic */}
    <div className="relative w-full h-48 sm:h-64 lg:h-80 bg-linear-to-br from-slate-100 to-slate-200/60 overflow-hidden mb-8">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-[0.12] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%2310b981%22%20fill-opacity%3D%221%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%221.5%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')]" />
      {/* Gradient overlay bottom */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-50 to-transparent" />
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          className="w-20 h-20 text-emerald-300/60"
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
      </div>
    </div>
  </section>
);

const FeaturedCard = ({ article }) => (
  <article className="group relative sm:col-span-2 lg:col-span-2 bg-white rounded-xl border border-slate-200/60 overflow-hidden hover:shadow-md transition-all duration-300">
    <div className="flex flex-col md:flex-row">
      {/* Image area */}
      <div className="md:w-2/5 h-48 md:h-auto bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.15] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M20%200L40%2020L20%2040L0%2020Z%22%20fill%3D%22none%22%20stroke%3D%22%2310b981%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')]" />
        <RecycleIcon className="w-20 h-20 text-emerald-400/50" />
        <div className="absolute top-4 left-4 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-emerald-700 bg-white/80 backdrop-blur-sm rounded-full border border-emerald-200/50">
          Featured
        </div>
      </div>

      {/* Content */}
      <div className="md:w-3/5 p-6 sm:p-8 flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
            {article.category}
          </span>
          <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/50">
            {article.tag}
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-3 group-hover:text-emerald-700 transition-colors duration-300">
          {article.title}
        </h2>

        <div className="flex gap-3 mb-5">
          <span className="mt-2 w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0 shadow-sm shadow-emerald-400/50" />
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>{article.date}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{article.readTime}</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 group-hover:gap-2.5 transition-all duration-300 cursor-pointer">
            Baca
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  </article>
);

// ─── Standard Card ───────────────────────────────────────────

const ArticleCard = ({ article, index }) => (
  <article
    className="group relative bg-white rounded-xl border border-slate-200/60 overflow-hidden hover:shadow-md hover:border-slate-300/60 transition-all duration-300 flex flex-col animate-[fadeInUp_0.5s_ease-out_both]"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    {/* Top accent bar */}
    <div className="h-0.5 bg-linear-to-r from-emerald-400 to-emerald-200" />

    {/* Image placeholder */}
    <div className="h-36 bg-linear-to-br from-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20viewBox%3D%220%200%2030%2030%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%2215%22%20cy%3D%2215%22%20r%3D%222%22%20fill%3D%22%2310b981%22%2F%3E%3C%2Fsvg%3E')]" />
      <svg
        className="w-10 h-10 text-emerald-300/70"
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
    </div>

    <div className="p-5 flex flex-col flex-1">
      {/* Meta */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
          {article.category}
        </span>
        <span className="text-[10px] text-slate-400">{article.readTime}</span>
      </div>

      {/* Title */}
      <h3 className="text-[15px] font-bold text-slate-800 leading-snug mb-3 group-hover:text-emerald-700 transition-colors duration-300">
        {article.title}
      </h3>

      {/* Excerpt with bullet */}
      <div className="flex gap-2.5 mb-4 flex-1">
        <span className="mt-1.5 w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 shadow-sm shadow-emerald-400/40" />
        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[11px] text-slate-400">{article.date}</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 cursor-pointer">
          Baca
          <svg
            className="w-3 h-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </span>
      </div>
    </div>
  </article>
);

// ─── Main Component ──────────────────────────────────────────

const Article = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered =
    activeCategory === "Semua"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const featured = filtered.find((a) => a.featured);
  const rest = filtered.filter((a) => !a.featured);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <NavbarDashboard />

      <main
        className={`px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-8 max-w-7xl mx-auto transition-opacity duration-700 ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <HeroSection />

        {/* Bento Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Featured card spans 2 columns */}
          {featured && <FeaturedCard article={featured} />}

          {/* Standard cards */}
          {rest.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </section>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-slate-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-400">
              Belum ada artikel untuk kategori ini.
            </p>
          </div>
        )}
      </main>

      {/* Inline keyframes */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Article;
