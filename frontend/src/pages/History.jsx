<<<<<<< HEAD
import React, { useState, useMemo } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
=======
import React, { useState, useMemo, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import { getMyScans } from "../services/scanService";
import { isAuthenticated } from "../services/authService";
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)

// ── SVG Icon Components ──────────────────────────────────────────

const IconSearch = ({ className = "w-4 h-4" }) => (
<<<<<<< HEAD
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
=======
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
  </svg>
);

const IconMapPin = ({ className = "w-3 h-3" }) => (
<<<<<<< HEAD
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
=======
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
  </svg>
);

const IconScan = ({ className = "w-5 h-5" }) => (
<<<<<<< HEAD
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M7 12h10" />
=======
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" />
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
  </svg>
);

const IconChevronDown = ({ className = "w-4 h-4" }) => (
<<<<<<< HEAD
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
=======
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
    <path d="m6 9 6 6 6-6" />
  </svg>
);

<<<<<<< HEAD
// ── Mock Data ────────────────────────────────────────────────────

const MOCK_HISTORY = [
  {
    id: 1,
    objectName: "Botol Plastik Saset",
    material: "Plastik",
    beach: "Pantai Balekambang",
    date: "24 Mei 2026",
    time: "15:30 WIB",
    recyclable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    objectName: "Kantong Kresek Robek",
    material: "Plastik",
    beach: "Pantai Sendang Biru",
    date: "23 Mei 2026",
    time: "10:15 WIB",
    recyclable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    objectName: "Kaleng Minuman Soda",
    material: "Logam",
    beach: "Pantai Kuta Bali",
    date: "22 Mei 2026",
    time: "08:45 WIB",
    recyclable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1572186752053-4d2389791b69?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    objectName: "Pecahan Botol Kaca",
    material: "Kaca",
    beach: "Pantai Parangtritis",
    date: "21 Mei 2026",
    time: "14:20 WIB",
    recyclable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    objectName: "Sisa Makanan Terbungkus",
    material: "Organik",
    beach: "Pantai Balekambang",
    date: "20 Mei 2026",
    time: "11:00 WIB",
    recyclable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1516534732402-0fb9e99aff6e?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    objectName: "Tali Jaring Nelayan",
    material: "Plastik",
    beach: "Pantai Sendang Biru",
    date: "19 Mei 2026",
    time: "09:30 WIB",
    recyclable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    objectName: "Plastik Kemasan Shampoo",
    material: "Plastik",
    beach: "Pantai Kuta Bali",
    date: "18 Mei 2026",
    time: "16:10 WIB",
    recyclable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    objectName: "Kayu Terapung Rusak",
    material: "Organik",
    beach: "Pantai Parangtritis",
    date: "17 Mei 2026",
    time: "07:55 WIB",
    recyclable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=400&h=300&fit=crop",
  },
];

const MATERIAL_OPTIONS = ["Semua", "Plastik", "Organik", "Logam", "Kaca"];

=======
const MATERIAL_OPTIONS = [
  { value: "Semua", label: "Semua" },
  { value: "Plastic", label: "Plastik" },
  { value: "Paper", label: "Kertas" },
  { value: "Metal", label: "Logam" },
  { value: "Glass", label: "Kaca" },
  { value: "Textile", label: "Tekstil" },
];

>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
// ── Sub-Components ───────────────────────────────────────────────

const StatBox = ({ label, value, highlight = false }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
<<<<<<< HEAD
    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
      {label}
    </p>
    <p
      className={`mt-2 text-2xl font-black ${
        highlight ? "text-emerald-600" : "text-slate-800"
      }`}
    >
      {value}
    </p>
  </div>
);

const HistoryCard = ({ item }) => (
  <div className="group bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300">
    {/* ── Media Thumbnail ── */}
    <div className="w-full h-36 md:h-44 bg-slate-100 rounded-t-2xl relative overflow-hidden">
      <img
        src={item.imageUrl}
        alt={item.objectName}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>

    {/* ── Metadata ── */}
    <div className="px-3 pt-2.5 pb-3 md:px-4 md:pt-3 md:pb-4">
      <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug">
        {item.objectName}
      </h3>

      <span className="inline-block mt-1.5 md:mt-2 bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">
        {item.material}
      </span>

      <div className="flex items-center gap-1 mt-2 text-slate-500 text-[11px] md:text-xs">
        <IconMapPin className="w-3 h-3 shrink-0" />
        <span className="truncate">{item.beach}</span>
      </div>

      <p className="text-slate-400 text-[10px] font-mono mt-1">
        {item.date} &bull; {item.time}
      </p>

      {/* ── Recyclability Badge ── */}
      <div className="mt-2.5 pt-2.5 md:mt-3 md:pt-3 border-t border-slate-100">
        {item.recyclable ? (
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] md:text-[11px] font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Dapat Didaur Ulang
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[10px] md:text-[11px] font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Residu / Sulit Daur Ulang
          </span>
        )}
      </div>
    </div>
  </div>
);
=======
    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
    <p className={`mt-2 text-2xl font-black ${highlight ? "text-emerald-600" : "text-slate-800"}`}>{value}</p>
  </div>
);

const HistoryCard = ({ item }) => {
  const date = new Date(item.created_at);
  const dateStr = date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  const timeStr = date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <div className="w-full h-36 md:h-44 bg-slate-100 rounded-t-2xl relative overflow-hidden">
        <img src={item.image_url} alt={item.waste_type} className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="px-3 pt-2.5 pb-3 md:px-4 md:pt-3 md:pb-4">
        <h3 className="text-sm md:text-base font-bold text-slate-800 leading-snug capitalize">
          {item.waste_type}
        </h3>
        <span className="inline-block mt-1.5 md:mt-2 bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize">
          {item.waste_type}
        </span>
        {item.location_name && (
          <div className="flex items-center gap-1 mt-2 text-slate-500 text-[11px] md:text-xs">
            <IconMapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{item.location_name}</span>
          </div>
        )}
        <p className="text-slate-400 text-[10px] font-mono mt-1">
          {dateStr} &bull; {timeStr}
        </p>
        <div className="mt-2.5 pt-2.5 md:mt-3 md:pt-3 border-t border-slate-100">
          {item.recyclable === "Yes" ? (
            <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] md:text-[11px] font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Dapat Didaur Ulang
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-[10px] md:text-[11px] font-semibold px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Residu / Sulit Daur Ulang
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)

// ── Main Page Component ──────────────────────────────────────────

const History = () => {
  const [search, setSearch] = useState("");
  const [materialFilter, setMaterialFilter] = useState("Semua");
<<<<<<< HEAD

  const filteredData = useMemo(() => {
    return MOCK_HISTORY.filter((item) => {
      const matchesSearch =
        !search ||
        item.beach.toLowerCase().includes(search.toLowerCase()) ||
        item.objectName.toLowerCase().includes(search.toLowerCase());

      const matchesMaterial =
        materialFilter === "Semua" || item.material === materialFilter;

      return matchesSearch && matchesMaterial;
    });
  }, [search, materialFilter]);

  // Compute stats from mock data
  const totalScans = MOCK_HISTORY.length;
  const topMaterial = (() => {
    const count = {};
    MOCK_HISTORY.forEach((i) => {
      count[i.material] = (count[i.material] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
  })();
  const avgConfidence = (() => {
    const sum = MOCK_HISTORY.reduce((acc, i) => acc + i.confidence, 0);
    return (sum / MOCK_HISTORY.length).toFixed(1);
  })();
=======
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      setError("Silakan login terlebih dahulu untuk melihat riwayat scan.");
      return;
    }

    const fetchScans = async () => {
      try {
        const result = await getMyScans(1, 50);
        setScans(result.data || []);
      } catch (err) {
        setError("Gagal memuat riwayat scan.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  const filteredData = useMemo(() => {
    return scans.filter((item) => {
      const matchesSearch =
        !search ||
        (item.location_name && item.location_name.toLowerCase().includes(search.toLowerCase())) ||
        item.waste_type.toLowerCase().includes(search.toLowerCase());
      const matchesMaterial =
        materialFilter === "Semua" || item.waste_type.toLowerCase() === materialFilter.toLowerCase();
      return matchesSearch && matchesMaterial;
    });
  }, [scans, search, materialFilter]);

  const totalScans = scans.length;
  const topMaterial = (() => {
    if (!scans.length) return "-";
    const count = {};
    scans.forEach((i) => { count[i.waste_type] = (count[i.waste_type] || 0) + 1; });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
  })();
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <NavbarDashboard />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-8">
<<<<<<< HEAD
        {/* ── Page Title ── */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Riwayat Scan</h1>
          <p className="text-sm text-slate-500 mt-1">
            Catatan seluruh aktivitas pemindaian sampahmu
          </p>
        </div>

        {/* ── Filter & Search Controls ── */}
        <div className="flex flex-row items-center justify-between gap-3 mb-6">
          {/* Search Input */}
=======
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Riwayat Scan</h1>
          <p className="text-sm text-slate-500 mt-1">Catatan seluruh aktivitas pemindaian sampahmu</p>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatBox label="Total Scan" value={totalScans} />
            <StatBox label="Material Terbanyak" value={topMaterial} highlight />
          </div>
        )}

        {/* Filter & Search */}
        <div className="flex flex-row items-center justify-between gap-3 mb-6">
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
          <div className="relative flex-1 min-w-0">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
<<<<<<< HEAD
              placeholder="Cari nama pantai atau objek..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Material Filter */}
=======
              placeholder="Cari nama pantai atau material..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
            />
          </div>
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
          <div className="relative">
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="appearance-none w-36 sm:w-44 pl-4 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all cursor-pointer text-slate-700 shrink-0"
            >
<<<<<<< HEAD
              {MATERIAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
=======
              {MATERIAL_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
            </select>
            <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

<<<<<<< HEAD
        {/* ── History Cards Grid ── */}
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredData.map((item) => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          /* ── Empty State ── */
=======
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
            <p className="text-xs text-slate-400 mt-3">Memuat riwayat...</p>
          </div>
        )}

        {/* Error */}
        {error && (
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <IconScan className="w-8 h-8 text-slate-300" />
            </div>
<<<<<<< HEAD
            <p className="text-sm font-semibold text-slate-500">
              Tidak ada riwayat ditemukan
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Coba ubah kata kunci atau filter material
            </p>
=======
            <p className="text-sm font-semibold text-slate-500">{error}</p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filteredData.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredData.map((item) => <HistoryCard key={item.id} item={item} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <IconScan className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Tidak ada riwayat ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci atau filter material</p>
>>>>>>> cbba226 (feat(core): add AI waste scan service + implement user authentication flow)
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
