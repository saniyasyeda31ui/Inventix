/**
 * src/context/AuthContext.tsx
 *
 * Authentication context for the Inventix ERP application.
 *
 * Provides a single source of truth for auth state across the entire React
 * component tree. Any component can call `useAuth()` to read the current user,
 * their database profile (including role), and the loading state — without
 * knowing anything about Supabase directly.
 *
 * What this file owns:
 *  - Session initialisation on app load (getSession)
 *  - Realtime auth state change listener (onAuthStateChange)
 *  - Profile fetch from public.profiles after session is confirmed
 *  - signIn() and signOut() wrappers
 *
 * What this file does NOT own:
 *  - Route protection (that belongs in a RouteGuard component, Phase 02 step 2)
 *  - UI rendering (purely logic / state)
 *  - The Supabase client instance (imported from src/lib/supabase.ts)
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AppRole, Permissions, mapDatabaseRoleToAppRole, rolePermissions } from '../lib/rbac';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Mirrors the public.profiles table row.
 * Role values must match the CHECK constraint in the database schema:
 *   check (role in ('admin', 'procurement_manager', 'inventory_manager', 'warehouse_manager', 'finance_manager', 'viewer'))
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: AppRole | 'sourcing_admin' | 'manager'; // Legacy roles included for backwards compatibility
  organization: string;
  updated_at: string;
  created_at: string;
}

/** Shape of the value exposed by AuthContext to all consumers. */
interface AuthContextValue {
  /** The raw Supabase auth user object. null when signed out. */
  user: User | null;
  /** The user's row from public.profiles. null while loading or signed out. */
  profile: UserProfile | null;
  /** The frontend application role derived from the database profile. */
  role: AppRole | null;
  /** The mapped permissions for the current frontend role. */
  permissions: Permissions | null;
  /**
   * True while the initial session check is in flight.
   * Use this to render a full-screen skeleton rather than flashing the login page.
   */
  loading: boolean;
  /**
   * Sign the user in with email + password.
   * Returns the Supabase AuthError if sign-in fails, or null on success.
   */
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  /**
   * Sign the user out and clear all local session data.
   * The onAuthStateChange listener will set user + profile to null automatically.
   */
  signOut: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  // Start as true — we don't know the auth state yet on first render.
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------------------------
  // fetchProfile — loads the user's row from public.profiles
  // Called whenever the auth session changes to a non-null user.
  // Separated into its own function so it can be called from both
  // the initial session check and the onAuthStateChange listener.
  // -------------------------------------------------------------------------
  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, organization, updated_at, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      // Profile may not exist yet if the DB trigger hasn't run (race condition
      // on first signup). Log the error but don't crash — profile will be null.
      console.warn('[AuthContext] Could not fetch profile:', error.message);
      setProfile(null);
      setRole(null);
      setPermissions(null);
    } else {
      const userProfile = data as UserProfile;
      setProfile(userProfile);
      
      // Determine frontend role and permissions
      const appRole = mapDatabaseRoleToAppRole(userProfile.role, userProfile.email);
      setRole(appRole);
      setPermissions(rolePermissions[appRole]);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Session initialisation
  // On mount: read the existing session from localStorage (persisted by the
  // Supabase client). This avoids a flash of the login page on page refresh.
  // -------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      // Whether or not a session exists, we are done loading.
      setLoading(false);
    }

    initSession();

    // -----------------------------------------------------------------------
    // Auth state change listener
    // Fires on: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED, etc.
    // This is the primary mechanism that keeps state in sync without polling.
    // -----------------------------------------------------------------------
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        // User signed out — clear all state.
        setUser(null);
        setProfile(null);
        setRole(null);
        setPermissions(null);
      }
      // After the first INITIAL_SESSION event resolves, loading should be false.
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // -------------------------------------------------------------------------
  // signIn — wraps supabase.auth.signInWithPassword
  // Returns the AuthError on failure so the caller (LoginPage) can display it.
  // Returns null on success — the onAuthStateChange listener handles state.
  // -------------------------------------------------------------------------
  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthError | null> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ?? null;
    },
    []
  );

  // -------------------------------------------------------------------------
  // signOut — wraps supabase.auth.signOut
  // The onAuthStateChange listener fires SIGNED_OUT and clears state.
  // -------------------------------------------------------------------------
  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // -------------------------------------------------------------------------
  // Context value — memoised shape exposed to all consumers
  // -------------------------------------------------------------------------
  const value: AuthContextValue = {
    user,
    profile,
    role,
    permissions,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// useAuth — consumer hook
// Must be called inside a component that is a descendant of <AuthProvider>.
// ---------------------------------------------------------------------------

/**
 * Returns the current auth context value.
 *
 * @example
 * const { user, profile, loading, signIn, signOut } = useAuth();
 *
 * @throws If called outside of <AuthProvider>.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      '[useAuth] must be called inside <AuthProvider>.\n' +
      'Ensure <AuthProvider> wraps the component tree in src/App.tsx.'
    );
  }
  return context;
}
