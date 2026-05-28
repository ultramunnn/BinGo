import React, { useState, useRef, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import { useSearchParams } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import NavbarDashboard from "../components/NavbarDashboard";
import { getAllBeaches, getBeachDetail, submitReview } from "../services/beachService";
import { getStoredUser } from "../services/authService";

// ── Red marker SVG ──
const RED_MARKER_SVG = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 36'%3E%3Cdefs%3E%3Cfilter id='s' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeDropShadow dx='0' dy='1' stdDeviation='1.5' flood-color='%23000' flood-opacity='.25'/%3E%3C/filter%3E%3C/defs%3E%3Cpath d='M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z' fill='%23dc2626' filter='url(%23s)'/%3E%3Ccircle cx='12' cy='11' r='4.5' fill='%23fff'/%3E%3C/svg%3E`;

// ── Default red pin icon ──
const defaultIcon = new L.Icon({
  iconUrl: RED_MARKER_SVG,
  iconSize: [24, 36],
  iconAnchor: [12, 36],
  tooltipAnchor: [0, -30],
});

// ── Active (selected) red pin icon — slightly larger ──
const activeIcon = new L.Icon({
  iconUrl: RED_MARKER_SVG,
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  tooltipAnchor: [0, -38],
});


// ── Helper: Fly to marker ──
const FlyToMarker = ({ position, offsetVh = 0 }) => {
  const map = useMap();
  if (position) {
    const zoom = window.innerWidth < 1024 ? 13 : 14;
    if (offsetVh > 0 && window.innerWidth < 1024) {
      map.flyTo(position, zoom, { duration: 0.8 });
      setTimeout(() => {
        const offsetPx = (offsetVh / 100) * window.innerHeight * 0.35;
        map.panBy([0, offsetPx], { animate: true, duration: 0.5 });
      }, 850);
    } else {
      map.flyTo(position, zoom, { duration: 0.8 });
    }
  }
  return null;
};

// ── Star rating renderer ──
const StarRating = ({ rating, size = "w-3.5 h-3.5" }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        className={`${size} ${i <= Math.round(rating) ? "text-amber-400" : "text-slate-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

// Fallback beach images (Unsplash, free to use)
const BEACH_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504681869696-d977211a5f4c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1468413253725-0d5181091126?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1484821582734-6c6c9a6c6c6c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=600&h=400&fit=crop",
];

function getBeachImage(beach, index = 0) {
  if (beach.image_url) return beach.image_url;
  return BEACH_FALLBACK_IMAGES[index % BEACH_FALLBACK_IMAGES.length];
}

const MOBILE_MIN = 50;
const MOBILE_MAX = 85;

// ── Review Modal ──
const ReviewModal = ({ open, onClose, beachName, onSubmit, user }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (image) URL.revokeObjectURL(image.url);
    setImage({ file, url: URL.createObjectURL(file) });
    e.target.value = "";
  };

  const removeImage = () => {
    if (image) URL.revokeObjectURL(image.url);
    setImage(null);
  };

  const handleSubmit = async () => {
    if (!rating || !text.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ rating, message: text.trim(), image: image?.file });
      setRating(0);
      setText("");
      removeImage();
      onClose();
    } catch (err) {
      alert(err.message || "Gagal mengirim ulasan");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      {/* Dimmed overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" />
      {/* Modal card */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-800">{beachName}</h3>
        </div>

        {/* Body */}
        <div className="px-5 py-4 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
          {/* User identity */}
          <div className="flex items-center gap-3">
            <img
              src={user?.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name || "User")}&background=0f172a&color=fff`}
              alt="Avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
            <div>
              <p className="text-xs font-bold text-slate-800">{user?.full_name || "User"}</p>
              <p className="text-[10px] text-slate-400">Ulasan publik</p>
            </div>
          </div>

          {/* Star rating */}
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(i)}
                className="cursor-pointer p-0.5 transition-transform hover:scale-110"
              >
                <svg
                  className="w-8 h-8 transition-colors"
                  fill={(hover || rating) >= i ? "#f59e0b" : "#e2e8f0"}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          {/* Text area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Bagikan pengalaman Anda tentang tempat ini..."
            rows={4}
            className="w-full resize-none border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-400 transition-colors"
          />

          {/* Image preview */}
          {image && (
            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-200">
              <img src={image.url} alt="Preview" className="w-full h-full object-cover" />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 text-white cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Upload button */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" />
            </svg>
            Tambahkan foto
          </button>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={!rating || !text.trim() || submitting}
            className="px-5 py-2 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            {submitting ? "Mengirim..." : "Posting"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Maps = () => {
  const [searchParams] = useSearchParams();
  const [beaches, setBeaches] = useState([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedBeachId, setSelectedBeachId] = useState(null);
  const [beachDetail, setBeachDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [mobileHeight, setMobileHeight] = useState(MOBILE_MIN);
  const [reviewOpen, setReviewOpen] = useState(false);
  const touchStart = useRef({ y: 0, h: 0 });
  const scrollRef = useRef(null);
  const searchRef = useRef(null);

  const user = getStoredUser();
  const panelOpen = selectedBeachId !== null;

  const filteredBeaches = searchQuery.trim()
    ? beaches.filter((b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : beaches;

  // Fetch all beaches on mount
  useEffect(() => {
    getAllBeaches()
      .then(setBeaches)
      .catch((err) => console.error("Failed to load beaches:", err));
  }, []);

  // Sync search from URL params (from NavbarDashboard search)
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
      // Auto-fly to first match
      const match = beaches.find((b) =>
        b.name.toLowerCase().includes(q.toLowerCase())
      );
      if (match) {
        handleMarkerClick(match);
      }
    }
  }, [searchParams, beaches]);

  const handleMarkerClick = async (beach) => {
    setSelectedBeachId(beach.id);
    setFlyTarget([beach.latitude, beach.longitude]);
    setLoadingDetail(true);
    try {
      const detail = await getBeachDetail(beach.id);
      setBeachDetail(detail);
    } catch (err) {
      console.error("Failed to load beach detail:", err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSubmitReview = async ({ rating, message, image }) => {
    await submitReview(selectedBeachId, { rating, message, image });
    // Refresh detail after submit
    const detail = await getBeachDetail(selectedBeachId);
    setBeachDetail(detail);
  };
  
  const handleClose = () => {
    setSelectedBeachId(null);
    setBeachDetail(null);
    setFlyTarget(null);
    setMobileHeight(MOBILE_MIN);
  };

  const onTouchStart = useCallback((e) => {
    e.stopPropagation();
    touchStart.current = { y: e.touches[0].clientY, h: (mobileHeight / 100) * window.innerHeight };
  }, [mobileHeight]);

  const onTouchMove = useCallback((e) => {
    e.stopPropagation();
    const dy = touchStart.current.y - e.touches[0].clientY;
    const newH = Math.max((MOBILE_MIN / 100) * window.innerHeight, Math.min((MOBILE_MAX / 100) * window.innerHeight, touchStart.current.h + dy));
    const scroll = scrollRef.current;
    if (dy < 0 && scroll && scroll.scrollTop > 0) return;
    if (dy > 0 && (newH / window.innerHeight) * 100 >= MOBILE_MAX) return;
    if (dy < 0 && (newH / window.innerHeight) * 100 <= MOBILE_MIN) return;
    setDragging(true);
    setMobileHeight((newH / window.innerHeight) * 100);
  }, []);

  const onTouchEnd = useCallback((e) => {
    e.stopPropagation();
    setDragging(false);
  }, []);

  // Prevent body scroll on mobile when panel is open
  React.useEffect(() => {
    if (panelOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
    document.body.style.overflow = "";
  }, [panelOpen]);


  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <NavbarDashboard />

      {/* ── Search Bar ── */}
      <div className="absolute top-18 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
        <div className="relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pantai..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/90 backdrop-blur-md border border-slate-200/50 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-slate-400 shadow-lg transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
            >
              <svg className="w-3 h-3 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
        {/* Search results dropdown */}
        {searchQuery.trim() && filteredBeaches.length > 0 && (
          <div className="mt-1 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200/50 max-h-60 overflow-y-auto">
            {filteredBeaches.slice(0, 10).map((beach) => (
              <button
                key={beach.id}
                onClick={() => {
                  handleMarkerClick(beach);
                  setSearchQuery("");
                }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5 text-red-500 shrink-0" viewBox="0 0 24 36" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" />
                </svg>
                <span className="truncate">{beach.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Layer 1: Full Screen Map ── */}
      <MapContainer
        center={[-2, 118]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution=""
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {filteredBeaches.map((beach) => (
          <Marker
            key={beach.id}
            position={[beach.latitude, beach.longitude]}
            icon={
              selectedBeachId === beach.id ? activeIcon : defaultIcon
            }
            eventHandlers={{ click: () => handleMarkerClick(beach) }}
          >
            <Tooltip permanent direction="right" offset={[10, -20]} className="bg-transparent! border-none! shadow-none! p-0!">
              <span className="font-bold text-xs text-slate-800 bg-white/80 backdrop-blur-xs px-2 py-1 rounded-md border border-slate-200/50 shadow-xs select-none">{beach.name}</span>
            </Tooltip>
          </Marker>
        ))}

        {flyTarget && <FlyToMarker position={flyTarget} offsetVh={panelOpen ? mobileHeight : 0} />}
      </MapContainer>

      {/* ── Layer 2: Floating Aside Panel ── */}
      <aside
        className={`
          bg-white/90 backdrop-blur-md border-zinc-200/50 shadow-2xl flex flex-col overflow-hidden
          lg:w-full lg:max-w-md lg:rounded-md lg:border
          lg:fixed lg:right-4 lg:top-20 lg:bottom-4
          ${panelOpen ? "lg:translate-x-0" : "lg:translate-x-[calc(100%+2rem)]"}
          fixed bottom-0 left-0 right-0 lg:left-auto rounded-t-2xl border-t border-x
          ${panelOpen ? "translate-y-0" : "translate-y-full"}
          ${!dragging ? "transition-transform duration-300 ease-in-out" : ""}
        `}
        style={{
          zIndex: 88,
          ...(typeof window !== "undefined" && window.innerWidth < 1024
            ? { height: `${panelOpen ? mobileHeight : 0}vh` }
            : {}),
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag Handle (mobile only) */}
        <div className="lg:hidden flex justify-center pt-2.5 pb-1.5 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-500" />
        </div>

        {/* Scrollable Content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-7 right-1 lg:right-6 lg:top-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-white/80 transition-colors cursor-pointer"
            aria-label="Tutup panel"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          {loadingDetail ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
            </div>
          ) : beachDetail ? (
            <>
              {/* Hero Image */}
              <div className="relative">
                <img
                  src={beachDetail.image_url || BEACH_FALLBACK_IMAGES[0]}
                  alt={beachDetail.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white font-bold text-base leading-tight">
                    {beachDetail.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating rating={beachDetail.average_rating || 0} />
                    <span className="text-white/80 text-[10px] font-mono">
                      {beachDetail.average_rating?.toFixed(1) || "0.0"} ({beachDetail.total_reviews || 0}{" "}
                      ulasan)
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Info */}
              <div className="px-5 pb-4 mt-4 flex flex-col gap-1.5">
                <button
                  onClick={() => navigator.clipboard.writeText(`${beachDetail.latitude}, ${beachDetail.longitude}`)}
                  className="group w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
                >
                  <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 2v4" /><path d="M12 18v4" /><path d="M2 12h4" /><path d="M18 12h4" />
                  </svg>
                  <span className="flex-1 text-xs font-mono text-slate-700">{beachDetail.latitude}, {beachDetail.longitude}</span>
                  <span className="relative shrink-0">
                    <svg className="w-3.5 h-3.5 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    <span className="pointer-events-none absolute -top-8 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-white bg-slate-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      Salin koordinat
                    </span>
                  </span>
                </button>
                {beachDetail.address && (
                  <button
                    onClick={() => navigator.clipboard.writeText(beachDetail.address)}
                    className="group w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
                  >
                    <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="flex-1 text-xs text-slate-600 leading-relaxed">{beachDetail.address}</span>
                    <span className="relative shrink-0">
                      <svg className="w-3.5 h-3.5 text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      <span className="pointer-events-none absolute -top-8 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-white bg-slate-900 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        Salin alamat
                      </span>
                    </span>
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="mx-5 border-t border-slate-100" />

              {/* Reviews Section */}
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Ulasan Relawan
                  </h4>
                  {user && (
                    <button
                      onClick={() => setReviewOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-semibold transition-colors cursor-pointer"
                    >
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
                      </svg>
                      Tulis Ulasan
                    </button>
                  )}
                </div>

                {beachDetail.reviews?.length > 0 ? (
                  beachDetail.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-3"
                    >
                      {/* Reviewer Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={review.user_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name || "User")}&background=0f172a&color=fff`}
                          alt={review.user_name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {review.user_name || "User"}
                          </p>
                          <div className="flex items-center gap-2">
                            <StarRating rating={review.rating} size="w-3 h-3" />
                            <span className="text-[9px] text-slate-400 font-mono">
                              {new Date(review.created_at).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Review Image */}
                      {review.image_url && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <img
                            src={review.image_url}
                            alt="Review"
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}

                      {/* Comment */}
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {review.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">Belum ada ulasan</p>
                )}
              </div>
            </>
          ) : null}
        </div>
      </aside>

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        beachName={beachDetail?.name || ""}
        onSubmit={handleSubmitReview}
        user={user}
      />
    </div>
  );
};

export default Maps;
