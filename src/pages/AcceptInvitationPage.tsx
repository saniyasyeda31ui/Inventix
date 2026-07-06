import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Box, Lock, CheckCircle, AlertTriangle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AcceptInvitationPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Checking for hash errors (e.g. expired link)
  const [hashError, setHashError] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('error_description=')) {
      const params = new URLSearchParams(hash.substring(1));
      const description = params.get('error_description');
      if (description) {
        setHashError("This invitation has expired or is no longer valid. Please contact your administrator.");
      }
    }
  }, []);

  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strength = getStrength(password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-400', 'bg-emerald-500'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setSuccessMsg("Your account has been activated successfully.");
      
      // We log them out and force them to login normally with their new password.
      // Or we can just let them stay logged in. The prompt says:
      // "Then redirect to: /login where the employee logs in normally using: Work Email, Newly created password"
      
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update password.");
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Verifying Invitation...</span>
        </div>
      </div>
    );
  }

  // If there's a hash error (e.g. expired link)
  if (hashError) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a101f] border border-slate-900 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-rose-500/20">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Invitation Invalid</h1>
          <p className="text-sm text-slate-400 leading-relaxed">{hashError}</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl border border-slate-800 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // If no hash error but user is null, they might have landed here without a valid token
  if (!user) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a101f] border border-slate-900 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Access Denied</h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            You must access this page via a valid invitation link.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl border border-slate-800 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  // If success, just show success message and wait for redirect
  if (successMsg) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0a101f] border border-slate-900 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Account Activated</h1>
          <p className="text-sm text-emerald-400 leading-relaxed font-medium">{successMsg}</p>
          <p className="text-xs text-slate-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const fullName = profile?.full_name || user.user_metadata?.full_name || 'User';
  const displayRole = profile?.role || user.user_metadata?.role || 'Member';
  const displayDepartment = user.user_metadata?.department || 'Operations';

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Branding Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/20 mb-2">
            <Box className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            Inventix Enterprise
          </h1>
          <p className="text-sm text-slate-400">Complete your account activation</p>
        </div>

        <div className="bg-[#0a101f] border border-slate-900 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 bg-slate-950/50 border-b border-slate-900 flex flex-col items-center text-center space-y-2">
            <h2 className="text-lg font-bold text-white">Welcome, {fullName}</h2>
            <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
              <span className="bg-slate-900 px-2 py-1 rounded-md text-indigo-400">{displayRole.replace('_', ' ')}</span>
              <span>•</span>
              <span className="bg-slate-900 px-2 py-1 rounded-md">{displayDepartment}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            <div className="space-y-4">
              {/* Create Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1 block">Create Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-[#030712] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 ml-1 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-[#030712] border border-slate-800 rounded-xl text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-wider font-mono">
                  <span className="text-slate-500">Strength</span>
                  <span className={strengthColors[strength].replace('bg-', 'text-')}>{strengthLabels[strength]}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                  {[0, 1, 2, 3].map(idx => (
                    <div 
                      key={idx}
                      className={`h-full flex-1 border-r border-slate-900 last:border-0 transition-colors duration-300 ${
                        idx < strength ? strengthColors[strength] : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || password.length < 8}
              className="w-full py-2.5 mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Activating...
                </>
              ) : (
                "Activate Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
