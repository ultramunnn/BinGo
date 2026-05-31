import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarDashboard from "../components/NavbarDashboard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import { getMyScans, getLeaderboard } from "../services/scanService";

const IconScan = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2" />
    <path d="M17 3h2a2 2 0 0 1 2 2v2" />
    <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
    <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
    <line x1="7" y1="12" x2="17" y2="12" />
  </svg>
);

const IconTrash = ({ className = "w-6 h-6" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const IconEdit = ({ className = "w-4 h-4" }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    <path d="m15 5 4 4" />
  </svg>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardRank, setLeaderboardRank] = useState(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const result = await getMyScans(1, 100);
        setScans(result.data || []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchScans();

    getLeaderboard()
      .then((data) => {
        if (data.currentUser) setLeaderboardRank(data.currentUser);
      })
      .catch(() => {});
  }, []);

  const totalScans = scans.length;
  const topMaterial = (() => {
    if (!scans.length) return "-";
    const count = {};
    scans.forEach((s) => {
      count[s.waste_type] = (count[s.waste_type] || 0) + 1;
    });
    return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "-";
  })();

  const avatarUrl = user?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || "U")}&background=4BAFBC&color=fff&size=200`;

  if (loading) return <LoadingSkeleton variant="profile" />;

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarDashboard />

      <main className="max-w-3xl mx-auto px-4 py-6 lg:py-10">
        <section className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs relative">
          <button
            onClick={() => navigate("/settings")}
            className="absolute top-4 right-4 border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm px-2 py-2 md:px-4 md:py-2 rounded-xl transition-all cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <IconEdit className="w-4 h-4" />
              Edit Profil
            </span>
          </button>

          <div className="flex flex-col items-center pt-4">
            <img
              src={avatarUrl}
              alt={user?.full_name || "User"}
              className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-slate-100 shadow-sm"
            />
            <h1 className="mt-4 text-xl font-bold text-slate-900">
              {user?.full_name || "Pengguna"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{user?.email || ""}</p>
          </div>
        </section>

        <section className="mt-6 mb-14 md:mb-2">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Dampak Hijau Kamu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 shrink-0">
                <IconScan className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 leading-none">
                  {loading ? "..." : totalScans}
                </p>
                <p className="text-sm text-slate-500 mt-1">Kali Scan</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                <IconTrash className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 leading-none">
                  {loading ? "..." : topMaterial}
                </p>
                <p className="text-sm text-slate-500 mt-1">Sampah Terbanyak</p>
              </div>
            </div>
          </div>

          {/* Leaderboard Position */}
          {leaderboardRank && (
            <div className="mt-6 relative">
              <div className="absolute inset-0 bg-linear-to-r from-amber-400 to-yellow-500 rounded-2xl blur-sm opacity-20" />
              <div className="relative flex items-center gap-4 px-6 py-5 bg-linear-to-r from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200 shadow-sm">
                <span className="text-amber-500 text-lg">⭐</span>
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-amber-400 to-yellow-500 text-white shrink-0">
                  <span className="text-lg font-black">{leaderboardRank.rank}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-800">
                    Peringkat Leaderboard
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {leaderboardRank.scan_count} scan • {user?.full_name || "Kamu"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-amber-700">#{leaderboardRank.rank}</p>
                  <p className="text-[10px] text-amber-500 font-medium">dari semua user</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Profile;
