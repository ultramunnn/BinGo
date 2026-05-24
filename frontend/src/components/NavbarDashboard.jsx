import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// --- Reusable Icons Inside Component ---
const IconSearch = ({ className = "w-5 h-5" }) => (
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
  </svg>
);

const IconUser = ({ className = "w-4 h-4" }) => (
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
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconSettings = ({ className = "w-4 h-4" }) => (
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
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconChevronDown = ({ className = "w-4 h-4" }) => (
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
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const IconLogout = ({ className = "w-4 h-4" }) => (
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
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconDashboard = ({ className = "w-5 h-5" }) => (
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
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconHistory = ({ className = "w-5 h-5" }) => (
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
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);

const IconMap = ({ className = "w-5 h-5" }) => (
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
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);

const IconArticle = ({ className = "w-5 h-5" }) => (
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
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    <path d="M8 7h6" />
    <path d="M8 11h8" />
  </svg>
);

const navItems = [
  { name: "Dashboard", Icon: IconDashboard, path: "/dashboard" },
  { name: "Riwayat", Icon: IconHistory, path: "/history" },
  { name: "Peta", Icon: IconMap, path: "/maps" },
  { name: "Artikel", Icon: IconArticle, path: "/dashboard" },
];

const NavbarDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  // Derive active menu from current path
  const activeMenu = navItems.find((item) => item.path === location.pathname)?.name || "Dashboard";

  // Menangani penutupan dropdown jika klik di luar area komponen
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-6">
          {/* LOGO BRAND */}
          <div className="flex items-center gap-2 shrink-0">
            <img
              src="/assets/images/logo-black.svg"
              alt="BinGo"
              className="h-8 w-auto"
            />
          </div>

          {/* DYNAMIC NAV LINKS — desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ name, path }) => (
              <button
                key={name}
                onClick={() => navigate(path)}
                className={`group cursor-pointer relative px-4 py-2 text-sm font-medium transition-colors ${
                  activeMenu === name
                    ? "text-slate-900 font-semibold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {name}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-black transition-all duration-300 ease-out ${
                    activeMenu === name ? "w-4/5" : "w-0 group-hover:w-4/5"
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* RIGHT ACTIONS UTILITIES */}
          <div className="flex items-center gap-2 shrink-0">
            {/* SEARCH TRIGGER */}
            <div ref={searchRef} className="relative flex items-center">
              <div
                className={`absolute right-10 top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 ease-out overflow-hidden bg-white/80 backdrop-blur-sm rounded-lg ${
                  searchOpen ? "w-40 sm:w-48 lg:w-56 opacity-100 px-2" : "w-0 opacity-0 px-0"
                }`}
              >
                <input
                  type="text"
                  placeholder="Cari..."
                  className="w-full bg-transparent border-b border-slate-300 pb-1 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-900 transition-colors"
                  autoFocus={searchOpen}
                />
              </div>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-slate-500 cursor-pointer transition-colors hover:text-slate-900"
              >
                <IconSearch />
              </button>
            </div>

            <div className="w-px h-6 bg-slate-200/60 mx-1"></div>

            {/* USER PROFILE DROPDOWN */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 cursor-pointer transition-colors"
              >
                <img
                  src="https://i.pravatar.cc/150?u=ruben"
                  alt="Avatar"
                  className="w-8 h-8 rounded-full ring-2 ring-white shadow-sm"
                />
                <IconChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* FLOATING CARD DROPDOWN */}
              <div
                className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-xl border border-slate-200/60 shadow-lg shadow-slate-200/50 overflow-hidden transition-all duration-200 origin-top-right ${
                  profileOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
                style={{ zIndex: 9999 }}
              >
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900 leading-none">
                    Ruben George
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    rubengeo@gmail.com
                  </p>
                </div>
                <div className="py-1.5">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <IconUser className="w-4 h-4 text-slate-400" /> Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                    <IconSettings className="w-4 h-4 text-slate-400" /> Settings
                  </button>
                </div>
                <div className="border-t border-slate-100 py-1.5">
                  <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <IconLogout className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 backdrop-blur-md border-t border-slate-200/60 safe-area-inset">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map(({ name, Icon, path }) => (
            <button
              key={name}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-colors ${
                activeMenu === name ? "text-slate-900" : "text-slate-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{name}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default NavbarDashboard;
