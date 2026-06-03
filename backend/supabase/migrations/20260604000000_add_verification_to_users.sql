-- Add is_verified column to users table if it does not exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Create email_verifications table to store verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for the new table
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Index token for performance
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
