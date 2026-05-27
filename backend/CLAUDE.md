# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in this repository.

## Project Overview

BinGo ("Your AI Lens for a Cleaner Beach") — a beach waste classification app. Users take photos of beach waste, fill a questionnaire, and the AI classifies the waste type with recycling recommendations. Each scan is saved with auto-captured GPS coordinates. Users can browse and interact (rate/comment) with each other's scan history.

## Commands

All commands run from the `backend/` directory:

```bash
npm run dev        # Start dev server with auto-reload (nodemon + ts-node)
npm run build      # Compile TypeScript to dist/
npm start          # Run production build from dist/server.js
```

No test runner or linter is configured.

## Environment Setup

A `.env` file in `backend/` is required. See `backend/.env.example` for the template.

Required variables: `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `GEMINI_API_KEY`

## Architecture

Express MVC pattern in `backend/src/`:

- **Routes** → **Controllers** → **Services** → **Models** (Supabase data access) → **Types** (shared interfaces)
- **Middleware**: JWT auth (`authenticate`) in `src/middleware/auth.ts`, file upload (`multer`) in `src/middleware/upload.ts`
- **Models** export named functions (not classes) — follow this pattern for new models
- **Services** contain business logic and orchestrate inference calls
- **Docs**: OpenAPI spec is defined programmatically in TypeScript under `src/docs/`, not YAML files. Add new endpoint docs there.

---

## MANDATORY SCAN FLOW (Frontend Must Follow)

The scan process is a **3-step flow**. Users MUST complete all steps. Skipping questionnaire is NOT allowed.

```
Step 1: Upload Photo + GPS
   POST /api/scans/classify  (photo only)
   → Returns: { predicted_class, confidence, top_k }
   → Frontend now knows the waste category

Step 2: Fill Questionnaire
   GET /api/scans/questionnaire?category={predicted_class}
   → Returns: list of questions with field, label, type, options
   → Frontend renders radio buttons for user to answer

Step 3: Submit Full Scan
   POST /api/scans  (photo + GPS + questionnaire answers)
   → Returns: full classification result with AI recommendation
   → Result saved to database
```

### GPS Coordinates

Frontend MUST capture device GPS automatically (not manual input). Use browser Geolocation API or mobile location service. Send `latitude` and `longitude` as numbers in the request body.

### Questionnaire Rules

- **Base questions** (`is_clean`, `is_dry`) are **REQUIRED** for ALL categories. Request is rejected without them.
- **Category-specific questions** (e.g., `is_container`, `is_fragment`) depend on the detected category. These are optional but improve prediction accuracy.
- Questionnaire options are `Yes` / `No` (no "Unknown" for base questions).

---

## AI Pipeline: 3-Stage Decision Making

All inference runs **locally** in the Node.js backend using ONNX Runtime. No external Python services needed.

### Stage 1: Computer Vision (CV) — Image Classification

**File:** `src/services/inference.service.ts` → `classifyImage()`
**Model:** `models/onnx/waste_classifier.onnx` (EfficientNetB0, converted from Keras)
**Input:** Image buffer → resized to 224×224 RGB via `sharp`
**Output:** `predictedClass` (glass/metal/paper/plastic/textile) + `confidence` (0-1)

IMPORTANT: The ONNX model includes EfficientNet's `preprocess_input` inside the graph. Do NOT normalize pixel values — send raw [0,255] float values. The model handles rescaling, ImageNet mean subtraction, and std division internally.

### Stage 2: Tabular ML — Recyclability & Treatment Prediction

**File:** `src/services/inference.service.ts` → `predictTabular()`
**Model:** `models/onnx/bingo_model.onnx` (Hybrid Decision Model)
**Input:** 10 features encoded via `models/label_encoders.json`:
  - `category` (from CV), `Hardness`, `is_multilayer`, `is_dry`, `is_clean`, `is_container`, `is_fragment`, `is_hazardous`, `is_foam`, `is_small_item`
**Output:**
  - `recyclable`: Yes/No (sigmoid, threshold 0.5)
  - `treatment`: one of [Not Recycled, crush and melting, melt and pelletized, pulping, smelting and refining] (softmax, 5 classes)
  - Confidence scores for each

### Stage 3: Gemini LLM — User-Friendly Tips

**File:** `src/services/ml.service.ts` → `generateTips()`
**Input:** category + recyclable + treatment
**Output:** `ai_recommendation` — detailed practical tips in Indonesian (3 paragraphs, minimal 5 sentences)

Anti-hallucination measures:
- System instruction: only use provided data, no fabricated facts/numbers
- Temperature: 0.5
- Max output: 2000 tokens (thinking disabled for Gemini 2.5)
- Fallback models: gemini-2.5-flash → gemini-2.0-flash → gemini-2.0-flash-lite → Groq llama-3.3-70b-versatile
- Graceful failure: returns empty string if all models fail, scan still completes

### Feature Derivation (Unused — For Reference Only)

**File:** `src/utils/feature-derivation.ts`
Contains rule-based feature defaults per category. Currently NOT used in the pipeline — questionnaire is the source of truth for features.

---

## All API Endpoints

### Auth Routes (`/api/auth`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/auth/logout` | Yes | Invalidate token |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/auth/me` | Yes | Update profile |
| POST | `/api/auth/forgot-password` | No | Send reset email |
| POST | `/api/auth/reset-password` | No | Reset password with token |

### Scan Routes (`/api/scans`)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/scans/classify` | Yes | Pre-classify: upload photo only → get category + confidence |
| GET | `/api/scans/questionnaire` | No | Get questionnaire for a category (query: `?category=plastic`) |
| POST | `/api/scans` | Yes | Full scan: photo + GPS + questionnaire → classification result |
| GET | `/api/scans` | No | All scans (public feed, paginated) |
| GET | `/api/scans/me` | Yes | Current user's scan history |
| GET | `/api/scans/:id` | No | Single scan by ID |
| DELETE | `/api/scans/:id` | Yes | Delete own scan |

### POST /api/scans/classify (multipart/form-data)

Request: `photo` (image file, max 5MB)
Response:
```json
{
  "success": true,
  "data": {
    "predicted_class": "plastic",
    "confidence": 0.95,
    "top_k": [{"class": "plastic", "confidence": 0.95}, ...]
  }
}
```

### GET /api/scans/questionnaire?category=plastic

Response:
```json
{
  "success": true,
  "data": {
    "category": "plastic",
    "questions": [
      {"field": "is_clean", "label": "Apakah sampah dalam kondisi bersih?", "type": "radio", "options": ["Yes", "No"]},
      {"field": "is_dry", "label": "Apakah sampah dalam kondisi kering?", "type": "radio", "options": ["Yes", "No"]},
      {"field": "Hardness", "label": "Bagaimana tekstur plastik ini?", "type": "radio", "options": ["Unknown", "Hard", "Flexible"]},
      ...
    ]
  }
}
```

### POST /api/scans (multipart/form-data)

Request:
- `photo` (image file, required, max 5MB)
- `latitude` (number, required — auto-captured from device GPS)
- `longitude` (number, required — auto-captured from device GPS)
- `location_name` (string, optional)
- `is_clean` (boolean, **REQUIRED**)
- `is_dry` (boolean, **REQUIRED**)
- `Hardness`, `is_multilayer`, `is_container`, `is_fragment`, `is_hazardous`, `is_foam`, `is_small_item` (boolean, optional per category)

Response:
```json
{
  "success": true,
  "message": "Scan completed",
  "data": {
    "id": "uuid",
    "image_url": "https://...supabase.../scans/...",
    "waste_type": "plastic",
    "confidence": 0.95,
    "cv_confidence": 0.95,
    "latitude": -6.9175,
    "longitude": 107.6191,
    "location_name": "Pangandaran Beach",
    "recyclable": "Yes",
    "treatment": "melt and pelletized",
    "recyclable_confidence": 0.93,
    "treatment_confidence": 0.98,
    "ai_recommendation": "Cuci botol plastik sebelum dibuang...",
    "created_at": "2026-05-27T15:24:30Z"
  }
}
```

Error responses:
- 400: Missing photo, GPS, or required questionnaire fields
- 422: CV confidence too low (< 0.3)
- 502: ML inference failed

---

## Service Files Reference

| File | Responsibility |
|---|---|
| `src/services/inference.service.ts` | ONNX Runtime inference for CV and Tabular models |
| `src/services/ml.service.ts` | Orchestrator: CV → Tabular → Gemini tips + questionnaire logic |
| `src/services/classification.service.ts` | Upload image, build features, call ML, save to DB |
| `src/services/cv.service.ts` | Thin wrapper for CV inference (legacy, delegates to inference.service) |
| `src/services/auth.service.ts` | User auth, JWT, password reset |
| `src/services/jwt.service.ts` | JWT sign/verify |
| `src/services/storage.service.ts` | Supabase Storage upload (avatars, scans) |
| `src/controllers/classificationController.ts` | Request parsing, validation, response formatting |
| `src/controllers/authController.ts` | Auth request handling |
| `src/middleware/auth.ts` | JWT authentication middleware |
| `src/middleware/upload.ts` | Multer file upload middleware (memory storage, 5MB limit) |
| `src/utils/feature-derivation.ts` | Rule-based feature defaults (unused — for reference) |
| `src/models/classification.model.ts` | Supabase CRUD for classification_history |

## Model Files

| File | Description |
|---|---|
| `models/onnx/waste_classifier.onnx` | CV model (EfficientNetB0, 5 classes, includes preprocessing in graph) |
| `models/bingo_model.onnx` | Tabular model (recyclability + treatment prediction) |
| `models/label/label_encoders.json` | Label encoders for tabular model features |

---

## Database Schema

All tables use UUID primary keys. Timestamps use `TIMESTAMPTZ`. Single role: `user` only.

| Table | Columns |
|---|---|
| `users` | id, email, password_hash, full_name, photo_url, created_at, updated_at |
| `token_blacklist` | token, expires_at |
| `password_resets` | user_id, token, expires_at, used |
| `classification_history` | id, user_id (FK users), image_url, waste_type, confidence, cv_confidence, latitude, longitude, location_name, recyclable, treatment, recyclable_confidence, treatment_confidence, created_at |
| `ratings` | id, classification_id (FK classification_history), user_id (FK users), score (1-5), created_at |
| `comments` | id, classification_id (FK classification_history), user_id (FK users), message, created_at |

### Key constraints

- `ratings`: UNIQUE(classification_id, user_id) — one rating per user per scan
- `ratings.score`: CHECK (score BETWEEN 1 AND 5)
- `classification_history`: latitude/longitude are FLOAT, captured from the device at scan time

## Supabase Storage

Two buckets are used:
- `avatars` — user profile photos (via `uploadPhoto` in `storage.service.ts`)
- `scans` — scan images (via classification service, must be created manually in Supabase dashboard)

## Migrations

Migrations live in `backend/supabase/migrations/`. Use the Supabase CLI to create and run them:

```bash
npx supabase migration new <name>   # Create a new migration file
npx supabase db push                 # Apply migrations to remote Supabase
npx supabase db reset                # Reset local DB and re-run all migrations
```

Migration files are plain SQL (`.sql`), timestamped, and run in order. Always create a migration when adding/modifying tables, columns, RLS policies, or PostgreSQL functions.

## Adding a new resource

1. Create model in `src/models/` (named export functions, Supabase client)
2. Create service in `src/services/` (business logic, external API calls)
3. Create controller in `src/controllers/` (thin, delegates to service)
4. Create routes in `src/routes/` and register in `src/server.ts`
5. Add OpenAPI docs in `src/docs/` (new file + register in `src/docs/index.ts`)
6. Add types in `src/types/`

## Transactions

The Supabase JS client does not support native SQL transactions. Use PostgreSQL functions called via `supabase.rpc()` for operations that need atomicity.

### Pattern: Define transactional logic in a migration, call via RPC

**1. Create the function in a migration:**

```sql
CREATE OR REPLACE FUNCTION submit_scan_with_rating(...)
RETURNS UUID AS $$ ... $$ LANGUAGE plpgsql;
```

**2. Call from the model layer:**

```typescript
const { data, error } = await supabase.rpc('submit_scan_with_rating', { ... });
```

Use transactions when an operation involves multiple inserts/updates that must succeed or fail together.
