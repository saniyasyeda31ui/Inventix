import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Cpu, Building, User, Mail, Lock, ArrowRight, AlertCircle,
  CheckCircle, Shield, Briefcase, Users, Warehouse, Eye, EyeOff,
  Activity, Globe, LockKeyhole, ChevronRight, Sparkles
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function RegisterCompanyPage() {
  const navigate = useNavigate();

  // Form Fields - Unmodified logic
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("Manufacturing");
  const [companySize, setCompanySize] = useState("51-200");
  const [warehouses, setWarehouses] = useState("2-5");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // UI state - Unmodified logic
  const [errors, setErrors] = useState<{
    companyName?: string;
    adminName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [provisioningStep, setProvisioningStep] = useState(0);
  const [success, setSuccess] = useState(false);

  // Enterprise Provisioning Logs - Unmodified content logic
  const provisioningLogs = [
    `Provisioning dedicated database instances...`,
    `Configuring tables for industry operations...`,
    `Setting up safety stock levels and inventory parameters...`,
    `Initializing custom multi-tier procurement approval workflows...`,
    `Binding administrator permissions to profile...`,
    `Enterprise workspace established successfully.`
  ];

  const displayTitles = [
    "Database Provisioned",
    "Warehouse Engine Initialized",
    "Inventory Service Ready",
    "RBAC Configured",
    "AI Engine Connected",
    "Workspace Ready"
  ];

  const validateForm = () => {
    const tempErrors: typeof errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!companyName.trim()) tempErrors.companyName = "Company name is required";
    if (!adminName.trim()) tempErrors.adminName = "Administrator name is required";

    if (!email) {
      tempErrors.email = "Work email address is required";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Please enter a valid work email address";
    }

    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
    }

    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setProvisioningStep(0);

    // Dynamic step-by-step provisioning simulation for UI Polish
    const intervals = [800, 1800, 2800, 3800, 4800];
    const timeouts: NodeJS.Timeout[] = [];
    
    intervals.forEach((time, index) => {
      const t = setTimeout(() => {
        setProvisioningStep(index + 1);
      }, time);
      timeouts.push(t);
    });

    const startTime = Date.now();

    try {
      // 1. Clear any existing session first
      await supabase.auth.signOut();

      // 2. Create the new workspace user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: adminName,
            role: 'admin',
            organization: companyName
          }
        }
      });

      if (error) {
        timeouts.forEach(clearTimeout);
        setLoading(false);
        const errorMessage = error.message === "{}" || error.message === "{}" 
          ? "This email address is already registered." 
          : error.message;
        setErrors({ email: errorMessage });
        return;
      }

      // 3. Insert into public.companies if a session was created (requires Email Confirmations to be disabled)
      if (data.session) {
        await supabase.from('companies').insert([{
          name: companyName,
          tax_identifier: `TIN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          address_line_1: 'Enterprise Headquarters',
          city: 'San Francisco',
          state: 'CA',
          postal_code: '94105',
          country: 'United States',
          fiscal_year_start: '2026-01-01'
        }]);
      } else {
        // If there is no session, it means Email Confirmations are ENABLED in Supabase.
        // The company table insert will fail due to RLS, and the user cannot log in.
        timeouts.forEach(clearTimeout);
        setLoading(false);
        setErrors({ 
          email: "Success! But Email Confirmations are enabled in Supabase. Please disable 'Confirm Email' in your Supabase Auth settings to fully provision the workspace and login." 
        });
        return;
      }

      // Ensure the session is cleared so they have to log in on the next screen
      await supabase.auth.signOut();

      // Wait for the remaining animation time before showing success
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 5800 - elapsed);

      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, remainingTime);

    } catch (err: any) {
      timeouts.forEach(clearTimeout);
      setLoading(false);
      const errMessage = err.message === "{}" ? "This email address is already registered." : (err.message || 'An error occurred during registration.');
      setErrors({ email: errMessage });
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
        {/* Bottom Left Huge Bubble */}
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-10 -left-10 w-64 h-64 rounded-full bg-gradient-to-br from-pink-300/40 to-transparent border-[3px] border-white/40 shadow-[inset_20px_20px_40px_rgba(255,255,255,0.8),inset_-10px_-10px_30px_rgba(255,100,255,0.3),0_20px_50px_rgba(0,0,0,0.1)] backdrop-blur-sm" />

        {/* Top Right Bubble */}
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute top-10 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-blue-200/40 to-transparent border-[2px] border-white/50 shadow-[inset_10px_10px_20px_rgba(255,255,255,0.8),inset_-5px_-5px_15px_rgba(100,200,255,0.3),0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur-[2px]" />

        {/* Middle Right Bubble */}
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[45%] right-10 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-200/30 to-transparent border border-white/60 shadow-[inset_8px_8px_15px_rgba(255,255,255,0.9),inset_-4px_-4px_10px_rgba(100,255,255,0.4),0_10px_25px_rgba(0,0,0,0.1)] backdrop-blur-[1px]" />

        {/* Top Left Tiny Bubble */}
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
              Create Your <br /><span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Inventix</span> Workspace
            </h1>

            <p className="text-slate-600 text-[12px] leading-relaxed mb-6 max-w-[380px]">
              Register your organization and unify procurement, inventory, warehouses, vendors, finance, analytics, approvals and AI into one intelligent enterprise workspace.
            </p>

            {/* Sub-divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-indigo-200 flex-1" />
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-indigo-400 rounded-full" />
                <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Enterprise Journey</span>
                <div className="w-1 h-1 bg-indigo-400 rounded-full" />
              </div>
              <div className="h-px bg-indigo-200 flex-1" />
            </div>

            {/* Horizontal Timeline */}
            <div className="relative flex items-center justify-between mb-8 px-2 max-w-[360px] mx-auto w-full">
              {/* Line behind */}
              <div className="absolute top-[18px] left-6 right-6 h-[2px] bg-gradient-to-r from-indigo-300 via-indigo-200 to-indigo-100 z-0" />

              {/* Step 1 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-[13px] shadow-[0_0_15px_rgba(139,92,246,0.6)] border-[2px] border-white/80">
                  01
                </div>
                <span className="text-[10px] font-bold text-indigo-700 text-center leading-[1.2]">Register<br />Company</span>
              </div>

              {/* Step 2 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-indigo-400 font-bold text-[13px] border-[2px] border-white shadow-sm backdrop-blur-sm">
                  02
                </div>
                <span className="text-[10px] font-semibold text-slate-400 text-center leading-[1.2]">Configure<br />Warehouses</span>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-white/80 flex items-center justify-center text-indigo-400 font-bold text-[13px] border-[2px] border-white shadow-sm backdrop-blur-sm">
                  03
                </div>
                <span className="text-[10px] font-semibold text-slate-400 text-center leading-[1.2]">Import<br />Inventory</span>
              </div>
            </div>

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
        {/* RIGHT SECTION (Registration Form)                        */}
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
                <div className="mb-6 text-left">
                  <h2 className="text-[26px] font-extrabold text-slate-900 font-display tracking-tight leading-tight">Register Company Workspace</h2>
                  <p className="text-slate-500 text-[11.5px] mt-2 leading-relaxed">Enter your business details to initialize your procurement and inventory workspace.</p>
                </div>

                <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">

                  {/* Company Name (External Label, glowing input) */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide">Company Name</label>
                    <div className="relative flex items-center">
                      <Building className="absolute left-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Acme Corp"
                        value={companyName}
                        onChange={(e) => {
                          setCompanyName(e.target.value);
                          if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: undefined }));
                        }}
                        className={`w-full bg-white/90 backdrop-blur-xl border-[2px] rounded-[14px] py-2.5 pl-10 pr-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all ${errors.companyName ? 'border-rose-400 focus:border-rose-500' : 'border-white focus:border-indigo-300'}`}
                      />
                    </div>
                    {errors.companyName && <p className="text-[9px] text-rose-500 ml-1 font-medium">{errors.companyName}</p>}
                  </div>

                  {/* Industry */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide">Industry</label>
                    <div className="relative flex items-center">
                      <Briefcase className="absolute left-3.5 w-4 h-4 text-slate-400" />
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-2.5 pl-10 pr-8 text-[13px] font-bold text-slate-900 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Aerospace">Aerospace</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Chemicals">Chemicals</option>
                        <option value="Logistics">Logistics</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Company Size */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide">Company Size</label>
                    <div className="relative flex items-center">
                      <Users className="absolute left-3.5 w-4 h-4 text-slate-400" />
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-2.5 pl-10 pr-8 text-[13px] font-bold text-slate-900 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="1-50">1 - 50 employees</option>
                        <option value="51-200">51 - 200 employees</option>
                        <option value="201-1000">201 - 1000 employees</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Warehouse Fleet */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide">Warehouse Fleet</label>
                    <div className="relative flex items-center">
                      <Warehouse className="absolute left-3.5 w-4 h-4 text-slate-400" />
                      <select
                        value={warehouses}
                        onChange={(e) => setWarehouses(e.target.value)}
                        className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-2.5 pl-10 pr-8 text-[13px] font-bold text-slate-900 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="1">1 Location</option>
                        <option value="2-5">2 to 5 Locations</option>
                        <option value="6-15">6 to 15 Locations</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronRight className="w-3.5 h-3.5 rotate-90" />
                      </div>
                    </div>
                  </div>

                  {/* Admin Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide">Admin Name</label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="Dr. Robert Alvarez"
                        value={adminName}
                        onChange={(e) => {
                          setAdminName(e.target.value);
                          if (errors.adminName) setErrors((prev) => ({ ...prev, adminName: undefined }));
                        }}
                        className={`w-full bg-white/90 backdrop-blur-xl border-[2px] rounded-[14px] py-2.5 pl-10 pr-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all ${errors.adminName ? 'border-rose-400 focus:border-rose-500' : 'border-white focus:border-indigo-300'}`}
                      />
                    </div>
                    {errors.adminName && <p className="text-[9px] text-rose-500 ml-1 font-medium">{errors.adminName}</p>}
                  </div>

                  {/* Business Email */}
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide">Business Email</label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="admin1@test.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                        }}
                        className={`w-full bg-white/90 backdrop-blur-xl border-[2px] rounded-[14px] py-2.5 pl-10 pr-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all ${errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-white focus:border-indigo-300'}`}
                      />
                    </div>
                    {errors.email && <p className="text-[9px] text-rose-500 ml-1 font-medium">{errors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide">Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="•••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                        }}
                        className={`w-full bg-white/90 backdrop-blur-xl border-[2px] rounded-[14px] py-2.5 pl-10 pr-10 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all ${errors.password ? 'border-rose-400 focus:border-rose-500' : 'border-white focus:border-indigo-300'}`}
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

                  {/* Confirm Password */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide">Confirm Password</label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="•••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }}
                        className={`w-full bg-white/90 backdrop-blur-xl border-[2px] rounded-[14px] py-2.5 pl-10 pr-10 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all ${errors.confirmPassword ? 'border-rose-400 focus:border-rose-500' : 'border-white focus:border-indigo-300'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 text-slate-400 hover:text-indigo-500 focus:outline-none"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-[9px] text-rose-500 ml-1 font-medium">{errors.confirmPassword}</p>}
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="sm:col-span-2 mt-3 relative rounded-[14px] bg-gradient-to-r from-[#9444ff] to-[#bd44ff] text-white font-bold py-3 shadow-[0_8px_20px_rgba(168,85,247,0.4)] focus:outline-none flex items-center justify-center gap-2 group overflow-hidden"
                  >
                    {/* Glossy shine */}
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                    <span className="relative z-10 text-[12px]">Register Company</span>
                    <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  {/* Toggle to sign-in */}
                  <div className="sm:col-span-2 text-center pt-2 text-[11px]">
                    <p className="text-slate-500">
                      Already registered?{" "}
                      <Link
                        to="/login"
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Sign in to workspace
                      </Link>
                    </p>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ENTERPRISE DEPLOYMENT PANEL (PROVISIONING SCREEN) */}
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
                  <h3 className="text-xl font-bold text-slate-900 font-display">Deploying Workspace</h3>
                  <p className="text-slate-500 text-[11px] mt-1.5">Initializing intelligent enterprise modules.</p>
                </div>

                <div className="space-y-4 relative pl-3">
                  {provisioningLogs.map((log, index) => {
                    const isActive = provisioningStep === index;
                    const isCompleted = provisioningStep > index;
                    const isPending = provisioningStep < index;

                    return (
                      <div key={index} className="flex items-start gap-4 relative group">
                        {/* Glowing Connector Line */}
                        {index < provisioningLogs.length - 1 && (
                          <div className={`absolute left-3.5 top-8 bottom-[-16px] w-[2px] transition-colors duration-700 rounded-full ${isCompleted ? 'bg-gradient-to-b from-emerald-400 to-emerald-300' : 'bg-slate-200'}`} />
                        )}

                        {/* Premium Status Icon */}
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-all duration-500 ${isCompleted ? "bg-gradient-to-br from-emerald-400 to-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] border border-emerald-300" :
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
                      className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-emerald-500', 'bg-cyan-500'][i % 5]
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
                  Workspace Ready
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                  className="text-slate-500 text-[12px] mb-8 leading-relaxed px-4"
                >
                  Your enterprise workspace has been successfully provisioned. <strong>{companyName}</strong> is now live on the Inventix network.
                </motion.p>

                <motion.button
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/login")}
                  className="w-full py-3.5 rounded-[14px] bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.4)] flex items-center justify-center gap-2 focus:outline-none text-[13px] group"
                >
                  Continue to Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
