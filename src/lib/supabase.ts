/**
 * src/lib/supabase.ts
 *
 * Singleton Supabase client for the Inventix ERP application.
 *
 * This file is the single source of truth for the Supabase connection.
 * Import `supabase` from this module everywhere you need to interact
 * with the database, auth, realtime, or storage.
 *
 * Security rules:
 *  - VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are public keys that
 *    Vite exposes to the client bundle. This is safe by design — Supabase
 *    enforces data isolation through Row-Level Security (RLS) policies, not
 *    through keeping the anon key secret.
 *  - The SUPABASE_SERVICE_ROLE_KEY is intentionally NOT used here. It must
 *    never appear in frontend code. It is reserved for server-side scripts
 *    and Edge Functions only.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Environment variable validation
// Vite replaces import.meta.env.VITE_* at build time using the values from
// .env.local (local dev) or the hosting platform's environment config.
// ---------------------------------------------------------------------------

const supabaseUrl: string = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey: string = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || supabaseUrl === 'https://your-project-ref.supabase.co') {
  throw new Error(
    '[Inventix] VITE_SUPABASE_URL is not set.\n' +
    'Copy .env.example → .env.local and fill in your Supabase project URL.\n' +
    'Restart the dev server after making changes to .env.local.'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
  throw new Error(
    '[Inventix] VITE_SUPABASE_ANON_KEY is not set.\n' +
    'Copy .env.example → .env.local and fill in your Supabase anon key.\n' +
    'Find it in: Supabase Dashboard → Project Settings → API → Project API keys.'
  );
}

// ---------------------------------------------------------------------------
// Singleton client instance
// createClient is called once at module load time. Because ES modules are
// singletons, every import of `supabase` across the application shares the
// same client instance — no duplicate connections, no redundant auth listeners.
// ---------------------------------------------------------------------------

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist the user session across browser tabs and page refreshes using
    // localStorage. This is the standard Supabase behaviour for web apps.
    persistSession: true,
    // Automatically refresh the JWT access token before it expires so that
    // the user session remains active without requiring a manual re-login.
    autoRefreshToken: true,
    // Detect OAuth callback URLs (e.g., for future social login support).
    detectSessionInUrl: true,
  },
});
