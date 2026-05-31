export const FOCUS_W = 64;
export const FOCUS_H = 78;

export const QUESTION_POOL = {
  hardness: {
    question: "Bagaimana tekstur atau kekerasan sampah ini?",
    options: ["Keras / Kaku", "Lunak / Fleksibel / Lemas"],
  },
  clean: {
    question: "Apakah kondisi permukaan sampahnya bersih?",
    options: ["Bersih", "Kotor (Ada pasir/lumut/sisa makanan)"],
  },
  dry: {
    question: "Bagaimana kondisi kelembaban sampah saat ini?",
    options: ["Kering", "Basah / Lembab / Berair"],
  },
  container: {
    question: "Apakah sampah ini berbentuk wadah atau kemasan?",
    options: ["Ya (Botol/Cup/Kaleng/Toples)", "Bukan Wadah"],
  },
  multilayer: {
    question: "Apakah plastiknya terdiri dari banyak lapisan (berkilap)?",
    hint: "Contoh: Saset kopi, bungkus snack, bungkus mi instan",
    options: ["Ya (Multi-layer / Saset)", "Tidak (Single-layer / Kresek / Botol)"],
  },
  foam: {
    question: "Apakah sampah plastik ini termasuk jenis busa/foam?",
    hint: "Contoh: Styrofoam wadah makanan, gabus pelindung",
    options: ["Ya (Styrofoam / Busa)", "Bukan Foam"],
  },
  small_item: {
    question: "Seberapa besar ukuran makro dari sampah ini?",
    options: ["Sangat Kecil (< 2.5 cm)", "Ukuran Normal / Besar"],
  },
  hazardous: {
    question: "Apakah sampah ini termasuk kategori berbahaya (B3)?",
    hint: "Contoh: Sampah medis, kaleng aerosol, bekas bahan kimia",
    options: ["Ya (Berbahaya / Medis / Kimia)", "Aman / Sampah Umum"],
  },
  fragment: {
    question: "Apakah bentuk sampahnya berupa hancuran atau serpihan?",
    options: ["Ya (Serpihan / Pecahan)", "Utuh / Masih Berbentuk Objek"],
  },
};

export const MATERIAL_RULES = {
  PLASTIC: ["hardness", "clean", "dry", "container", "multilayer", "foam", "small_item", "hazardous"],
  PAPER: ["clean", "dry", "fragment"],
  METAL: ["clean", "container", "fragment", "small_item", "hazardous"],
  GLASS: ["clean", "fragment", "container", "small_item"],
  TEXTILE: ["clean", "dry", "fragment", "hazardous"],
};

// ── Leaderboard Data ──
export const leaderboardUsers = [
  { name: 'Lilyonetw...', score: '146 Scan', img: 'https://i.pravatar.cc/150?u=lily', rank: 1 },
  { name: 'Josheleve...', score: '105 Scan', img: 'https://i.pravatar.cc/150?u=josh', rank: 2 },
  { name: 'Herotaylo...', score: '99 Scan', img: 'https://i.pravatar.cc/150?u=hero', rank: 3 },
  { name: 'Adityawij...', score: '87 Scan', img: 'https://i.pravatar.cc/150?u=adi', rank: 4 },
  { name: 'Putrihalo...', score: '76 Scan', img: 'https://i.pravatar.cc/150?u=putri', rank: 5 },
  { name: 'Budisant...', score: '71 Scan', img: 'https://i.pravatar.cc/150?u=budi', rank: 6 },
  { name: 'Sarinahlo...', score: '65 Scan', img: 'https://i.pravatar.cc/150?u=sari', rank: 7 },
  { name: 'Fajarudd...', score: '58 Scan', img: 'https://i.pravatar.cc/150?u=fajar', rank: 8 },
  { name: 'Dewilest...', score: '52 Scan', img: 'https://i.pravatar.cc/150?u=dewi', rank: 9 },
  { name: 'Rizkypra...', score: '47 Scan', img: 'https://i.pravatar.cc/150?u=rizky', rank: 10 },
];

export const leaderboardBeaches = [
  { name: 'Pantai Kuta', score: '98% Bersih', rank: 1 },
  { name: 'Pantai Pandawa', score: '92% Bersih', rank: 2 },
  { name: 'Pantai Sanur', score: '85% Bersih', rank: 3 },
  { name: 'Pantai Jimbaran', score: '82% Bersih', rank: 4 },
  { name: 'Pantai Nusa Dua', score: '79% Bersih', rank: 5 },
  { name: 'Pantai Seminyak', score: '75% Bersih', rank: 6 },
  { name: 'Pantai Canggu', score: '71% Bersih', rank: 7 },
  { name: 'Pantai Lovina', score: '68% Bersih', rank: 8 },
  { name: 'Pantai Amed', score: '64% Bersih', rank: 9 },
  { name: 'Pantai Padang', score: '60% Bersih', rank: 10 },
];

// ── Pie Chart Data ──
export const pieData = [
  { name: "Plastik", value: 42, color: "#0f172a" },
  { name: "Organik", value: 28, color: "#64748b" },
  { name: "Logam", value: 15, color: "#94a3b8" },
  { name: "Kaca", value: 10, color: "#cbd5e1" },
  { name: "Lainnya", value: 5, color: "#e2e8f0" },
];
