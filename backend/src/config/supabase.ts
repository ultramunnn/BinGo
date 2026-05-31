import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Only load .env in development (Railway injects env vars directly)
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);