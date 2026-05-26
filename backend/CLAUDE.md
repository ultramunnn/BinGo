# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BinGo ("Your AI Lens for a Cleaner Beach") — a beach waste classification app. Users take photos of beach waste, the AI classifies the waste type, and each scan is saved with GPS coordinates. Users can browse and interact (rate/comment) with each other's scan history.

## Commands

All commands run from the `backend/` directory:

```bash
npm run dev        # Start dev server with auto-reload (nodemon + ts-node)
npm run build      # Compile TypeScript to dist/
npm start          # Run production build from dist/server.js
```

No test runner or linter is configured.

## Environment Setup

A `.env` file in `backend/` is required with: `PORT`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CV_API_URL`, `ML_API_URL`. See `backend/.env.example` for the template.

## Architecture

Express MVC pattern in `backend/src/`:

- **Routes** → **Controllers** → **Services** → **Models** (Supabase data access) → **Types** (shared interfaces)
- **Middleware**: JWT auth (`authenticate`) in `src/middleware/auth.ts`, file upload (`multer`) in `src/middleware/upload.ts`
- **Models** export named functions (not classes) — follow this pattern for new models
- **Services** contain business logic and orchestrate external API calls
- **Docs**: OpenAPI spec is defined programmatically in TypeScript under `src/docs/`, not YAML files. Add new endpoint docs there.

### Core User Flow

1. User takes a photo of beach waste → mobile app captures GPS coordinates (latitude, longitude)
2. Photo uploaded to backend → saved to Supabase Storage (`scans` bucket)
3. Image sent to **CV API** (port 7860) → returns `waste_type` (glass/metal/paper/plastic/textile) + `confidence`
4. Backend auto-derives 9 ML features from category using rule-based logic (`src/utils/feature-derivation.ts`)
5. Features sent to **ML API** (port 8000) → returns `recyclable` (Yes/No) + `treatment` method + confidence scores
6. Full result saved to `classification_history` and returned to user
7. Other users can view anyone's scan history, rate it (1-5), and leave comments

### Two-Stage AI Pipeline

The classification uses two external Python services:

- **CV API** (`cv/`, port 7860): EfficientNetB0 image classifier → 5 waste categories
- **ML API** (`ml/`, port 8000): Hybrid decision model → recyclability + treatment recommendation

The backend acts as the orchestrator: `cv.service.ts` → `feature-derivation.ts` → `ml.service.ts`. Users only upload an image + GPS; all ML features are auto-derived from the CV category (no user input needed for contextual features).

### Adding a new resource

1. Create model in `src/models/` (named export functions, Supabase client)
2. Create service in `src/services/` (business logic, external API calls)
3. Create controller in `src/controllers/` (thin, delegates to service)
4. Create routes in `src/routes/` and register in `src/server.ts`
5. Add OpenAPI docs in `src/docs/` (new file + register in `src/docs/index.ts`)
6. Add types in `src/types/`

## Database Schema

All tables use UUID primary keys. Timestamps use `TIMESTAMPTZ`. Single role: `user` only.

| Table | Columns |
|---|---|
| `users` | id, email, password_hash, full_name, photo_url, created_at, updated_at |
| `token_blacklist` | token, expires_at |
| `password_resets` | user_id, token, expires_at, used |
| `classification_history` | id, user_id (FK users), image_url, waste_type, confidence, latitude, longitude, location_name, recyclable, treatment, recyclable_confidence, treatment_confidence, created_at |
| `ratings` | id, classification_id (FK classification_history), user_id (FK users), score (1-5), created_at |
| `comments` | id, classification_id (FK classification_history), user_id (FK users), message, created_at |

### Key constraints

- `ratings`: UNIQUE(classification_id, user_id) — one rating per user per scan
- `ratings.score`: CHECK (score BETWEEN 1 AND 5)
- `classification_history`: latitude/longitude are FLOAT, captured from the device at scan time
- `classification_history`: recyclable/treatment are ML predictions, recyclable_confidence/treatment_confidence are FLOAT

## Scan API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/scans` | Yes | Upload image + GPS → full classification pipeline |
| GET | `/api/scans` | No | All scans (public feed, paginated) |
| GET | `/api/scans/me` | Yes | Current user's scan history |
| GET | `/api/scans/:id` | No | Single scan by ID |
| DELETE | `/api/scans/:id` | Yes | Delete own scan |

### POST /api/scans (multipart/form-data)

Required fields: `photo` (image file), `latitude` (number), `longitude` (number)
Optional: `location_name` (string)

Response includes: waste_type, confidence, recyclable, treatment, recyclable_confidence, treatment_confidence, image_url, GPS data.

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

### Example migration

```sql
CREATE TABLE classification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  waste_type TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  location_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE classification_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view classifications"
  ON classification_history FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own classifications"
  ON classification_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Transactions

The Supabase JS client does not support native SQL transactions. Use PostgreSQL functions called via `supabase.rpc()` for operations that need atomicity.

### Pattern: Define transactional logic in a migration, call via RPC

**1. Create the function in a migration:**

```sql
CREATE OR REPLACE FUNCTION submit_scan_with_rating(
  p_user_id UUID,
  p_image_url TEXT,
  p_waste_type TEXT,
  p_confidence FLOAT,
  p_latitude FLOAT,
  p_longitude FLOAT,
  p_location_name TEXT,
  p_recyclable TEXT,
  p_treatment TEXT,
  p_recyclable_confidence FLOAT,
  p_treatment_confidence FLOAT
)
RETURNS UUID AS $$
DECLARE
  v_classification_id UUID;
BEGIN
  INSERT INTO classification_history (user_id, image_url, waste_type, confidence, latitude, longitude, location_name, recyclable, treatment, recyclable_confidence, treatment_confidence)
  VALUES (p_user_id, p_image_url, p_waste_type, p_confidence, p_latitude, p_longitude, p_location_name, p_recyclable, p_treatment, p_recyclable_confidence, p_treatment_confidence)
  RETURNING id INTO v_classification_id;

  RETURN v_classification_id;
END;
$$ LANGUAGE plpgsql;
```

**2. Call from the model layer:**

```typescript
const { data, error } = await supabase.rpc('submit_scan_with_rating', {
  p_user_id: userId,
  p_image_url: imageUrl,
  p_waste_type: wasteType,
  p_confidence: confidence,
  p_latitude: lat,
  p_longitude: lng,
  p_location_name: locationName,
  p_recyclable: recyclable,
  p_treatment: treatment,
  p_recyclable_confidence: recyclableConfidence,
  p_treatment_confidence: treatmentConfidence,
});
```

Use transactions when an operation involves multiple inserts/updates that must succeed or fail together.
