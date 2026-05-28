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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_classification_history_user ON classification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_classification_history_created ON classification_history(created_at DESC);
