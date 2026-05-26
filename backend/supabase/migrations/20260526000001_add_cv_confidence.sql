-- Add cv_confidence column to classification_history
-- Stores the raw CV model confidence for transparency and debugging
ALTER TABLE classification_history
ADD COLUMN IF NOT EXISTS cv_confidence FLOAT;