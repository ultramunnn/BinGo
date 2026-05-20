import { supabase } from '../config/supabase';

export const addToBlacklist = async (token: string, expiresAt: Date) => {
  const { error } = await supabase
    .from('token_blacklist')
    .insert({ token, expires_at: expiresAt });

  if (error) console.error('Blacklist error:', error);
};

export const isBlacklisted = async (token: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('token_blacklist')
    .select('token')
    .eq('token', token)
    .single();

  if (error && error.code !== 'PGRST116') return false;
  return !!data;
};