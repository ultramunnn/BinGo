import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/styles";
import NavbarDashboard from "../components/NavbarDashboard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import SearchBar from "../components/Maps/SearchBar";
import ReviewModal from "../components/Maps/ReviewModal";
import { getBeachesForMap, getBeachDetail, submitReview } from "../services/beachService";
import { getStoredUser } from "../services/authService";

// ── Create divIcon with always-visible label (Leaflet native, not React) ──
function createBeachIcon(name, isActive = false) {
  const size = isActive ? [30, 45] : [24, 36];
  const anchor = isActive ? [15, 45] : [12, 36];
  return L.divIcon({
    className: `beach-marker${isActive ? " active" : ""}`,
    iconSize: size,
    iconAnchor: anchor,
    html: `
      <span class="beach-marker-label">${name}</span>
      <svg class="beach-marker-pin" viewBox="0 0 24 36">
        <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="${isActive ? "#1e293b" : "#dc2626"}"/>
        <circle cx="12" cy="11" r="4.5" fill="#fff"/>
      </svg>
    `,
  });
}


// ── Stable cluster icon factory (defined outside component to avoid re-creation) ──
const createClusterIcon = (cluster) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<div class="cluster-icon">${count}</div>`,
    className: "custom-cluster",
    iconSize: L.point(40, 40),
  });
};

// ── Memoized Beach Marker — only re-renders when selected state changes ──
const BeachMarker = React.memo(({ beach, isSelected, onClick }) => {
  const icon = useMemo(
    () => createBeachIcon(beach.name, isSelected),
    [beach.name, isSelected]
  );

  return (
    <Marker
      position={[beach.latitude, beach.longitude]}
      icon={icon}
      eventHandlers={{ click: onClick }}
    />
  );
});

// ── Helper: Fly to marker — smooth single animation ──
const FlyToMarker = ({ position, offsetVh = 0 }) => {
  const map = useMap();
  useEffect(() => {
    if (!position) return;
    const zoom = window.innerWidth < 1024 ? 13 : 14;

    if (offsetVh > 0 && window.innerWidth < 1024) {
      // On mobile with panel open: fly then offset in one smooth sequence
      map.once("moveend", () => {
        const offsetPx = (offsetVh / 100) * window.innerHeight * 0.35;
        map.panBy([0, offsetPx], { animate: true, duration: 0.4 });
      });
      map.flyTo(position, zoom, { duration: 1.2 });
    } else {
      map.flyTo(position, zoom, { duration: 1.2 });
    }
  }, [position, offsetVh]);
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

const MOBILE_MIN = 50;
const MOBILE_MAX = 85;

const Maps = () => {
  const [beaches, setBeaches] = useState([]);
  const [selectedBeachId, setSelectedBeachId] = useState(null);
  const [beachDetail, setBeachDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [mobileHeight, setMobileHeight] = useState(MOBILE_MIN);
  const [reviewOpen, setReviewOpen] = useState(false);
  const touchStart = useRef({ y: 0, h: 0 });
  const scrollRef = useRef(null);

  const user = getStoredUser();
  const panelOpen = selectedBeachId !== null;

  useEffect(() => {
    let cancelled = false;
    getBeachesForMap()
      .then((data) => {
        if (!cancelled) setBeaches(data);
      })
      .catch((err) => console.error("Failed to load beaches:", err));
    return () => { cancelled = true; };
  }, []);

  const handleMarkerClick = useCallback(async (beach) => {
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
  }, []);

  const handleSubmitReview = async ({ rating, message, image }) => {
    await submitReview(selectedBeachId, { rating, message, image });
    const detail = await getBeachDetail(selectedBeachId);
    setBeachDetail(detail);
  };

  const handleClose = useCallback(() => {
    setSelectedBeachId(null);
    setBeachDetail(null);
    setFlyTarget(null);
    setMobileHeight(MOBILE_MIN);
  }, []);

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

      <SearchBar beaches={beaches} onSelect={handleMarkerClick} />

      <MapContainer
        center={[-7.5, 111]}
        zoom={8}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={40}
          spiderfyOnMaxZoom
          showCoverageOnHover={false}
          disableClusteringAtZoom={14}
          iconCreateFunction={createClusterIcon}
        >
          {beaches.map((beach) => (
            <BeachMarker
              key={beach.id}
              beach={beach}
              isSelected={selectedBeachId === beach.id}
              onClick={() => handleMarkerClick(beach)}
            />
          ))}
        </MarkerClusterGroup>

        {flyTarget && <FlyToMarker position={flyTarget} offsetVh={panelOpen ? mobileHeight : 0} />}
      </MapContainer>

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
        <div className="lg:hidden flex justify-center pt-2.5 pb-1.5 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-500" />
        </div>

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
            <LoadingSkeleton variant="beachDetail" />
          ) : beachDetail ? (
            <>
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

              <div className="mx-5 border-t border-slate-100" />

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

                      {review.image_url && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <img
                            src={review.image_url}
                            alt="Review"
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}

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
