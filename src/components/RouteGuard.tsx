/**
 * src/components/RouteGuard.tsx
 *
 * Protects routes based on the current Supabase auth session.
 *
 * Two modes, controlled via props:
 *
 *  requireAuth={true}
 *    → Unauthenticated users are redirected to /login.
 *    → Authenticated users see the child route (Outlet).
 *    Used for: /dashboard and any future authenticated pages.
 *
 *  redirectIfAuth={true}
 *    → Authenticated users are redirected to /dashboard.
 *    → Unauthenticated users see the child route (Outlet).
 *    Used for: /login — prevents a logged-in user from landing on the login form.
 *
 * While the initial session check is in flight (loading === true), a full-screen
 * skeleton is rendered to avoid flashing the wrong page.
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RouteGuardProps {
  /** If true: unauthenticated users are redirected to /login. */
  requireAuth?: boolean;
  /** If true: authenticated users are redirected to /dashboard. */
  redirectIfAuth?: boolean;
}

export default function RouteGuard({
  requireAuth = false,
  redirectIfAuth = false,
}: RouteGuardProps) {
  const { user, loading } = useAuth();

  // -------------------------------------------------------------------------
  // While the AuthContext is resolving the session from localStorage,
  // render a neutral full-screen loading state.
  // This prevents a brief flash of /login before the session is confirmed.
  // -------------------------------------------------------------------------
  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#030712] flex items-center justify-center"
        aria-label="Loading workspace..."
        role="status"
      >
        {/* Pulsing Inventix brand mark — matches the app's dark theme */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 animate-pulse shadow-lg shadow-indigo-500/20" />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Initialising workspace...
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // requireAuth: user must be signed in to access this route.
  // -------------------------------------------------------------------------
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // -------------------------------------------------------------------------
  // redirectIfAuth: authenticated users should not see this route (e.g. /login).
  // -------------------------------------------------------------------------
  if (redirectIfAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // -------------------------------------------------------------------------
  // All checks passed — render the matched child route.
  // -------------------------------------------------------------------------
  return <Outlet />;
}
