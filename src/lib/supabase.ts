import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder strings during build time if environment variables are missing
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder') {
  console.warn('Supabase URL or Anon Key is missing from environment variables. Using placeholders for build.');
}

// Client for general use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for use ONLY in secure server environments (API routes, cron jobs)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient(supabaseUrl, supabaseServiceRoleKey) 
  : supabase;

