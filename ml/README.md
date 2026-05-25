---
title: BinGo ML API
emoji: ♻️
colorFrom: green
colorTo: blue
sdk: docker
app_port: 7860
pinned: false
---

# BinGo ML API - Hybrid Intelligent Decision System

API untuk klasifikasi daur ulang berdasarkan material Computer Vision dan fitur kontekstual.

## Cara Menjalankan Secara Lokal
1. Install dependensi:
   ```bash
   pip install -r requirements.txt
   ```
2. Jalankan server:
   ```bash
   uvicorn api:app --reload
   ```
