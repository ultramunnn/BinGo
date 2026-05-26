-- Classification history table (scan results with GPS)
CREATE TABLE IF NOT EXISTS classification_history (
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

DROP POLICY IF EXISTS "Anyone can view classifications" ON classification_history;
CREATE POLICY "Anyone can view classifications"
  ON classification_history FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own classifications" ON classification_history;
CREATE POLICY "Users can insert own classifications"
  ON classification_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own classifications" ON classification_history;
CREATE POLICY "Users can delete own classifications"
  ON classification_history FOR DELETE
  USING (auth.uid() = user_id);

-- Ratings table (1-5 score per user per scan)
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classification_id UUID NOT NULL REFERENCES classification_history(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(classification_id, user_id)
);

ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view ratings" ON ratings;
CREATE POLICY "Anyone can view ratings"
  ON ratings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own ratings" ON ratings;
CREATE POLICY "Users can insert own ratings"
  ON ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ratings" ON ratings;
CREATE POLICY "Users can update own ratings"
  ON ratings FOR UPDATE
  USING (auth.uid() = user_id);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classification_id UUID NOT NULL REFERENCES classification_history(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert own comments" ON comments;
CREATE POLICY "Users can insert own comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON comments;
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_classification_history_user ON classification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_classification_history_created ON classification_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_classification ON ratings(classification_id);
CREATE INDEX IF NOT EXISTS idx_comments_classification ON comments(classification_id);
