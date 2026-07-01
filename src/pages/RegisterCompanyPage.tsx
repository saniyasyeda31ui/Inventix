import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Cpu, Building, User, Mail, Lock, ArrowRight, AlertCircle, 
  CheckCircle, Shield, Briefcase, Users, Warehouse, Settings, Sliders 
} from "lucide-react";

export default function RegisterCompanyPage() {
  const navigate = useNavigate();

  // Form Fields
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("Manufacturing");
  const [companySize, setCompanySize] = useState("51-200");
  const [warehouses, setWarehouses] = useState("2-5");
  const [adminName, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI state
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

  // Enterprise Provisioning Logs
  const provisioningLogs = [
    `Provisioning dedicated database instances...`,
    `Configuring tables for industry operations...`,
    `Setting up safety stock levels and inventory parameters...`,
    `Initializing custom multi-tier procurement approval workflows...`,
    `Binding administrator permissions to profile...`,
    `Enterprise workspace established successfully.`
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

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setProvisioningStep(0);

    // Dynamic step-by-step provisioning simulation
    const intervals = [800, 1800, 2800, 3800, 4800, 5800];
    intervals.forEach((time, index) => {
      setTimeout(() => {
        setProvisioningStep(index + 1);
        if (index === intervals.length - 1) {
          setTimeout(() => {
            setLoading(false);
            setSuccess(true);
          }, 400);
        }
      }, time);
    });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[150px] pointer-events-none" />

      {/* LEFT SIDE - Split Screen Value highlights */}
      <div className="hidden md:flex md:w-[40%] lg:w-[45%] bg-[#02050c]/85 border-r border-slate-900/60 p-12 flex-col justify-between relative z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2.5 group w-fit focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-xl p-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight text-white block">Inventix</span>
            <span className="text-[9px] font-mono tracking-widest text-indigo-400 uppercase font-medium">Enterprise Sourcing</span>
          </div>
        </Link>

        {/* Info list */}
        <div className="space-y-8 my-auto">
          <div className="space-y-4">
            <h1 className="font-display font-bold text-2xl lg:text-3xl xl:text-4xl tracking-tight leading-tight text-white">
              Initialize Your <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Company Workspace</span>
            </h1>
            <p className="text-slate-400 text-xs lg:text-sm leading-relaxed">
              Gain complete visibility over products, vendors, stock levels, multi-tier approvals, and physical warehouses under a single integrated platform.
            </p>
          </div>

          <div className="space-y-4">
            {/* Core Feature Benefit 1 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Real-Time Data Sync</h4>
                <p className="text-[11px] text-slate-500">Every product transaction, stock update, and shipment is logged in real-time.</p>
              </div>
            </div>

            {/* Core Feature Benefit 2 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Procurement Controls</h4>
                <p className="text-[11px] text-slate-500">Manage spend limits, approval workflows, and purchase orders based on employee roles.</p>
              </div>
            </div>

            {/* Core Feature Benefit 3 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Warehouse className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Multi-Warehouse Management</h4>
                <p className="text-[11px] text-slate-500">Track and manage inventory across all physical and digital warehouse locations globally.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security verification */}
        <div className="text-[10px] text-slate-500 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>AI-Powered Procurement & Inventory Workspace</span>
        </div>
      </div>

      {/* RIGHT SIDE - Registration form with full steps */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-16 relative z-10 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          
          {/* Mobile brand header */}
          <div className="flex flex-col items-center text-center md:hidden mb-6">
            <Link to="/" className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Cpu className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">Inventix</span>
            </Link>
            <h2 className="text-xl font-bold text-white">Register Company Workspace</h2>
            <p className="text-slate-400 text-xs mt-1">Configure your procurement and inventory network</p>
          </div>

          <div className="hidden md:block">
            <h2 className="text-2xl font-bold text-white tracking-tight font-display">Register Company Workspace</h2>
            <p className="text-slate-400 text-xs mt-1.5">
              Enter your business details to initialize your procurement and inventory workspace.
            </p>
          </div>

          {success ? (
            /* Immersive Success Onboarding screen */
            <div className="p-8 rounded-2xl border border-emerald-500/25 bg-emerald-500/5 text-center space-y-5 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/10">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white font-display">Workspace Provisioned Successfully!</h3>
                <p className="text-slate-300 text-xs leading-relaxed max-w-sm mx-auto">
                  A high-performance business environment has been established for <strong className="text-white">{companyName}</strong>. Your administrative credentials have been securely bound to your workspace profile.
                </p>
              </div>
              <div className="pt-4 flex flex-col gap-2">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-500/10"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  to="/login"
                  className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline block pt-2"
                >
                  Sign In to existing workspace
                </Link>
              </div>
            </div>
          ) : loading ? (
            /* Immersive provisioning terminal animation */
            <div className="p-6 rounded-2xl border border-slate-900 bg-[#02050b] space-y-4 font-mono text-xs animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest animate-pulse">Setting Up Workspace...</span>
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
              </div>
              
              <div className="p-4 bg-black/60 rounded-xl border border-slate-950 text-indigo-300/90 space-y-2.5 max-h-[250px] overflow-y-auto leading-relaxed">
                <div>[SYSTEM] Initializing database workspace setup...</div>
                {provisioningStep >= 1 && <div className="text-emerald-400">[OK] Dedicated database storage established for {companyName}.</div>}
                {provisioningStep >= 2 && <div>[SYSTEM] Creating product tables for {industry} industry models...</div>}
                {provisioningStep >= 3 && <div className="text-emerald-400">[OK] Safety stock alerts mapped for {warehouses} warehouses.</div>}
                {provisioningStep >= 4 && <div>[SYSTEM] Configured multi-tier approval levels.</div>}
                {provisioningStep >= 5 && <div className="text-emerald-400">[OK] Administrator rights allocated to {email}.</div>}
                {provisioningStep >= 6 && <div className="text-indigo-400 animate-pulse font-bold">{provisioningLogs[5]}</div>}
              </div>

              <div className="w-full bg-slate-900 rounded-full h-1 mt-2 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-1 rounded-full transition-all duration-300" 
                  style={{ width: `${(provisioningStep / provisioningLogs.length) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 text-center">Configuring inventory workspace. Please wait.</p>
            </div>
          ) : (
            /* Standard Registration form with requested layout */
            <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Company Name */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Name</label>
                <div className="relative">
                  <Building className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.companyName ? "text-rose-500" : "text-slate-500"}`} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Sourcing International"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (errors.companyName) setErrors((prev) => ({ ...prev, companyName: undefined }));
                    }}
                    className={`w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-950/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      errors.companyName 
                        ? "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500" 
                        : "border-slate-800/80 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.companyName && (
                  <div className="flex items-center gap-1 text-[11px] text-rose-500 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.companyName}</span>
                  </div>
                )}
              </div>

              {/* Industry */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Industry</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full pl-11 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Aerospace">Aerospace / Defense</option>
                    <option value="Electronics">Electronics / Tech</option>
                    <option value="Chemicals">Chemicals / Pharma</option>
                    <option value="Logistics">Logistics / Distribution Hubs</option>
                    <option value="Other">Other Industrial</option>
                  </select>
                </div>
              </div>

              {/* Company Size */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Company Size</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    value={companySize}
                    onChange={(e) => setCompanySize(e.target.value)}
                    className="w-full pl-11 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="1-50">1 - 50 employees</option>
                    <option value="51-200">51 - 200 employees</option>
                    <option value="201-1000">201 - 1000 employees</option>
                    <option value="1000+">1000+ Enterprise Tier</option>
                  </select>
                </div>
              </div>

              {/* Number of Warehouses */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Warehouses Fleet</label>
                <div className="relative">
                  <Warehouse className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    value={warehouses}
                    onChange={(e) => setWarehouses(e.target.value)}
                    className="w-full pl-11 pr-8 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer"
                  >
                    <option value="1">1 Warehouse</option>
                    <option value="2-5">2 to 5 Locations</option>
                    <option value="6-15">6 to 15 Locations</option>
                    <option value="15+">15+ Global Hubs</option>
                  </select>
                </div>
              </div>

              {/* Admin Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin Name</label>
                <div className="relative">
                  <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.adminName ? "text-rose-500" : "text-slate-500"}`} />
                  <input
                    type="text"
                    required
                    placeholder="Dr. Robert Alvarez"
                    value={adminName}
                    onChange={(e) => {
                      setAdminName(e.target.value);
                      if (errors.adminName) setErrors((prev) => ({ ...prev, adminName: undefined }));
                    }}
                    className={`w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-950/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      errors.adminName 
                        ? "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500" 
                        : "border-slate-800/80 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.adminName && (
                  <div className="flex items-center gap-1 text-[11px] text-rose-500 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.adminName}</span>
                  </div>
                )}
              </div>

              {/* Business Email */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Business Email</label>
                <div className="relative">
                  <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.email ? "text-rose-500" : "text-slate-500"}`} />
                  <input
                    type="email"
                    required
                    placeholder="alvarez@acme-sourcing.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    className={`w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-950/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      errors.email 
                        ? "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500" 
                        : "border-slate-800/80 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-[11px] text-rose-500 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.password ? "text-rose-500" : "text-slate-500"}`} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    className={`w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-950/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      errors.password 
                        ? "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500" 
                        : "border-slate-800/80 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-[11px] text-rose-500 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.password}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${errors.confirmPassword ? "text-rose-500" : "text-slate-500"}`} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    className={`w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border bg-slate-950/40 text-white placeholder-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      errors.confirmPassword 
                        ? "border-rose-500/50 focus:ring-rose-500/20 focus:border-rose-500" 
                        : "border-slate-800/80 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                  />
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1 text-[11px] text-rose-500 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errors.confirmPassword}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="sm:col-span-2 mt-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all duration-300 shadow-xl shadow-indigo-950/50 hover:shadow-indigo-500/10 flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.01] active:scale-[0.99] focus:outline-none"
              >
                <span>Register Company</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Toggle to sign-in */}
              <div className="sm:col-span-2 text-center pt-2 text-xs">
                <p className="text-slate-500">
                  Already registered?{" "}
                  <Link 
                    to="/login" 
                    className="text-indigo-400 hover:text-indigo-300 hover:underline font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1"
                  >
                    Sign in to workspace
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
