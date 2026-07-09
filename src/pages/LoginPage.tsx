import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Cpu, Building, User, Mail, Lock, ArrowRight, AlertCircle, 
  CheckCircle, Shield, Briefcase, Users, Warehouse, Eye, EyeOff,
  Activity, Globe, LockKeyhole, ChevronRight, Sparkles, RefreshCw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);

  // Validation & Loading states
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState(0);
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

  const loginLogs = [
    `Establishing secure connection to enterprise server...`,
    `Authenticating user credentials...`,
    `Synchronizing physical warehouse data...`,
    `Loading dashboard configuration...`,
    `Access authorized.`
  ];

  const displayTitles = [
    "Connection Secured",
    "Credentials Verified",
    "Inventory Synchronized",
    "Workspace Loaded",
    "Authentication Complete"
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setLoginStep(0);

    // Simulated staggered loading steps while auth is processing
    const intervals = [400, 1000, 1600, 2200];
    const timeouts: NodeJS.Timeout[] = [];
    
    intervals.forEach((time, index) => {
      const t = setTimeout(() => {
        setLoginStep(index + 1);
      }, time);
      timeouts.push(t);
    });

    // Real Supabase authentication call.
    const authError = await signIn(email, password);

    if (authError) {
      // Clear timeouts if it fails early
      timeouts.forEach(clearTimeout);
      setLoading(false);
      
      const message =
        authError.message === "Invalid login credentials"
          ? "Invalid email or password. Please check your credentials and try again."
          : authError.message;
      setErrors({ general: message });
      return;
    }

    // Success path
    setTimeout(() => {
      setLoginStep(loginLogs.length - 1);
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);
      }, 500);
    }, 2800);
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

      {/* ======================================================== */}
      {/* MAIN CONTAINER                                           */}
      {/* ======================================================== */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-[94vw] max-w-[1300px] h-[92vh] max-h-[800px] min-h-[600px] rounded-[36px] bg-white/40 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(168,85,247,0.2),inset_0_0_0_1px_rgba(255,255,255,0.6)] flex border border-white/50"
      >
        
        {/* ======================================================== */}
        {/* CENTER GLOWING DIVIDER WITH STAR                         */}
        {/* ======================================================== */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-white/80 to-transparent shadow-[0_0_15px_rgba(255,255,255,1)] flex items-center justify-center z-20 pointer-events-none">
          {/* Star Icon in Middle */}
          <div className="relative w-6 h-6 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,1)]">
            <div className="absolute w-[2px] h-[16px] bg-white rounded-full shadow-[0_0_8px_white]" />
            <div className="absolute h-[2px] w-[16px] bg-white rounded-full shadow-[0_0_8px_white]" />
            <div className="absolute w-[1.5px] h-[10px] bg-white rounded-full rotate-45 shadow-[0_0_8px_white]" />
            <div className="absolute w-[1.5px] h-[10px] bg-white rounded-full -rotate-45 shadow-[0_0_8px_white]" />
          </div>
        </div>

        {/* ======================================================== */}
        {/* LEFT SECTION (Showcase)                                  */}
        {/* ======================================================== */}
        <div className="w-[50%] h-full bg-white/30 relative flex flex-col justify-between p-8 lg:p-10 xl:p-12 border-r border-white/10 rounded-l-[36px] overflow-hidden">
          
          <div className="relative z-10 h-full flex flex-col">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-extrabold text-[22px] tracking-tight text-slate-900">Inventix</span>
                <span className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-100/50 text-[8px] font-extrabold tracking-widest text-indigo-700 uppercase shadow-sm">Enterprise ERP</span>
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-display font-extrabold text-[38px] xl:text-[44px] tracking-tight leading-[1.05] text-slate-900 mb-4">
              Sign in to your <br/><span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Inventix</span> Workspace
            </h1>

            <p className="text-slate-600 text-[12px] leading-relaxed mb-6 max-w-[380px]">
              Access your unified procurement, inventory, warehouse, vendor, and AI-driven supply chain management console.
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

            {/* 3 Premium Feature Cards */}
            <div className="grid grid-cols-3 gap-3 mb-auto">
              {[
                { icon: Activity, title: "AI Procurement", desc: "Predict supplier demand and automate purchasing.", color: "text-purple-500", bg: "bg-purple-100/80" },
                { icon: Globe, title: "Unified Inventory", desc: "Manage inventory across multiple warehouses.", color: "text-cyan-500", bg: "bg-cyan-100/80" },
                { icon: Shield, title: "Enterprise Security", desc: "Role-based access and secure organization protection.", color: "text-emerald-500", bg: "bg-emerald-100/80" }
              ].map((feat, idx) => (
                <div key={idx} className="bg-white/50 backdrop-blur-md rounded-[16px] p-3.5 border border-white/80 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.05),inset_0_0_20px_rgba(255,255,255,0.6)] flex flex-col items-start relative group hover:bg-white/70 transition-colors">
                  <div className="absolute top-2 right-2 text-white opacity-50">
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

        {/* ======================================================== */}
        {/* RIGHT SECTION (Login Form)                               */}
        {/* ======================================================== */}
        <div className="w-[50%] h-full bg-white/40 relative flex flex-col justify-center p-8 lg:p-10 xl:p-12 rounded-r-[36px]">
        
          <AnimatePresence mode="wait">
            {!loading && !success && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md mx-auto"
              >
                 <div className="mb-8 text-left">
                   <h2 className="text-[26px] font-extrabold text-slate-900 font-display tracking-tight leading-tight">Sign In</h2>
                   <p className="text-slate-500 text-[11.5px] mt-2 leading-relaxed">Access your procurement and inventory management suite.</p>
                 </div>

                 <form onSubmit={handleLogin} className="space-y-4">
                   
                   {/* General Auth Error */}
                   {errors.general && (
                     <div className="flex items-center gap-2 p-3 rounded-[12px] border border-rose-500/30 bg-rose-500/10 text-[11px] text-rose-600 font-medium">
                       <AlertCircle className="w-4 h-4 shrink-0" />
                       <span className="leading-relaxed">{errors.general}</span>
                     </div>
                   )}

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
                           if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                         }}
                         className={`w-full bg-white/90 backdrop-blur-xl border-[2px] rounded-[14px] py-3 pl-10 pr-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all ${errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-white focus:border-indigo-300'}`}
                       />
                     </div>
                     {errors.email && <p className="text-[9px] text-rose-500 ml-1 font-medium">{errors.email}</p>}
                   </div>

                   {/* Password */}
                   <div className="flex flex-col gap-1.5">
                     <div className="flex items-center justify-between ml-1">
                       <label className="text-[11.5px] font-bold text-slate-800 tracking-wide uppercase">Password</label>
                       <Link 
                         to="/forgot-password" 
                         className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 hover:underline"
                       >
                         Forgot password?
                       </Link>
                     </div>
                     <div className="relative flex items-center">
                       <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                       <input
                         type={showPassword ? "text" : "password"}
                         required
                         placeholder="••••••••••••"
                         value={password}
                         onChange={(e) => {
                           setPassword(e.target.value);
                           if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                         }}
                         className={`w-full bg-white/90 backdrop-blur-xl border-[2px] rounded-[14px] py-3 pl-10 pr-10 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all ${errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-white focus:border-indigo-300'}`}
                       />
                       <button 
                         type="button" 
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-3.5 text-slate-400 hover:text-indigo-500 focus:outline-none"
                       >
                         {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                       </button>
                     </div>
                     {errors.password && <p className="text-[9px] text-rose-500 ml-1 font-medium">{errors.password}</p>}
                   </div>

                   {/* Remember Me */}
                   <div className="flex items-center ml-1 py-2">
                     <input
                       id="remember-me"
                       type="checkbox"
                       checked={rememberMe}
                       onChange={(e) => setRememberMe(e.target.checked)}
                       className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
                     />
                     <label htmlFor="remember-me" className="ml-2.5 text-[11px] font-medium text-slate-600 cursor-pointer select-none">
                       Remember me on this device
                     </label>
                   </div>

                   {/* Submit Button */}
                   <motion.button
                     whileHover={{ scale: 1.01 }}
                     whileTap={{ scale: 0.98 }}
                     type="submit"
                     className="w-full mt-2 relative rounded-[14px] bg-gradient-to-r from-[#9444ff] to-[#bd44ff] text-white font-bold py-3.5 shadow-[0_8px_20px_rgba(168,85,247,0.4)] focus:outline-none flex items-center justify-center gap-2 group overflow-hidden"
                   >
                     <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                     <span className="relative z-10 text-[12px]">Sign In</span>
                     <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />
                   </motion.button>

                   {/* Registration Link */}
                   <div className="text-center pt-4 text-[11px]">
                     <p className="text-slate-500">
                       Don't have a registered corporate workspace?{" "}
                       <Link 
                         to="/register-company" 
                         className="text-indigo-600 font-bold hover:underline"
                       >
                         Register Company
                       </Link>
                     </p>
                   </div>
                 </form>
              </motion.div>
            )}

            {/* ENTERPRISE LOADING STATE */}
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-sm mx-auto"
              >
                <div className="mb-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Opening Workspace</h3>
                  <p className="text-slate-500 text-[11px] mt-1.5">Authenticating secure enterprise connection.</p>
                </div>

                <div className="space-y-4 relative pl-3">
                  {loginLogs.map((log, index) => {
                    const isActive = loginStep === index;
                    const isCompleted = loginStep > index;
                    const isPending = loginStep < index;

                    return (
                      <div key={index} className="flex items-start gap-4 relative group">
                        {/* Glowing Connector Line */}
                        {index < loginLogs.length - 1 && (
                          <div className={`absolute left-3.5 top-8 bottom-[-16px] w-[2px] transition-colors duration-700 rounded-full ${isCompleted ? 'bg-gradient-to-b from-emerald-400 to-emerald-300' : 'bg-slate-200'}`} />
                        )}
                        
                        {/* Premium Status Icon */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-500 ${
                          isCompleted ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-300" :
                          isActive ? "bg-white border-2 border-indigo-500 text-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.3)]" :
                          "bg-slate-50 border border-slate-300 text-slate-400"
                        }`}>
                          {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : 
                           isActive ? <motion.div animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2.5 h-2.5 bg-indigo-500 rounded-full" /> : 
                           <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
                        </div>

                        {/* Animated Text Block */}
                        <motion.div 
                          initial={false}
                          animate={{ opacity: isPending ? 0.4 : 1, x: isActive ? 2 : 0 }}
                          transition={{ duration: 0.5 }}
                          className="flex-1 pt-0.5"
                        >
                          <h4 className={`text-[12px] font-bold ${isCompleted ? 'text-slate-900' : isActive ? 'text-indigo-700' : 'text-slate-500'}`}>
                            {displayTitles[index]}
                          </h4>
                          <AnimatePresence>
                            {(isActive || isCompleted) && (
                              <motion.p 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="text-[10px] text-slate-500 leading-tight mt-1"
                              >
                                {log}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* LUXURIOUS SUCCESS SCREEN */}
            {success && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="w-full max-w-sm mx-auto text-center"
              >
                <div className="relative w-24 h-24 mx-auto mb-8">
                  {/* Glowing Particles */}
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                      animate={{ 
                        opacity: [1, 1, 0], 
                        scale: Math.random() * 2 + 0.5,
                        x: (Math.random() - 0.5) * 300, 
                        y: (Math.random() - 0.5) * 300 - 50
                      }}
                      transition={{ duration: 2 + Math.random(), ease: "easeOut" }}
                      className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${
                        ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-emerald-500', 'bg-cyan-500'][i % 5]
                      } blur-[1px]`}
                    />
                  ))}
                  
                  {/* Emerald Success Icon */}
                  <motion.div 
                    initial={{ scale: 0, rotate: -45 }} 
                    animate={{ scale: 1, rotate: 0 }} 
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center shadow-[0_0_50px_rgba(52,211,153,0.5)] border border-emerald-300"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>
                </div>

                <motion.h2 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-slate-900 font-display mb-2"
                >
                  Access Granted
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="text-slate-500 text-[12px] mb-8 leading-relaxed px-4"
                >
                  Authentication successful. Redirecting to your secure dashboard...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
