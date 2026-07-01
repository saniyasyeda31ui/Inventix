# Development Phases: Phase 02 - Supabase Auth & Role Metadata Mapping

## 1. Phase Objectives
Configure secure user authentication pipelines via Supabase Client Auth. Seamlessly bind signup/login workflows to user profile records and map Role-Based Access Control (RBAC) scopes across JWT tokens and local React state.

---

## 2. Authentication Flow & Implementation Tasks

### A. Supabase Client Setup
Install Supabase JavaScript library and establish the client interface config inside `/src/lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configurations are missing in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### B. React Custom Hook: `useAuth`
Create `/src/hooks/useAuth.tsx` to handle session variables, active profile lookups, logging operations, and state parameters:

```typescript
import { useEffect, useState, createContext, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'viewer' | 'sourcing_admin' | 'manager';
  organization: string;
}

const AuthContext = createContext<{
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check current session status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen to auth state transitions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data as UserProfile);
    }
    setLoading(false);
  }

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be nested within AuthProvider');
  return context;
};
```

---

## 3. UI Login Routing Integration
Refactor the entry point of the application to check for active sessions and load roles:

1.  **Auth Screen Interface:** An eye-safe, high-contrast dark sign-in screen centering email inputs, password strength validations, recovery triggers, and workspace metadata inputs.
2.  **Route Protection Guard:** Wrap inside an authentication checker block:
    ```tsx
    if (loading) return <FullScreenLoadingShimmer />;
    if (!user) return <LoginSection />;
    ```
3.  **Role Access Filtering:** Hide specific action items based on active role parameters:
    ```tsx
    const canApprove = profile?.role === 'manager';
    const canEdit = profile?.role === 'sourcing_admin' || profile?.role === 'manager';
    ```

---

## 4. Testing Checklist
- [ ] Submitting correct sign-in coordinates populates sessions securely.
- [ ] Signing out invalidates JWT keys and routes the view back to `/login` immediately.
- [ ] Editing profiles in `profiles` maps role parameters dynamically onto active client layouts.

---

## 5. Estimations & Git Commit Milestones
- **Duration:** 1 Day
- **Commit Milestone:** `feat(auth): integrate supabase client auth and useAuth role metadata pipeline`
