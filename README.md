# BinGo -- Your AI Lens for a Cleaner Beach

BinGo adalah aplikasi web full-stack yang menggunakan computer vision dan machine learning untuk mengidentifikasi serta mengklasifikasikan limbah pantai. Pengguna memotret item sampah, sistem mengklasifikasikan jenis material melalui model ONNX, memprediksi daur ulang dan metode perlakuan melalui model ML tabular, serta menghasilkan rekomendasi penanganan berbasis AI menggunakan LLM (Google Gemini dengan fallback Groq).

Aplikasi ini juga menyediakan direktori pantai dengan data dari OpenStreetMap, sistem ulasan pengguna, papan peringkat, dan konten edukasi terkait pengelolaan limbah.

---

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Teknologi](#teknologi)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Konversi Model ONNX](#konversi-model-onnx)
- [Integrasi API Gemini](#integrasi-api-gemini)
- [Deployment Self-Hosted](#deployment-self-hosted)
- [Dokumentasi API](#dokumentasi-api)
- [Struktur Database](#struktur-database)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## Fitur Utama

### Sistem Autentikasi
- Registrasi dan login dengan enkripsi bcrypt
- Autentikasi berbasis JWT dengan blacklist token untuk logout
- Alur reset password melalui email (Nodemailer dengan SMTP)
- Manajemen profil (nama, unggah foto ke Supabase Storage)
- Perubahan password dengan verifikasi password saat ini

### Pipeline Klasifikasi Sampah
- Tahap 1: Pre-klasifikasi gambar melalui model CV (mengembalikan kategori material + confidence)
- Tahap 2: Generasi kuesioner dinamis berdasarkan kategori material (plastik, kertas, kaca, logam, tekstil)
- Tahap 3: Orkestrasi scan penuh -- inferensi CV + prediksi ML tabular + generasi rekomendasi LLM
- Penegakan threshold confidence (menolak jika confidence CV < 30%)
- Deteksi pantai terdekat secara otomatis dalam radius 1 km (jarak haversine)
- Geolokasi GPS + reverse geocoding untuk nama lokasi
- Riwayat scan dengan paginasi, feed khusus pengguna dan publik

### Direktori Pantai
- Populasi otomatis dari OpenStreetMap Nominatim (pantai Jawa Timur, 16 kueri pencarian)
- Gambar pantai dari Wikimedia Commons
- Kueri bounding-box untuk filter viewport peta
- Ulasan pengguna dengan rating (1-5 bintang), pesan, dan unggahan foto opsional
- Perhitungan rating rata-rata per pantai

### Papan Peringkat
- 10 pengguna teratas berdasarkan jumlah scan
- 10 pantai teratas berdasarkan rating rata-rata
- Peringkat pengguna saat ini (jika terautentikasi)

### Konten Edukasi
- Integrasi artikel Wikipedia dengan 6 topik terkait limbah
- Pengambilan artikel dengan caching (TTL 5 menit)

---

## Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Dashboard │  │   Maps   │  │ History  │  │ Articles │            │ 
│  │  (Scan)   │  │ (Pantai) │  │ (Riwayat)│  │ (Edukasi)│            │
│  └─────┬─────┘  └─────┬────┘  └─────┬────┘  └─────┬────┘            │
│        └───────────────┴─────────────┴─────────────┘                │
│                              │ HTTP/REST                            │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                        BACKEND (Express + TypeScript)               │
│                              │                                      │
│  ┌───────────────────────────┴───────────────────────────────┐      │
│  │                    API Gateway (Express)                   │     │
│  │  /api/auth/*    /api/scans/*    /api/beaches/*            │      │
│  └───────────────────────────┬───────────────────────────────┘      │
│                              │                                      │
│  ┌───────────────────────────┴───────────────────────────────┐      │
│  │                   Service Layer                           │      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │       │
│  │  │    Auth     │  │    Scan     │  │   Beach     │       │       │
│  │  │  Service    │  │  Service    │  │  Service    │       │       │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │       │
│  │         │                │                │               │      │
│  │  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐       │       │
│  │  │    JWT      │  │     ML      │  │    OSM      │       │       │
│  │  │  Service    │  │  Service    │  │  Nominatim  │       │       │
│  │  └─────────────┘  └──────┬──────┘  └─────────────┘       │       │
│  │                          │                                │      │
│  │                   ┌──────┴──────┐                         │      │
│  │                   │  Inference  │                         │      │
│  │                   │  Service    │                         │      │
│  │                   └──────┬──────┘                         │      │
│  └──────────────────────────┼────────────────────────────────┘      │
│                             │                                       │
│  ┌──────────────────────────┴────────────────────────────────┐      │
│  │                  ML/AI Layer                              │      │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │      │
│  │  │  CV Model    │  │ Tabular Model│  │   LLM API    │     │      │
│  │  │  (ONNX)      │  │   (ONNX)     │  │  (Gemini/    │     │      │
│  │  │  EfficientNet│  │  Recyclability│  │   Groq)      │    │      │
│  │  │  5 classes   │  │  + Treatment │  │  Rekomendasi │     │      │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │      │
│  └───────────────────────────────────────────────────────────┘      │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────┐      │
│  │              Database (Supabase/PostgreSQL)               │      │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │      │
│  │  │  Users   │  │  Scans   │  │  Beaches │  │ Reviews  │   │      │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │      │
│  └───────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Teknologi

### Frontend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| React | 19.2.5 | Framework UI |
| Vite | 8.0.10 | Build tool dan dev server |
| Tailwind CSS | 4.2.4 | Utility-first CSS framework |
| React Router DOM | 7.15.0 | Client-side routing |
| Axios | 1.16.0 | HTTP client |
| Leaflet | 1.9.4 | Peta interaktif |
| React Leaflet | 5.0.0 | Integrasi Leaflet dengan React |
| GSAP | 3.15.0 | Animasi performa tinggi |
| Framer Motion | 12.38.0 | Animasi deklaratif |
| Recharts | 3.8.1 | Visualisasi data |
| Lucide React | 1.14.0 | Ikon |

### Backend

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| Node.js | >= 18.0.0 | Runtime |
| TypeScript | 6.0.3 | Bahasa pemrograman |
| Express | 5.2.1 | Framework HTTP |
| Supabase JS | 2.105.3 | Database dan storage |
| ONNX Runtime Node | 1.26.0 | Inferensi model ML |
| Sharp | 0.34.5 | Pemrosesan gambar |
| Google GenAI | 2.6.0 | API Gemini untuk rekomendasi |
| Groq SDK | 1.2.0 | Fallback LLM |
| JWT | 9.0.3 | Autentikasi token |
| bcrypt | 6.0.0 | Enkripsi password |
| Nodemailer | 8.0.9 | Pengiriman email |
| Multer | 2.1.1 | Unggah file |
| Swagger | 6.2.8 | Dokumentasi API |

---

## Instalasi

### Prasyarat

- Node.js >= 18.0.0
- npm atau yarn
- Akun Supabase (untuk database dan storage)
- API Key Google Gemini atau Groq
- Akun SMTP (Gmail App Password atau layanan email lainnya)

### 1. Kloning Repositori

```bash
git clone https://github.com/username/BinGo.git
cd BinGo
```

### 2. Instalasi Backend

```bash
cd backend
npm install
```

Salin file environment dan konfigurasikan:

```bash
cp .env.example .env
```

Edit file `.env` dengan konfigurasi yang sesuai (lihat [Konfigurasi Environment](#konfigurasi-environment)).

Jalankan migrasi database:

```bash
npx supabase db push
```

Build dan jalankan:

```bash
npm run build
npm start
```

Server akan berjalan di `http://localhost:3000`.

Untuk mode development:

```bash
npm run dev
```

### 3. Instalasi Frontend

```bash
cd frontend
npm install
```

Jalankan development server:

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173` dengan proxy API ke backend.

Untuk production build:

```bash
npm run build
```

File statis akan dihasilkan di direktori `dist/`.

---

## Konfigurasi Environment

### Backend (.env)

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `PORT` | Port server backend | `3000` |
| `SUPABASE_URL` | URL proyek Supabase | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Kunci anon Supabase | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Kunci service role Supabase | `eyJ...` |
| `JWT_SECRET` | Rahasia untuk signing JWT | `random-64-char-hex` |
| `JWT_EXPIRES_IN` | Masa berlaku JWT | `7d` |
| `GEMINI_API_KEY` | Kunci API Google Gemini | `AIza...` |
| `GROQ_API_KEY` | Kunci API Groq (fallback) | `gsk_...` |
| `SMTP_SERVER` | Server SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Port SMTP | `465` |
| `SMTP_EMAIL` | Alamat email pengirim | `noreply@domain.com` |
| `SMTP_USERNAME` | Username SMTP | `noreply@domain.com` |
| `SMTP_PASSWORD` | Password SMTP (App Password) | `xxxx-xxxx-xxxx-xxxx` |
| `FRONTEND_URL` | URL frontend untuk link reset password | `https://domain.com` |

**Penting untuk SMTP_PASSWORD:** Jangan gunakan tanda kutip ganda di value. Tulis langsung passwordnya:

```
# Benar
SMTP_PASSWORD=edjk vnnc isac vohb

# Salah (akan menyebabkan autentikasi gagal)
SMTP_PASSWORD="edjk vnnc isac vohb"
```

### Frontend

Frontend menggunakan Vite, sehingga environment variable harus diawali dengan `VITE_`:

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `VITE_API_URL` | URL backend API | `/api` (di-proxy ke localhost:3000) |

---

## Konversi Model ONNX

BinGo menggunakan dua model ONNX untuk inferensi:

1. **Model CV** (`waste_classifier_v1.onnx`): Klasifikasi gambar berbasis EfficientNet
2. **Model Tabular** (`bingo_model.onnx`): Prediksi daur ulang dan metode perlakuan

### Pipeline Konversi

Model dikonversi dari format Keras (`.keras`) ke ONNX menggunakan skrip yang tersedia di `backend/models/convert_onnx/`.

#### Instalasi Dependensi Python

```bash
cd backend/models/convert_onnx
pip install tensorflow tf2onnx onnxruntime numpy scikit-learn
```

#### Konversi Model

```bash
python convert.py
```

Skrip ini akan:
1. Memuat model Keras dari path yang ditentukan
2. Mengonversi ke format ONNX menggunakan `tf2onnx`
3. Mengekspor label encoder dari pickle ke JSON
4. Menyimpan hasil di direktori `../onnx/` dan `../label/`

#### Verifikasi Model

```bash
python verify.py
```

Skrip ini menjalankan inferensi dengan data dummy untuk memverifikasi bahwa model ONNX berfungsi dengan benar.

### Spesifikasi Model CV

- **Arsitektur:** EfficientNet-based
- **Input:** Tensor float32 [1, 224, 224, 3] (RGB, nilai 0-255)
- **Output:** Tensor float32 [1, 5] (probabilitas softmax)
- **Kelas:** glass, metal, paper, plastic, textile
- **Preprocessing:** Resize ke 224x224 menggunakan Sharp

### Spesifikasi Model Tabular

- **Input:** 10 tensor terpisah:
  - `category` (encoded): Kategori material
  - `Hardness` (encoded): Tekstur plastik
  - `is_multilayer`: Apakah berlapis
  - `is_dry`: Apakah kering
  - `is_clean`: Apakah bersih
  - `is_container`: Apakah berupa wadah
  - `is_fragment`: Apakah pecahan
  - `is_hazardous`: Apakah berbahaya
  - `is_foam`: Apakah styrofoam
  - `is_small_item`: Apakah item kecil
- **Output:**
  - `output_recyclability`: Sigmoid (Yes/No)
  - `output_treatment`: Softmax (5 kelas perlakuan)

---

## Integrasi API Gemini

BinGo menggunakan Google Gemini sebagai LLM utama untuk menghasilkan rekomendasi penanganan sampah, dengan Groq sebagai fallback.

### Konfigurasi

1. Dapatkan API Key dari [Google AI Studio](https://aistudio.google.com/apikey)
2. Set environment variable `GEMINI_API_KEY` di file `.env`
3. (Opsional) Dapatkan API Key dari [Groq Console](https://console.groq.com) untuk fallback

### Mekanisme Fallback

Sistem mencoba beberapa model secara berurutan:

1. `gemini-2.5-flash` (prioritas utama)
2. `gemini-2.0-flash` (fallback 1)
3. `gemini-2.0-flash-lite` (fallback 2)
4. Groq `llama-3.3-70b-versatile` (fallback terakhir)

Jika semua model gagal, sistem tetap mengembalikan hasil klasifikasi tanpa rekomendasi LLM.

### Prompt Engineering

System prompt dikonfigurasi untuk:
- Menggunakan bahasa Indonesia
- Menghasilkan rekomendasi 3-4 kalimat
- Fokus pada cara penanganan yang aman dan praktis
- Menyertakan informasi tentang potensi daur ulang

---

## Deployment Self-Hosted

Panduan ini untuk perusahaan pengelola limbah dan organisasi lingkungan yang ingin mengimplementasikan infrastruktur BinGo secara mandiri.

### Arsitektur Deployment

```
┌─────────────────────────────────────────────────────────┐
│                    Production Environment               │
│                                                         │
│  ┌─────────────────┐     ┌─────────────────┐            │
│  │   Frontend      │     │    Backend      │            │
│  │   (Static)      │────>│   (Node.js)     │            │
│  │   Vercel/CDN    │     │   Railway/VPS   │            │
│  └─────────────────┘     └────────┬────────┘            │
│                                   │                     │
│                    ┌──────────────┼──────────────┐      │
│                    │              │              │      │
│              ┌─────┴─────┐  ┌────┴────┐  ┌─────┴─────┐  │
│              │  Supabase │  │  SMTP   │  │ Gemini/   │  │
│              │ (Database)│  │ (Email) │  │ Groq API  │  │
│              └───────────┘  └─────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Opsi Deployment

#### Opsi 1: Railway (Direkomendasikan untuk Prototyping)

1. Fork repositori ini
2. Buat akun di [Railway](https://railway.app)
3. Buat project baru dan hubungkan dengan repositori GitHub
4. Set environment variables di tab Variables
5. Railway akan otomatis build dan deploy

Konfigurasi Railway (`backend/railway.json`):

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3
  }
}
```

#### Opsi 2: VPS / Server Mandiri

**Prasyarat:**
- Server dengan Node.js >= 18.0.0
- Nginx atau Apache sebagai reverse proxy
- SSL certificate (Let's Encrypt)
- Domain atau subdomain

**Langkah-langkah:**

1. Kloning repositori di server:

```bash
git clone https://github.com/username/BinGo.git /var/www/bingo
cd /var/www/bingo/backend
```

2. Instal dependensi dan build:

```bash
npm install
npm run build
```

3. Konfigurasi environment:

```bash
cp .env.example .env
nano .env
```

4. Jalankan dengan PM2 (process manager):

```bash
npm install -g pm2
pm2 start dist/server.js --name bingo-backend
pm2 save
pm2 startup
```

5. Untuk frontend, build dan deploy ke CDN atau serve langsung:

```bash
cd ../frontend
npm install
npm run build
```

Salin isi `dist/` ke direktori web server atau deploy ke Vercel/Netlify.

#### Opsi 3: Docker

Buat `Dockerfile` di root backend:

```dockerfile
FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY models/ ./models/
COPY scripts/ ./scripts/

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

Build dan jalankan:

```bash
docker build -t bingo-backend .
docker run -p 3000:3000 --env-file .env bingo-backend
```

### Konfigurasi Supabase untuk Self-Hosted

1. Buat project baru di [Supabase](https://supabase.com)
2. Jalankan migrasi yang tersedia di `backend/supabase/migrations/`
3. Salin URL dan API keys ke file `.env`
4. Konfigurasi Storage bucket untuk unggahan gambar
5. Atur Row Level Security (RLS) sesuai kebutuhan organisasi

### Konfigurasi SMTP

Untuk Gmail:
1. Aktifkan 2-Factor Authentication
2. Buat App Password di pengaturan Google Account
3. Gunakan App Password sebagai `SMTP_PASSWORD`

Untuk layanan lain (SendGrid, Mailgun, dll):
1. Dapatkan kredensial SMTP dari penyedia
2. Update `SMTP_SERVER`, `SMTP_PORT`, `SMTP_EMAIL`, `SMTP_USERNAME`, `SMTP_PASSWORD`

---

## Dokumentasi API

Dokumentasi API tersedia secara interaktif melalui Swagger UI saat backend berjalan:

```
http://localhost:3000/api-docs
```

### Endpoint Utama

#### Autentikasi (`/api/auth/`)

| Method | Endpoint | Deskripsi | Autentikasi |
|--------|----------|-----------|-------------|
| POST | `/register` | Registrasi pengguna baru | Tidak |
| POST | `/login` | Login, mengembalikan JWT | Tidak |
| POST | `/logout` | Blacklist JWT | Ya |
| POST | `/reset-password` | Minta email reset password | Tidak |
| POST | `/change-password` | Selesaikan reset password | Tidak |
| GET | `/me` | Dapatkan profil pengguna | Ya |
| PUT | `/profile` | Perbarui profil | Ya |
| PUT | `/password` | Perbarui password | Ya |
| POST | `/photo` | Unggah foto profil | Ya |

#### Scan (`/api/scans/`)

| Method | Endpoint | Deskripsi | Autentikasi |
|--------|----------|-----------|-------------|
| POST | `/classify` | Pre-klasifikasi gambar (CV saja) | Ya |
| GET | `/questionnaire` | Dapatkan kuesioner untuk kategori | Tidak |
| POST | `/` | Scan penuh (gambar + GPS + kuesioner) | Ya |
| GET | `/me` | Riwayat scan pengguna | Ya |
| GET | `/` | Semua scan (publik) | Tidak |
| GET | `/leaderboard` | Data papan peringkat | Opsional |
| GET | `/:id` | Detail scan | Tidak |
| DELETE | `/:id` | Hapus scan sendiri | Ya |

#### Pantai (`/api/beaches/`)

| Method | Endpoint | Deskripsi | Autentikasi |
|--------|----------|-----------|-------------|
| GET | `/map` | Data minimal untuk marker peta | Tidak |
| GET | `/` | Semua pantai dengan rating | Tidak |
| GET | `/:id` | Detail pantai dengan ulasan | Tidak |
| POST | `/:id/reviews` | Kirim ulasan | Ya |
| DELETE | `/:id/reviews` | Hapus ulasan sendiri | Ya |

---

## Kontribusi

### Alur Kontribusi

1. Fork repositori ini
2. Buat branch fitur baru: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m "feat: tambah fitur X"`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request ke branch `main`

### Konvensi Commit

Gunakan format [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` untuk fitur baru
- `fix:` untuk perbaikan bug
- `docs:` untuk dokumentasi
- `style:` untuk formatting
- `refactor:` untuk refactoring
- `test:` untuk pengujian
- `chore:` untuk maintenance

### Pengembangan Lokal

1. Jalankan backend: `cd backend && npm run dev`
2. Jalankan frontend: `cd frontend && npm run dev`
3. Backend berjalan di `http://localhost:3000`
4. Frontend berjalan di `http://localhost:5173` dengan proxy ke backend

### Pengujian API

Gunakan Swagger UI untuk menguji endpoint:

```
http://localhost:3000/api-docs
```

---

## Lisensi

Proyek ini dikembangkan untuk tujuan akademik dan penelitian. Untuk penggunaan komersial atau implementasi skala besar, silakan hubungi tim pengembang.

---

## Kontak

Untuk pertanyaan, saran, atau kolaborasi:

- Email: bingoailenscleaner@gmail.com
- Repository: https://github.com/username/BinGo

---

## Acknowledgements

- OpenStreetMap untuk data geospasial pantai
- Wikimedia Commons untuk gambar pantai
- Wikipedia untuk konten edukasi
- Google Gemini dan Groq untuk kemampuan LLM
- Supabase untuk infrastruktur database dan storage
