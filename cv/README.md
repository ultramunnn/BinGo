# AI Klasifikasi Sampah (Waste Classification AI)

Proyek ini adalah aplikasi production-ready berbasis **FastAPI** dan **Gradio** untuk melakukan deployment model TensorFlow/Keras klasifikasi sampah. Aplikasi ini juga mengintegrasikan fitur **Generative AI (Gemini)** untuk memberikan tips daur ulang yang edukatif.

## Fitur Utama
- **REST API FastAPI**: Melayani endpoint `/predict` dan `/health`.
- **Frontend Gradio**: Antarmuka web interaktif yang intuitif.
- **Generative AI Integration**: Edukasi otomatis menggunakan API Google Gemini.
- **Dukungan Kustom**: Menyertakan contoh layer kustom (`CustomNormalization`) dan fungsi loss (`custom_loss`).
- **Skrip Pelatihan Kustom**: Contoh `training_example.py` menggunakan `tf.GradientTape` dengan integrasi TensorBoard.
- **Siap Deployment**: Konfigurasi lengkap siap dideploy ke Hugging Face Spaces atau server Antigravity Anda.

## Struktur Direktori
```
BinGo.CV/
│
├── app.py                   # Main FastAPI & mount Gradio
├── frontend.py              # Gradio UI dan integrasi Gemini
├── model_utils.py           # Utilitas model (Custom Layer, Loss, Preprocessing)
├── training_example.py      # Contoh custom training loop & TensorBoard
├── evaluation_example.py    # Contoh custom evaluation loop
├── requirements.txt         # Dependensi Python
├── .env.example             # Contoh file variabel lingkungan (environment variables)
├── README.md                # Dokumentasi proyek
├── logs/                    # Folder log TensorBoard
└── model/                   # Folder untuk menyimpan model .keras
    └── waste_classifier.keras # (Letakkan model TensorFlow Anda di sini)
```

## Persyaratan
- Python 3.9+
- API Key Google Gemini (opsional, namun disarankan untuk fitur tips AI)

## Cara Menginstal dan Menjalankan

### 1. Kloning dan Setup Lingkungan Virtual (Opsional namun Disarankan)
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 2. Instalasi Dependensi
```bash
pip install -r requirements.txt
```

### 3. Persiapkan Model
Pastikan Anda menempatkan file model Keras Anda dengan nama `waste_classifier.keras` di dalam folder `model/`.
```bash
# Pastikan jalurnya benar:
# model/waste_classifier.keras
```

### 4. Setup API Key Gemini (Untuk Fitur Edukasi)
1. Salin `.env.example` menjadi `.env`.
2. Dapatkan API Key dari [Google AI Studio](https://aistudio.google.com/).
3. Masukkan kunci API Anda ke dalam file `.env`:
   ```env
   GEMINI_API_KEY=KUNCI_RAHASIA_ANDA
   ```

### 5. Jalankan Server
Gunakan Uvicorn untuk menjalankan aplikasi:
```bash
uvicorn app:app --host 0.0.0.0 --port 7860 --reload
```
Atau jalankan file python secara langsung (jika ada blok `__main__`):
```bash
python app.py
```

### 6. Akses Aplikasi
- **UI Web Gradio**: `http://localhost:7860/gradio`
- **Dokumentasi API Swagger (FastAPI)**: `http://localhost:7860/docs`
- **Pengecekan Status Kesehatan**: `http://localhost:7860/health`

## Melihat Log TensorBoard
Jika Anda ingin melihat hasil log dari skrip pelatihan, jalankan:
```bash
tensorboard --logdir logs/fit
```
Lalu buka alamat localhost yang diberikan TensorBoard.

## Deployment ke Hugging Face Spaces
Proyek ini siap di-deploy langsung ke Hugging Face Spaces sebagai "Docker Space" atau "Gradio Space" menggunakan `app.py`. Cukup buat repositori HF Space, push kode ini, dan masukkan variabel `GEMINI_API_KEY` di pengaturan "Secrets" HF Space Anda.
