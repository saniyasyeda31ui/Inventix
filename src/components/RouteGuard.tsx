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
      <div className="relative w-screen h-screen overflow-hidden font-sans flex items-center justify-center bg-[#f6ebff]">
        {/* Animated Background from Login */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#fbcfe8_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#bfdbfe_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#e9d5ff_0%,_transparent_80%)]" />
          
          <div className="absolute inset-0 opacity-[0.15]">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,300 C300,400 600,100 1000,200 C1400,300 1800,100 2000,300" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M0,500 C400,600 800,200 1200,400 C1600,600 1900,300 2000,500" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="10,10" />
            </svg>
          </div>
        </div>

        {/* Loading Content */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 animate-pulse shadow-[0_0_20px_rgba(99,102,241,0.3)] border border-white/40" />
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:0ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:150ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 animate-bounce [animation-delay:300ms]" />
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
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
