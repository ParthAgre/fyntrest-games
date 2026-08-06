import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !publishableKey) {
  console.warn('Supabase environment variables are missing. Leaderboard will be disabled.');
}

export const supabase = (supabaseUrl && publishableKey) 
  ? createClient(supabaseUrl, publishableKey) 
  : null;
