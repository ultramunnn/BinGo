-- Beaches table
CREATE TABLE IF NOT EXISTS beaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  address TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE beaches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view beaches" ON beaches FOR SELECT USING (true);

-- Beach reviews table (one review per user per beach)
CREATE TABLE IF NOT EXISTS beach_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  beach_id UUID NOT NULL REFERENCES beaches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(beach_id, user_id)
);

ALTER TABLE beach_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view beach reviews" ON beach_reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own beach reviews" ON beach_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own beach reviews" ON beach_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own beach reviews" ON beach_reviews FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_beach_reviews_beach ON beach_reviews(beach_id);
CREATE INDEX IF NOT EXISTS idx_beach_reviews_user ON beach_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_beaches_coords ON beaches(latitude, longitude);
