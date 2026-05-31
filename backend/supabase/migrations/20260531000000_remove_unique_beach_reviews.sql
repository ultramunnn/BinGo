-- Remove unique constraint on (beach_id, user_id) to allow multiple reviews per user per beach
ALTER TABLE beach_reviews DROP CONSTRAINT IF EXISTS beach_reviews_beach_id_user_id_key;
