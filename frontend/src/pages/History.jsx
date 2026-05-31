import React, { useState, useMemo, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getMyScans } from "../services/scanService";
import { isAuthenticated } from "../services/authService";


const IconSearch = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

const IconMapPin = ({ className = "w-3 h-3" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

const IconScan = ({ className = "w-5 h-5" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" />
  </svg>
);

const IconChevronDown = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const MATERIAL_OPTIONS = [
  { value: "Semua", label: "Semua" },
  { value: "Plastic", label: "Plastik" },
  { value: "Paper", label: "Kertas" },
  { value: "Metal", label: "Logam" },
  { value: "Glass", label: "Kaca" },
  { value: "Textile", label: "Tekstil" },
];


const StatBox = ({ label, value, highlight = false }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs">
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


const History = () => {
  const [search, setSearch] = useState("");
  const [materialFilter, setMaterialFilter] = useState("Semua");
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

  if (loading) return <LoadingSkeleton variant="history" />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <NavbarDashboard />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-28 lg:pb-8">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-slate-900">Riwayat Scan</h1>
          <p className="text-sm text-slate-500 mt-1">Catatan seluruh aktivitas pemindaian sampahmu</p>
        </div>

        {!error && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatBox label="Total Scan" value={totalScans} />
            <StatBox label="Material Terbanyak" value={topMaterial} highlight />
          </div>
        )}

        <div className="flex flex-row items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 min-w-0">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama pantai atau material..."
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="relative">
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="appearance-none w-36 sm:w-44 pl-4 pr-9 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all cursor-pointer text-slate-700 shrink-0"
            >
              {MATERIAL_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <IconChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin" />
            <p className="text-xs text-slate-400 mt-3">Memuat riwayat...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <IconScan className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">{error}</p>
          </div>
        )}

        {!error && filteredData.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredData.map((item) => <HistoryCard key={item.id} item={item} />)}
          </div>
        )}

        {!error && filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <IconScan className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-500">Tidak ada riwayat ditemukan</p>
            <p className="text-xs text-slate-400 mt-1">Coba ubah kata kunci atau filter material</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
