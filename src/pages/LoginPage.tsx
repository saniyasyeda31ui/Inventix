import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Cpu, Mail, Lock, ArrowRight, AlertCircle, Shield, CheckCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Validation & Loading states
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const tempErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      tempErrors.email = "Work email is required";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid work email address";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setTerminalLogs([]);
    setErrors({});

    // Terminal log animation — runs in parallel while the Supabase call is in flight.
    // The logs are purely cosmetic UI and do not represent actual auth steps.
    const logs = [
      "Connecting to enterprise server...",
      "Loading product database...",
      "Verifying user credentials...",
      "Syncing warehouse location data...",
      "Access authorized. Opening workspace dashboard..."
    ];

    logs.forEach((log, index) => {
      setTimeout(() => {
        setTerminalLogs((prev) => [...prev, `[SYSTEM] ${log}`]);
      }, (index + 1) * 350);
    });

    // Real Supabase authentication call.
    // signIn() returns null on success or an AuthError on failure.
    const authError = await signIn(email, password);

    if (authError) {
      // Authentication failed — exit loading state and surface the error.
      // Map Supabase error messages to user-friendly copy.
      setLoading(false);
      setTerminalLogs([]);
      const message =
        authError.message === "Invalid login credentials"
          ? "Invalid email or password. Please check your credentials and try again."
          : authError.message;
      setErrors({ general: message });
      return;
    }

    // Authentication succeeded — show success card, then navigate.
    // A short delay lets the final terminal log render before transitioning.
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }, logs.length * 350 + 200);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[150px] pointer-events-none" />

      {/* LEFT SIDE - High-Fidelity Enterprise Visualization Panel */}
      <div className="hidden md:flex md:w-[45%] lg:w-[50%] bg-[#02050c]/85 border-r border-slate-900/60 p-12 flex-col justify-between relative z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center gap-2.5 group w-fit focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight text-white block">Inventix</span>
            <span className="text-[9px] font-mono tracking-widest text-indigo-400 uppercase font-medium">Enterprise Sourcing</span>
          </div>
        </Link>

        {/* Feature Copy / Visualization */}
        <div className="space-y-8 my-auto max-w-lg">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs text-indigo-300 font-medium">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Inventory Management Platform</span>
            </div>
            <h1 className="font-display font-bold text-3xl lg:text-4xl xl:text-5xl tracking-tight leading-tight text-white">
              Sign in to your <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Inventix Workspace</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Enter your credentials to synchronize with your physical storage networks, monitor active procurement cycles, and authorize purchase orders.
            </p>
          </div>

          {/* Quick Metrics display */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-900">
            <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Inventory Accuracy</span>
              <span className="text-xl font-bold text-white font-mono">99.9%</span>
              <span className="text-[10px] text-emerald-400 font-mono block mt-0.5">● Real-Time Sync</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Active Warehouses</span>
              <span className="text-xl font-bold text-white font-mono">12+</span>
              <span className="text-[10px] text-indigo-400 font-mono block mt-0.5">Globally Linked</span>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="text-xs text-slate-500 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Inventix Technologies</span>
          <span className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3 text-emerald-500 animate-spin-slow" />
            <span>System Online</span>
          </span>
        </div>
      </div>

      {/* RIGHT SIDE - Authentication Form Area */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 relative z-10">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile Logo Header */}
          <div className="flex flex-col items-center text-center md:hidden mb-8">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">Inventix</span>
            </Link>
            <h2 className="text-2xl font-bold text-white tracking-tight">Sign In</h2>
            <p className="text-slate-400 text-sm mt-1">Enter your credentials to access your workspace</p>
          </div>

          <div className="hidden md:block">
            <h2 className="text-3xl font-bold text-white tracking-tight font-display">Sign In</h2>
            <p className="text-slate-400 text-sm mt-2">
              Access your procurement and inventory management suite.
            </p>
          </div>

          {success ? (
            /* Immersive Sign-In Success Card */
            <div className="p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white font-display">Sign In Approved</h3>
              <p className="text-slate-300 text-xs leading-relaxed max-w-xs mx-auto">
                Successfully signed in. Loading your dashboard controls...
              </p>
              <div className="w-full bg-slate-900 rounded-full h-1 mt-2 overflow-hidden">
                <div className="bg-emerald-500 h-1 rounded-full animate-progress" />
              </div>
            </div>
          ) : loading ? (
            /* Immersive Terminal Log Feedback */
            <div className="p-6 rounded-2xl border border-slate-900 bg-[#02050b] space-y-4 font-mono text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Opening Workspace...</span>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              </div>
              <div className="space-y-2 p-3 bg-black/50 rounded-xl border border-slate-950 text-indigo-200/90 max-h-[200px] overflow-y-auto leading-relaxed">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="animate-slideIn">{log}</div>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 text-center">Connecting to secure ERP node</p>
            </div>
          ) : (
            /* Standard Interactive Login Form */
            <form onSubmit={handleLogin} className="space-y-6">

              {/* General auth error (wrong credentials, network issues, etc.) */}
              {errors.general && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/5 text-xs text-rose-400 animate-slideIn">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{errors.general}</span>
                </div>
              )}
              
              {/* Business Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.email ? "text-rose-500" : "text-slate-500"}`} />
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. robert.alvarez@acme.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border bg-slate-950/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      errors.email 
                        ? "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500" 
                        : "border-slate-800/80 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-xs text-rose-500 mt-1 animate-slideIn">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Secure Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.password ? "text-rose-500" : "text-slate-500"}`} />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border bg-slate-950/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      errors.password 
                        ? "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500" 
                        : "border-slate-800/80 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-xs text-rose-500 mt-1 animate-slideIn">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Remember Me Toggle */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 focus:ring-offset-slate-950 focus:outline-none transition-all cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2.5 text-xs text-slate-400 select-none cursor-pointer hover:text-slate-300">
                  Remember me on this device
                </label>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all duration-300 shadow-xl shadow-indigo-950/50 hover:shadow-indigo-500/10 flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#030712]"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Alternative Auth Option Link */}
              <div className="text-center pt-2 text-xs">
                <p className="text-slate-500">
                  Don't have a registered corporate workspace?{" "}
                  <Link 
                    to="/register-company" 
                    className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
                  >
                    Register Company
                  </Link>
                </p>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
