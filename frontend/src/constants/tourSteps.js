import {
  Camera,
  ScanLine,
  ClipboardList,
  PieChart,
  Trophy,
  MapPin,
  Star,
} from "lucide-react";

/**
 * Onboarding tour steps for the Dashboard.
 * Each step targets a DOM element via `target` (CSS selector)
 * and provides content rendered inside the custom TourTooltip.
 */
const TOUR_STEPS = [
  {
    target: '[data-tour="scanner"]',
    title: "Pindai Objek Sampah",
    description:
      "Arahkan kamera ke sampah yang ingin kamu identifikasi. Sistem AI kami akan mengklasifikasikan jenis material secara otomatis.",
    icon: Camera,
    iconColor: "text-cyan-600",
    iconBg: "bg-cyan-50",
  },
  {
    target: '[data-tour="beach-badge"]',
    title: "Deteksi Pantai Terdekat",
    description:
      "Badge ini menunjukkan status lokasi kamu. Hijau artinya kamu berada di dekat pantai dan bisa langsung scan. Merah artinya di luar radius 1 km dari pantai.",
    icon: MapPin,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
  },
  {
    target: '[data-tour="control-bar"]',
    title: "Kontrol Pemindai",
    description:
      "Gunakan tombol shutter untuk mengambil foto, unggah gambar dari galeri, atau balik kamera. Semua dalam genggamanmu.",
    icon: ScanLine,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
  },
  {
    target: '[data-tour="result-console"]',
    title: "Hasil Analisis",
    description:
      "Di sini kamu akan melihat jenis sampah, tingkat kepercayaan, apakah bisa didaur ulang, dan rekomendasi penanganan dari AI.",
    icon: ClipboardList,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
  },
  {
    target: '[data-tour="beach-review"]',
    title: "Ulas Pantai",
    description:
      "Setelah scan, tombol ini akan muncul jika sampah terdeteksi berada di area pantai. Kamu bisa memberikan ulasan dan rating untuk pantai tersebut.",
    icon: Star,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
  },
  {
    target: '[data-tour="pie-chart"]',
    title: "Statistik Daur Ulang",
    description:
      "Pantau kontribusi kamu dalam bentuk grafik distribusi. Lihat detail setiap scan dan lacak progres daur ulangmu.",
    icon: PieChart,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-50",
  },
  {
    target: '[data-tour="leaderboard"]',
    title: "Papan Peringkat",
    description:
      "Lihat peringkatmu sebagai relawan dan temukan pantai terbersih. Terus scan untuk naik peringkat dan jadi yang terdepan!",
    icon: Trophy,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-50",
  },
];

export default TOUR_STEPS;
