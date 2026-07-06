/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RouteGuard from "./components/RouteGuard";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterCompanyPage from "./pages/RegisterCompanyPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import AcceptInvitationPage from "./pages/AcceptInvitationPage";

export default function App() {
  return (
    <BrowserRouter>
      {/*
        AuthProvider must live inside BrowserRouter so RouteGuard children
        can call useNavigate() when redirecting.
      */}
      <AuthProvider>
        <Routes>

          {/* ----------------------------------------------------------------
              PUBLIC ROUTES — accessible regardless of auth state.
          ---------------------------------------------------------------- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register-company" element={<RegisterCompanyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/accept-invitation" element={<AcceptInvitationPage />} />

          {/* ----------------------------------------------------------------
              AUTH-REDIRECT ROUTES — redirect to /dashboard if already signed in.
              Prevents a logged-in user from landing on the login form.
          ---------------------------------------------------------------- */}
          <Route element={<RouteGuard redirectIfAuth />}>
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* ----------------------------------------------------------------
              PROTECTED ROUTES — redirect to /login if not authenticated.
          ---------------------------------------------------------------- */}
          <Route element={<RouteGuard requireAuth />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}



