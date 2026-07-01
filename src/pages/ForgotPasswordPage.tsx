import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Cpu, Mail, ArrowRight, AlertCircle, CheckCircle, Shield, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setError("Work email address is required");
      return false;
    } else if (!emailRegex.test(email)) {
      setError("Please enter a valid work email address");
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate reset dispatcher
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[150px] pointer-events-none" />

      {/* LEFT SIDE - Security visual panel */}
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
        <div className="space-y-6 my-auto max-w-md">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs text-indigo-300 font-medium">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Inventory Management Platform</span>
            </div>
            <h1 className="font-display font-bold text-3xl lg:text-4xl tracking-tight leading-tight text-white">
              Reset Workspace <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Password</span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              If your workspace credentials are locked or forgotten, you can request a password reset link to be sent directly to your registered business email address.
            </p>
          </div>
        </div>

        {/* Footing note */}
        <div className="text-xs text-slate-500">
          <span>Inventix Procurement & Inventory Workspace.</span>
        </div>
      </div>

      {/* RIGHT SIDE - Access Recovery Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 relative z-10">
        <div className="w-full max-w-md space-y-8">
          
          {/* Mobile brand header */}
          <div className="flex flex-col items-center text-center md:hidden mb-6">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Cpu className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">Inventix</span>
            </Link>
            <h2 className="text-xl font-bold text-white">Reset Password</h2>
            <p className="text-slate-400 text-xs mt-1">Enter your business email</p>
          </div>

          <div className="hidden md:block">
            {/* Go back helper */}
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-6 group transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1.5 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to login</span>
            </Link>
            <h2 className="text-3xl font-bold text-white tracking-tight font-display">Reset Password</h2>
            <p className="text-slate-400 text-sm mt-2">
              Enter your verified email to receive a password reset link.
            </p>
          </div>

          {success ? (
            /* Recovery Link Dispatched Success Card */
            <div className="p-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 text-center space-y-5 animate-fadeIn">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white font-display">Reset Link Dispatched</h3>
                <p className="text-slate-300 text-xs leading-relaxed">
                  We have sent a password reset link directly to <strong className="text-white font-mono">{email}</strong>. 
                </p>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Please click the link inside the email to reset your password.
                </p>
              </div>
              <div className="pt-4 space-y-2">
                <Link
                  to="/login"
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Return to login
                </Link>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail("");
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 block w-full text-center hover:underline bg-transparent border-none py-1 cursor-pointer"
                >
                  Send to a different email address
                </button>
              </div>
            </div>
          ) : (
            /* Recover Access Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Business Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${error ? "text-rose-500" : "text-slate-500"}`} />
                  <input
                    id="email"
                    type="email"
                    placeholder="robert.alvarez@acme.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(undefined);
                    }}
                    className={`w-full pl-11 pr-4 py-3 text-sm rounded-xl border bg-slate-950/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      error 
                        ? "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500" 
                        : "border-slate-800/80 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-1 text-xs text-rose-500 mt-1 animate-slideIn">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm transition-all duration-300 shadow-xl shadow-indigo-950/50 hover:shadow-indigo-500/10 flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
              >
                <span>{loading ? "Verifying..." : "Send Reset Link"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Back to sign-in helper on mobile */}
              <div className="text-center md:hidden pt-2 text-xs">
                <Link to="/login" className="text-slate-500 hover:text-slate-300">
                  Back to login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
