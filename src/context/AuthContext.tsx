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

export interface CompanySettings {
  company: {
    industry: string;
    timezone: string;
    currency: string;
    dateFormat: string;
  };
  procurement: {
    approvalLimit: number;
    autoApproveThreshold: number;
    defaultLeadTime: number;
  };
  inventory: {
    lowStockThreshold: number;
    autoReorder: boolean;
    valuationMethod: string;
  };
  notifications: {
    emailEnabled: boolean;
    purchaseAlerts: boolean;
    inventoryAlerts: boolean;
    paymentReminders: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
  };
  users: {
    defaultRole: string;
  };
  system: {
    language: string;
    theme: string;
  };
}

export interface CompanyData {
  name: string;
  tax_identifier: string;
  address_line_1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

/** Shape of the value exposed by AuthContext to all consumers. */
interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  role: AppRole | null;
  permissions: Permissions | null;
  companySettings: CompanySettings | null;
  companyData: CompanyData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthError | null>;
  signOut: () => Promise<void>;
  updateSettings: (newSettings: Partial<CompanySettings>) => Promise<{ error: Error | null }>;
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
  const [companySettings, setCompanySettings] = useState<CompanySettings | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, organization, updated_at, created_at')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('[AuthContext] Could not fetch profile:', error.message);
      setProfile(null);
      setRole(null);
      setPermissions(null);
      setCompanySettings(null);
      setCompanyData(null);
    } else {
      const userProfile = data as UserProfile;
      setProfile(userProfile);

      const appRole = mapDatabaseRoleToAppRole(userProfile.role, userProfile.email);
      setRole(appRole);
      setPermissions(rolePermissions[appRole]);

      // Fetch company settings
      if (userProfile.organization) {
        const { data: cData, error: companyError } = await supabase
          .from('companies')
          .select('name, tax_identifier, address_line_1, city, state, postal_code, country, settings')
          .eq('name', userProfile.organization)
          .single();

        if (!companyError && cData) {
          setCompanyData({
            name: cData.name,
            tax_identifier: cData.tax_identifier,
            address_line_1: cData.address_line_1,
            city: cData.city,
            state: cData.state,
            postal_code: cData.postal_code,
            country: cData.country
          });
          if (cData.settings) {
            setCompanySettings(cData.settings as CompanySettings);
          } else {
            // Provide default structure if not found or empty
            setCompanySettings({
              company: { industry: "Manufacturing", timezone: "UTC", currency: "USD", dateFormat: "MM/DD/YYYY" },
              procurement: { approvalLimit: 10000, autoApproveThreshold: 500, defaultLeadTime: 14 },
              inventory: { lowStockThreshold: 50, autoReorder: false, valuationMethod: "FIFO" },
              notifications: { emailEnabled: true, purchaseAlerts: true, inventoryAlerts: true, paymentReminders: false },
              security: { twoFactor: false, sessionTimeout: 60 },
              users: { defaultRole: "viewer" },
              system: { language: "en", theme: "light" }
            });
          }
        } else {
          // Provide default structure if not found or empty
          setCompanySettings({
            company: { industry: "Manufacturing", timezone: "UTC", currency: "USD", dateFormat: "MM/DD/YYYY" },
            procurement: { approvalLimit: 10000, autoApproveThreshold: 500, defaultLeadTime: 14 },
            inventory: { lowStockThreshold: 50, autoReorder: false, valuationMethod: "FIFO" },
            notifications: { emailEnabled: true, purchaseAlerts: true, inventoryAlerts: true, paymentReminders: false },
            security: { twoFactor: false, sessionTimeout: 60 },
            users: { defaultRole: "viewer" },
            system: { language: "en", theme: "light" }
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
      setLoading(false);
    }

    initSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
        setPermissions(null);
        setCompanySettings(null);
        setCompanyData(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthError | null> => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ?? null;
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<CompanySettings>) => {
    if (!profile?.organization) return { error: new Error("No organization found") };
    
    // Merge existing settings with partial updates
    const mergedSettings = { ...companySettings, ...newSettings };
    
    const { error } = await supabase
      .from('companies')
      .update({ settings: mergedSettings })
      .eq('name', profile.organization);
      
    if (!error) {
      setCompanySettings(mergedSettings as CompanySettings);
    }
    
    return { error };
  }, [companySettings, profile]);

  const value: AuthContextValue = {
    user,
    profile,
    role,
    permissions,
    companySettings,
    companyData,
    loading,
    signIn,
    signOut,
    updateSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('[useAuth] must be called inside <AuthProvider>');
  }
  return context;
}
