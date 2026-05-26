# Dokumentasi API - BinGo AI Orchestrator

Dokumen ini menjelaskan cara menggunakan endpoint API dari `api_final_ai.py`. API ini berfungsi sebagai *middleware* atau *orchestrator* yang menghubungkan Model Computer Vision (CV), Model Machine Learning Tabular (ML), dan Generative AI (Gemini).

## Base URL
Saat dijalankan secara lokal: `http://localhost:8000`

---

## 1. Endpoint: `/get_questionnaire`

Endpoint ini mengembalikan daftar pertanyaan kuesioner dinamis berdasarkan kategori material sampah. Digunakan oleh Frontend untuk me-render form UI secara dinamis.

- **Method:** `GET`
- **URL:** `/get_questionnaire`
- **Query Parameter:**
  - `category` (string, wajib): Kategori material sampah (contoh: `plastic`, `paper`, `glass`, `metal`, `textile`).

### Contoh Request (CURL)
```bash
curl -X GET "http://localhost:8000/get_questionnaire?category=plastic"
```

### Contoh Response (JSON)
```json
{
  "category": "plastic",
  "questions": [
    {
      "field": "is_clean",
      "label": "Apakah sampah dalam kondisi bersih?",
      "type": "radio",
      "options": ["Unknown", "Yes", "No"]
    },
    {
      "field": "is_dry",
      "label": "Apakah sampah dalam kondisi kering?",
      "type": "radio",
      "options": ["Unknown", "Yes", "No"]
    },
    {
      "field": "Hardness",
      "label": "Bagaimana tekstur plastik ini?",
      "type": "radio",
      "options": ["Unknown", "Hard", "Flexible"]
    },
    {
      "field": "is_container",
      "label": "Apakah plastik ini berupa botol/wadah?",
      "type": "radio",
      "options": ["Unknown", "Yes", "No"]
    }
  ]
}
```

---

## 2. Endpoint: `/predict_hybrid`

Endpoint utama untuk memproses gambar sampah beserta data kondisi fisiknya, dan mengembalikan hasil prediksi akhir beserta rekomendasi daur ulang.

- **Method:** `POST`
- **URL:** `/predict_hybrid`
- **Content-Type:** `multipart/form-data`

### Parameter (Form Data)
| Parameter | Tipe | Wajib | Default | Keterangan |
| :--- | :--- | :---: | :--- | :--- |
| `file` | File | ✅ | - | Gambar sampah yang akan dianalisis |
| `Hardness` | String | ❌ | `"Unknown"` | `"Unknown"`, `"Hard"`, atau `"Flexible"` |
| `is_multilayer` | String | ❌ | `"Unknown"` | `"Unknown"`, `"Yes"`, atau `"No"` |
| `is_dry` | String | ❌ | `"Unknown"` | `"Unknown"`, `"Yes"`, atau `"No"` |
| `is_clean` | String | ❌ | `"Unknown"` | `"Unknown"`, `"Yes"`, atau `"No"` |
| `is_container` | String | ❌ | `"Unknown"` | `"Unknown"`, `"Yes"`, atau `"No"` |
| `is_fragment` | String | ❌ | `"Unknown"` | `"Unknown"`, `"Yes"`, atau `"No"` |
| `is_hazardous` | String | ❌ | `"Unknown"` | `"Unknown"`, `"Yes"`, atau `"No"` |
| `is_foam` | String | ❌ | `"Unknown"` | `"Unknown"`, `"Yes"`, atau `"No"` |
| `is_small_item`| String | ❌ | `"Unknown"` | `"Unknown"`, `"Yes"`, atau `"No"` |
| `generate_tips`| Boolean| ❌ | `true` | Set `false` jika tidak ingin menggunakan AI Gemini |

### Contoh Request (JavaScript / Fetch)
```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("Hardness", "Hard");
formData.append("is_clean", "Yes");
formData.append("generate_tips", "true"); // bisa dikirim sebagai string

fetch("http://localhost:8000/predict_hybrid", {
  method: "POST",
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### Contoh Response (JSON)
```json
{
  "predicted_material": "plastic",
  "cv_confidence": 0.985,
  "recyclable": "Yes",
  "treatment_method": "Recycle Class A",
  "ml_confidence": {
    "recyclable": 0.92,
    "treatment": 0.88
  },
  "ai_recommendation": "Bilas botol plastik Anda dan remas untuk menghemat ruang tempat pembuangan!"
}
```

---

## Catatan Environment Variable (.env)
Pastikan file `.env` sudah di-set untuk Gemini AI:
```env
GEMINI_API_KEY=kunci_api_gemini_anda_disini
```

## Dependensi
Sebelum menjalankan, pastikan modul ter-install:
```bash
pip install fastapi uvicorn pydantic python-dotenv google-generativeai python-multipart httpx
```
