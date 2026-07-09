import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Cpu, Mail, ArrowRight, AlertCircle, CheckCircle, Shield, ArrowLeft, Activity, Globe, Building, Users, Sparkles } from "lucide-react";
import { motion } from "motion/react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(undefined);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans flex items-center justify-center bg-[#f6ebff]">
      
      {/* ======================================================== */}
      {/* EXACT LIVING BACKGROUND RECREATION                       */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Core base gradients replicating the pink/purple/blue wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_#fbcfe8_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_#bfdbfe_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#e9d5ff_0%,_transparent_80%)]" />
        
        {/* Abstract glowing waves/meshes */}
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-[20%] top-[20%] w-[60vw] h-[60vw] bg-pink-300/40 rounded-full blur-[140px]" />
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, -5, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-[20%] bottom-[10%] w-[60vw] h-[60vw] bg-blue-300/40 rounded-full blur-[140px]" />
        
        {/* Wave lines SVG mimicking the background energy */}
        <div className="absolute inset-0 opacity-[0.15]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,300 C300,400 600,100 1000,200 C1400,300 1800,100 2000,300" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M0,500 C400,600 800,200 1200,400 C1600,600 1900,300 2000,500" fill="none" stroke="#fff" strokeWidth="1" strokeDasharray="10,10" />
            <path d="M0,700 C500,800 1000,400 1500,600 C1800,700 1950,500 2000,700" fill="none" stroke="#fff" strokeWidth="4" />
          </svg>
        </div>

        {/* Floating 3D Bubbles */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-gradient-to-br from-pink-300/40 to-transparent border-[3px] border-white/40 shadow-[inset_20px_20px_40px_rgba(255,255,255,0.8),inset_-10px_-10px_30px_rgba(255,100,255,0.3),0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-sm" />
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-10 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/40 to-transparent border-[2px] border-white/50 shadow-[inset_10px_10px_20px_rgba(255,255,255,0.8),inset_-5px_-5px_15px_rgba(100,200,255,0.3),0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[2px]" />
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[45%] right-10 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200/30 to-transparent border border-white/60 shadow-[inset_8px_8px_15px_rgba(255,255,255,0.9),inset_-4px_-4px_10px_rgba(100,255,255,0.4),0_10px_25px_rgba(0,0,0,0.1)] backdrop-blur-[1px]" />
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] left-10 w-12 h-12 rounded-full bg-gradient-to-br from-white/40 to-transparent border border-white/60 shadow-[inset_4px_4px_8px_rgba(255,255,255,0.9)] backdrop-blur-sm" />

        {/* Animated mesh grid & tiny stars */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_1.5px,_transparent_1.5px)] opacity-[0.5]" style={{ backgroundSize: '70px 70px' }} />
        
        {/* Sparkles */}
        <div className="absolute top-[15%] left-[30%] w-2 h-2 bg-white rounded-full shadow-[0_0_10px_4px_rgba(255,255,255,1)]" />
        <div className="absolute top-[10%] right-[40%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_3px_rgba(255,255,255,0.8)]" />
        <div className="absolute bottom-[20%] left-[45%] w-2.5 h-2.5 bg-white rounded-full shadow-[0_0_12px_5px_rgba(255,255,255,1)]" />
      </div>

      {/* MAIN CONTAINER */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[94vw] max-w-[1300px] h-[92vh] max-h-[800px] min-h-[600px] rounded-[36px] bg-white/40 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(168,85,247,0.2),inset_0_0_0_1px_rgba(255,255,255,0.6)] flex flex-col md:flex-row border border-white/50"
      >
        
        {/* CENTER GLOWING DIVIDER WITH STAR */}
        <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-white/80 to-transparent shadow-[0_0_15px_rgba(255,255,255,1)] items-center justify-center z-20 pointer-events-none">
          <div className="relative w-6 h-6 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,1)]">
            <div className="absolute w-[2px] h-[16px] bg-white rounded-full shadow-[0_0_8px_white]" />
            <div className="absolute h-[2px] w-[16px] bg-white rounded-full shadow-[0_0_8px_white]" />
            <div className="absolute w-[1.5px] h-[10px] bg-white rounded-full rotate-45 shadow-[0_0_8px_white]" />
            <div className="absolute w-[1.5px] h-[10px] bg-white rounded-full -rotate-45 shadow-[0_0_8px_white]" />
          </div>
        </div>

        {/* LEFT SECTION (Showcase) */}
        <div className="hidden md:flex md:w-[50%] h-full bg-white/30 relative flex-col justify-between p-8 lg:p-10 xl:p-12 border-r border-white/10 rounded-l-[36px] overflow-hidden">
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 mb-6 w-fit focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-extrabold text-[22px] tracking-tight text-slate-900">Inventix</span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/50 text-[8px] font-extrabold tracking-widest text-indigo-700 uppercase shadow-sm">Enterprise ERP</span>
              </div>
            </Link>

            {/* Heading */}
            <h1 className="font-display font-extrabold text-[38px] xl:text-[44px] tracking-tight leading-[1.05] text-slate-900 mb-4">
              Reset Workspace <br/><span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Password</span>
            </h1>

            <p className="text-slate-600 text-[12px] leading-relaxed mb-6 max-w-[380px]">
              If your workspace credentials are locked or forgotten, you can request a password reset link to be sent directly to your registered business email address.
            </p>

            {/* Sub-divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-indigo-200 flex-1" />
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Enterprise Access</span>
                <div className="w-1 h-1 bg-indigo-400 rounded-full" />
              </div>
              <div className="h-px bg-indigo-200 flex-1" />
            </div>

            <div className="mb-8" />

            {/* Premium Feature Cards */}
            <div className="grid grid-cols-3 gap-3 mb-auto">
              {[
                { icon: Activity, title: "AI Procurement", desc: "Predict supplier demand and automate purchasing.", color: "text-purple-500", bg: "bg-purple-100/80" },
                { icon: Globe, title: "Unified Inventory", desc: "Manage inventory across multiple warehouses.", color: "text-cyan-500", bg: "bg-cyan-100/80" },
                { icon: Shield, title: "Enterprise Security", desc: "Role-based access and secure organization protection.", color: "text-emerald-500", bg: "bg-emerald-100/80" }
              ].map((feat, idx) => (
                <div key={idx} className="bg-white/50 backdrop-blur-md rounded-[16px] p-3.5 border border-white/80 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.05),inset_0_0_20px_rgba(255,255,255,0.6)] flex flex-col items-start relative group hover:bg-white/70 transition-colors">
                  <div className="absolute top-2 right-2 text-slate-300">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div className={`w-8 h-8 rounded-xl ${feat.bg} flex items-center justify-center shadow-sm mb-3`}>
                    <feat.icon className={`w-4 h-4 ${feat.color}`} />
                  </div>
                  <h4 className="text-[11px] font-extrabold text-slate-900 leading-tight mb-1.5">{feat.title}</h4>
                  <p className="text-[9px] text-slate-500 leading-[1.4] pr-1">{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom Statistics Row */}
            <div className="flex items-center justify-between px-2 mt-6">
              {[
                { val: "1,500+", lbl: "Organizations", icon: Users, color: "text-purple-500" },
                { val: "99.9%", lbl: "Availability", icon: Shield, color: "text-blue-500" },
                { val: "Enterprise", lbl: "Architecture", icon: Building, color: "text-pink-500" }
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg bg-white/60 shadow-sm border border-white flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display font-extrabold text-slate-900 text-[12px]">{stat.val}</span>
                    <span className="text-[8px] text-slate-500">{stat.lbl}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION (Recovery Form) */}
        <div className="w-full md:w-[50%] h-full bg-white/40 relative flex flex-col justify-center p-8 lg:p-10 xl:p-12 rounded-[36px] md:rounded-l-none md:rounded-r-[36px]">
          
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Header */}
            <div className="md:hidden mb-8 text-center">
              <Link to="/" className="inline-flex items-center gap-2 mb-4 focus:outline-none">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-extrabold text-[22px] tracking-tight text-slate-900">Inventix</span>
              </Link>
            </div>

            <div className="mb-8 text-left">
              <Link 
                to="/login" 
                className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 hover:text-indigo-600 mb-4 transition-colors group"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Sign In</span>
              </Link>
              <h2 className="text-[26px] font-extrabold text-slate-900 font-display tracking-tight leading-tight">Reset Password</h2>
              <p className="text-slate-500 text-[11.5px] mt-2 leading-relaxed">Enter your verified email to receive a password reset link.</p>
            </div>

            {success ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/90 backdrop-blur-xl border border-white rounded-[16px] p-8 text-center shadow-[0_0_15px_rgba(255,255,255,1),0_4px_20px_rgba(0,0,0,0.04)]"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-500 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-[18px] font-extrabold text-slate-900 font-display mb-2">Link Dispatched</h3>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  We have sent a password reset link directly to <strong className="text-slate-800">{email}</strong>. 
                </p>
                <p className="text-[11px] text-slate-400 mt-2 mb-6">
                  Please click the link inside the email to reset your password.
                </p>
                
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="w-full relative rounded-[14px] bg-gradient-to-r from-[#9444ff] to-[#bd44ff] text-white font-bold py-3.5 shadow-[0_8px_20px_rgba(168,85,247,0.4)] flex items-center justify-center hover:scale-[1.01] transition-transform text-[12px]"
                  >
                    Return to Sign In
                  </Link>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      setEmail("");
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
                  >
                    Use a different email
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Work Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. robert.alvarez@acme.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(undefined);
                      }}
                      className={`w-full bg-white/90 backdrop-blur-xl border-[2px] rounded-[14px] py-3 pl-10 pr-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all ${error ? 'border-rose-400 focus:border-rose-500' : 'border-white focus:border-indigo-300'}`}
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-1 text-[10px] text-rose-500 mt-1 ml-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 relative rounded-[14px] bg-gradient-to-r from-[#9444ff] to-[#bd44ff] disabled:opacity-50 text-white font-bold py-3.5 shadow-[0_8px_20px_rgba(168,85,247,0.4)] focus:outline-none flex items-center justify-center gap-2 group overflow-hidden"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 text-[12px]">{loading ? "Sending..." : "Send Reset Link"}</span>
                  <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </form>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
