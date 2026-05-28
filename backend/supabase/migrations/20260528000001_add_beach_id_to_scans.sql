-- Add beach_id to classification_history for auto beach detection
ALTER TABLE classification_history
ADD COLUMN beach_id UUID REFERENCES beaches(id) ON DELETE SET NULL;

CREATE INDEX idx_classification_history_beach ON classification_history(beach_id);
