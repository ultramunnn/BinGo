import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import NavbarDashboard from "../components/NavbarDashboard";

// ── Fix Leaflet default icon ──
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ── Custom active marker icon ──
const activeIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "marker-active",
});

// ── Dummy beach data (Malang area) ──
const BEACH_PINS = [
  { id: "beach_001", name: "Pantai Balekambang", lat: -8.3947, lng: 112.5431 },
  { id: "beach_002", name: "Pantai Ngliyep", lat: -8.4012, lng: 112.5289 },
  { id: "beach_003", name: "Pantai Sendang Biru", lat: -8.4367, lng: 112.6742 },
  { id: "beach_004", name: "Pantai Goa Cina", lat: -8.4189, lng: 112.6103 },
  { id: "beach_005", name: "Pantai Bajulmati", lat: -8.4125, lng: 112.5821 },
  { id: "beach_006", name: "Pantai Teluk Asmara", lat: -8.4056, lng: 112.5612 },
];

// ── Mock detail data ──
const MOCK_BEACH_DATA = {
  id: "beach_001",
  name: "Pantai Balekambang, Malang",
  latitude: -8.3947,
  longitude: 112.5431,
  summary: {
    main_image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=400&fit=crop",
    average_rating: 4.2,
    total_reviews: 128,
  },
  reviews: [
    {
      review_id: "rev_992",
      user_name: "Rian Ardiansyah",
      user_avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
      user_rating: 4,
      comment:
        "Pantainya lumayan bersih di area depan, tapi pas bergeser ke dekat pepohonan masih banyak saset plastik kecil tersembunyi. AI narasinya akurat banget membantu!",
      evidence_image:
        "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=300&fit=crop",
      created_at: "2026-05-20",
    },
  ],
};

// ── Helper: Fly to marker ──
const FlyToMarker = ({ position }) => {
  const map = useMap();
  if (position) {
    map.flyTo(position, 14, { duration: 0.8 });
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

const Maps = () => {
  const [selectedBeachId, setSelectedBeachId] = useState(null);
  const [flyTarget, setFlyTarget] = useState(null);

  const data = MOCK_BEACH_DATA;
  const panelOpen = selectedBeachId !== null;

  const handleMarkerClick = (beach) => {
    setSelectedBeachId(beach.id);
    setFlyTarget([beach.lat, beach.lng]);
  };

  const handleClose = () => {
    setSelectedBeachId(null);
    setFlyTarget(null);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <NavbarDashboard />
      {/* ── Layer 1: Full Screen Map ── */}
      <MapContainer
        center={[-2, 118]}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {BEACH_PINS.map((beach) => (
          <Marker
            key={beach.id}
            position={[beach.lat, beach.lng]}
            icon={
              selectedBeachId === beach.id ? activeIcon : new L.Icon.Default()
            }
            eventHandlers={{ click: () => handleMarkerClick(beach) }}
          >
            <Tooltip permanent direction="right" offset={[10, -20]} className="bg-transparent! border-none! shadow-none! p-0!">
              <span className="font-bold text-xs text-slate-800 bg-white/80 backdrop-blur-xs px-2 py-1 rounded-md border border-slate-200/50 shadow-xs select-none">{beach.name}</span>
            </Tooltip>
          </Marker>
        ))}

        {flyTarget && <FlyToMarker position={flyTarget} />}
      </MapContainer>

      {/* ── Layer 2: Floating Aside Panel (Glassmorphism) ── */}
      <aside
        className={`fixed right-4 top-20 bottom-4 w-full max-w-md rounded-2xl bg-white/90 backdrop-blur-md border border-zinc-200/50 shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${
          panelOpen ? "translate-x-0" : "translate-x-[calc(100%+2rem)]"
        }`}
        style={{ zIndex: 9999 }}
      >
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <button
            onClick={handleClose}
            className="absolute top-4 right-6 z-10 w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-white/80 transition-colors cursor-pointer"
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
          {/* Hero Image */}
          <div className="relative">
            <img
              src={data.summary.main_image}
              alt={data.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white font-bold text-base leading-tight">
                {data.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={data.summary.average_rating} />
                <span className="text-white/80 text-[10px] font-mono">
                  {data.summary.average_rating} ({data.summary.total_reviews}{" "}
                  reviews)
                </span>
              </div>
            </div>
          </div>

          {/* Coordinate Info */}
          <div className="px-5 pb-4 mt-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">
                  Latitude
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {data.latitude}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block">
                  Longitude
                </span>
                <span className="text-xs font-mono font-bold text-slate-700">
                  {data.longitude}
                </span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="mx-5 border-t border-slate-100" />

          {/* Reviews Section */}
          <div className="px-5 py-4">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Ulasan Relawan
            </h4>

            {data.reviews.map((review) => (
              <div
                key={review.review_id}
                className="bg-slate-50 rounded-xl p-4 border border-slate-100"
              >
                {/* Reviewer Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={review.user_avatar}
                    alt={review.user_name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {review.user_name}
                    </p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.user_rating} size="w-3 h-3" />
                      <span className="text-[9px] text-slate-400 font-mono">
                        {review.created_at}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {review.comment}
                </p>

                {/* Evidence Image */}
                {review.evidence_image && (
                  <img
                    src={review.evidence_image}
                    alt="Bukti scan"
                    className="w-full h-32 object-cover rounded-lg border border-slate-200/60"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Panel Footer */}
        <div className="px-5 py-4 border-t border-slate-100 shrink-0">
          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl text-xs font-mono transition-all cursor-pointer">
            LIHAT SEMUA ULASAN
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Maps;
