-- Add ML prediction columns to classification_history
ALTER TABLE classification_history
  ADD COLUMN recyclable TEXT,
  ADD COLUMN treatment TEXT,
  ADD COLUMN recyclable_confidence FLOAT,
  ADD COLUMN treatment_confidence FLOAT;