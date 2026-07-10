import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles, CheckCircle2, ChevronRight, Activity, Zap, Play, Search, Network, ArrowUpRight, Database, Shield, Layers, Users, TrendingUp, Package, Truck
} from "lucide-react";
import { motion, useAnimation } from "motion/react";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section id="hero" className="relative lg:h-screen lg:min-h-[700px] flex items-center pt-20 pb-0 z-10 overflow-visible">

      {/* Hero Specific Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] bg-pink-300/30 rounded-full blur-[140px] mix-blend-multiply"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[5%] right-[5%] w-[45vw] h-[45vw] bg-violet-400/30 rounded-full blur-[150px] mix-blend-multiply"
        />

        {/* Hero Specific 3D Bubbles */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[45%] w-32 h-32 rounded-full bg-gradient-to-br from-white/60 via-indigo-200/40 to-purple-400/40 backdrop-blur-sm shadow-[inset_-10px_-10px_25px_rgba(139,92,246,0.3),_0_20px_40px_rgba(0,0,0,0.1)] border border-white/60 z-30"
        />
        <motion.div
          animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[5%] left-[52%] w-12 h-12 rounded-full bg-gradient-to-br from-white/70 via-purple-300/40 to-indigo-500/40 backdrop-blur-sm shadow-[inset_-5px_-5px_15px_rgba(99,102,241,0.4),_0_10px_20px_rgba(0,0,0,0.1)] border border-white/50 z-20"
        />
        
        <motion.div
          animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] left-[38%] w-28 h-28 rounded-full bg-gradient-to-br from-white/60 via-indigo-300/40 to-violet-500/40 backdrop-blur-sm shadow-[inset_-15px_-10px_20px_rgba(109,76,255,0.4),_0_25px_45px_rgba(0,0,0,0.15)] border border-white/60 z-30"
        />
        <motion.div
          animate={{ y: [0, -10, 0], x: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[10%] left-[35%] w-10 h-10 rounded-full bg-gradient-to-br from-white/70 via-blue-200/40 to-indigo-400/40 backdrop-blur-sm shadow-[inset_-4px_-4px_10px_rgba(99,102,241,0.3),_0_5px_15px_rgba(0,0,0,0.05)] border border-white/60 z-20"
        />

        <motion.div
          animate={{ y: [0, -15, 0], x: [0, -10, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-[35%] right-[2%] w-16 h-16 rounded-full bg-gradient-to-br from-white/80 via-pink-200/50 to-rose-400/50 backdrop-blur-sm shadow-[inset_-8px_-8px_15px_rgba(244,114,182,0.4),_0_15px_30px_rgba(0,0,0,0.1)] border border-white/60 z-30"
        />
        
        {/* Cyan/Blue Bubble Bottom Right */}
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[5%] right-[5%] w-36 h-36 rounded-full bg-gradient-to-tl from-white/80 via-cyan-300/60 to-blue-500/60 backdrop-blur-sm shadow-[inset_-10px_-10px_25px_rgba(6,182,212,0.4),_0_20px_40px_rgba(0,0,0,0.1)] border border-white/60 z-30"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center h-full">

        {/* LEFT COLUMN: 50% */}
        <div className="lg:col-span-6 flex flex-col items-start text-left pt-4 lg:pt-0">

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-100 bg-white/70 backdrop-blur-md shadow-sm text-[11px] text-indigo-600 font-bold mb-6 hover:shadow transition-all duration-300 uppercase tracking-widest"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI-Powered Enterprise ERP</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-display font-extrabold tracking-tight mb-6 drop-shadow-sm"
          >
            <span className="block text-6xl md:text-[80px] leading-[1] bg-gradient-to-r from-[#6D4CFF] via-[#4F8CFF] to-[#FFB6E6] bg-clip-text text-transparent pb-2 mb-2">
              Inventix
            </span>
            <span className="text-4xl md:text-[52px] font-bold text-[#101828] tracking-tight leading-[1.1] block">
              The Future of Intelligent Enterprise Operations
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-[#667085] text-lg md:text-[19px] leading-relaxed max-w-[480px] mb-8 font-sans font-medium"
          >
            Inventix unifies Procurement, Inventory, Warehouses, Vendors, Manufacturing, Finance, Analytics, and AI into one seamless, modern enterprise platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6D4CFF] to-[#8B5CF6] hover:from-[#7C5CFF] hover:to-[#9D76F9] text-white font-bold text-[15px] transition-all duration-300 shadow-[0_10px_25px_-5px_rgba(109,76,255,0.4)] hover:shadow-[0_15px_35px_-5px_rgba(109,76,255,0.6)] flex items-center justify-center gap-2 group cursor-pointer hover:-translate-y-0.5"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-200 bg-white/60 backdrop-blur-md hover:bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-200 font-bold text-[15px] transition-all duration-300 shadow-sm hover:shadow hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Play className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              <span>Request Demo</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex flex-wrap items-center gap-2.5 mt-10 text-xs font-semibold text-slate-600 max-w-[500px]"
          >
            {[
              { icon: Zap, label: "AI Powered" },
              { icon: Activity, label: "Real-Time Analytics" },
              { icon: Layers, label: "Multi Warehouse" },
              { icon: Shield, label: "Enterprise Security" },
              { icon: Users, label: "Role-Based Access" },
              { icon: TrendingUp, label: "Predictive AI" },
            ].map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:bg-white hover:border-indigo-100 hover:text-[#6D4CFF] transition-all cursor-default group"
              >
                <badge.icon className="w-3.5 h-3.5 text-indigo-400 group-hover:text-[#6D4CFF] transition-colors" />
                <span>{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 50% */}
        <div className="lg:col-span-6 relative w-full flex items-center justify-center perspective-[1200px] mt-6 lg:mt-0 lg:pl-8 py-10 lg:py-0">

          {/* Main Dashboard Panel */}
          <motion.div
            animate={{
              x: [-15, 15, -15]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-full bg-white/90 backdrop-blur-[32px] rounded-[32px] border border-white/80 shadow-[0_50px_100px_-20px_rgba(109,76,255,0.15),0_0_0_1px_rgba(255,255,255,0.5)_inset] overflow-hidden relative z-20 flex flex-col"
          >
            {/* Top Window Bar */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white/50 backdrop-blur-md">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
                <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300" />
              </div>
              <div className="flex-1 flex justify-center items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase font-mono">Inventix-Workspace</span>
              </div>
              <div className="w-14" />
            </div>

            {/* Dashboard Content */}
            <div className="p-3 grid grid-cols-12 gap-2.5 bg-[#F8FAFC] overflow-hidden">

              {/* KPIs */}
              <div className="col-span-12 grid grid-cols-4 gap-2.5">
                {[
                  { label: "Total Spend", value: "$24.8M", trend: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Inventory", value: "$18.6M", trend: "-2.1%", color: "text-rose-600", bg: "bg-rose-50" },
                  { label: "Purchase Orders", value: "1,248", trend: "+8.2%", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { label: "Vendor Score", value: "94.2", trend: "+1.5%", color: "text-emerald-600", bg: "bg-emerald-50" },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white/90 backdrop-blur-sm rounded-[16px] p-3 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_25px_rgba(109,76,255,0.06)] hover:-translate-y-0.5 transition-all flex flex-col justify-between">
                    <span className="text-[10px] text-[#667085] font-semibold mb-1.5">{kpi.label}</span>
                    <div className="flex items-end justify-between">
                      <span className="text-[18px] font-bold text-[#101828] leading-none">{kpi.value}</span>
                      <span className={`text-[9px] font-bold ${kpi.color} ${kpi.bg} px-1.5 py-0.5 rounded flex items-center gap-0.5`}>
                        <ArrowUpRight className="w-2.5 h-2.5" />{kpi.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart & Side Cards */}
              <div className="col-span-12 grid grid-cols-12 gap-2.5">
                <div className="col-span-8 bg-white/90 backdrop-blur-sm rounded-[16px] p-3.5 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[12px] font-bold text-[#101828] block">Operational Efficiency</span>
                      <span className="text-[10px] text-[#667085]">Live metrics</span>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[9px] font-bold text-indigo-600 shadow-sm">Live</div>
                  </div>

                  {/* High Quality SVG Animated Chart */}
                  <div className="w-full relative mt-1 min-h-[100px] lg:min-h-[110px]">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
                      <defs>
                        <linearGradient id="chart-grad" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#6D4CFF" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#6D4CFF" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        d="M 0 50 L 0 35 Q 20 40 40 25 T 70 30 T 100 10 L 100 50 Z" fill="url(#chart-grad)"
                      />
                      <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2.5, ease: "easeOut" }}
                        d="M 0 35 Q 20 40 40 25 T 70 30 T 100 10" fill="none" stroke="#6D4CFF" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"
                      />
                      <motion.circle
                        cx="100" cy="10" r="3" fill="#6D4CFF"
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="shadow-[0_0_15px_#6D4CFF]"
                      />
                      {/* Premium grid lines */}
                      <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2 2" />
                      <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#f1f5f9" strokeWidth="0.5" strokeDasharray="2 2" />

                      {/* Subtle Bars */}
                      <rect x="20" y="30" width="3" height="20" fill="#e2e8f0" rx="1.5" />
                      <rect x="40" y="20" width="3" height="30" fill="#e2e8f0" rx="1.5" />
                      <rect x="70" y="25" width="3" height="25" fill="#e2e8f0" rx="1.5" />
                    </svg>
                  </div>
                </div>

                <div className="col-span-4 flex flex-col gap-2.5">
                  {/* AI Recommendation */}
                  <div className="flex-1 bg-gradient-to-b from-[#F8F9FF] to-[#F3F5FF] rounded-[16px] p-2.5 border border-[#E5E9F5] shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#6D4CFF] to-[#8B5CF6] text-white flex items-center justify-center shadow-[0_5px_15px_rgba(109,76,255,0.3)]">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span className="text-[9px] font-bold text-[#6D4CFF] uppercase tracking-widest font-mono">Inventix AI</span>
                    </div>
                    <p className="text-[10px] text-[#344054] font-medium leading-relaxed mb-2">
                      Optimize logistics route A4 to reduce cost by 12%.
                    </p>
                    <button className="w-full py-1.5 bg-white border border-[#D0D5DD] rounded-lg text-[#344054] text-[9px] font-bold shadow-[0_2px_5px_rgba(0,0,0,0.02)] hover:shadow hover:text-[#6D4CFF] transition-all flex items-center justify-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-[#6D4CFF]" /> AI Action
                    </button>
                  </div>

                  {/* Health Score */}
                  <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-[16px] p-2.5 border border-slate-100 shadow-sm flex items-center justify-center relative min-h-[70px]">
                    <span className="absolute top-2 left-2.5 text-[10px] font-semibold text-[#667085]">Health</span>
                    <div className="w-12 h-12 mt-2.5 rounded-full border-[5px] border-[#F2F4F7] border-t-[#10B981] border-r-[#10B981] border-l-[#F04438] flex items-center justify-center shadow-[inset_0_2px_5px_rgba(0,0,0,0.05)] relative">
                      <span className="text-[11px] font-bold text-[#101828]">92%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="col-span-12 grid grid-cols-12 gap-2.5">
                <div className="col-span-7 bg-white/90 backdrop-blur-sm rounded-[16px] p-2.5 border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-center">
                  <span className="text-[10px] font-semibold text-[#667085] block mb-1.5">Live Activity</span>
                  <div className="space-y-2 relative">
                    <div className="absolute left-[9px] top-1.5 bottom-1.5 w-[1px] bg-slate-100" />
                    {[
                      { icon: Package, text: "Warehouse synced", time: "Just now", color: "text-[#10B981]", bg: "bg-[#ECFDF3]" },
                      { icon: CheckCircle2, text: "Purchase Approved", time: "2m ago", color: "text-[#6D4CFF]", bg: "bg-[#F4F3FF]" },
                      { icon: Truck, text: "Shipment Dispatched", time: "5m ago", color: "text-[#0086C9]", bg: "bg-[#F0F9FF]" },
                    ].map((activity, i) => (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }} key={i} className="flex items-center gap-2.5 relative z-10">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm ${activity.bg}`}>
                          <activity.icon className={`w-2.5 h-2.5 ${activity.color}`} />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <p className="text-[10px] font-semibold text-[#344054]">{activity.text}</p>
                          <span className="text-[8px] text-[#98A2B3] font-medium">{activity.time}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="col-span-5 bg-white/90 backdrop-blur-sm rounded-[16px] p-2.5 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col">
                  <span className="text-[10px] font-semibold text-[#667085] block mb-1.5">Network</span>
                  <div className="absolute inset-0 top-6 opacity-[0.15] bg-[radial-gradient(circle_at_center,_#98A2B3_1.5px,_transparent_1.5px)]" style={{ backgroundSize: '12px 12px' }} />
                  <div className="relative flex-1 flex items-center justify-center w-full">
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="flex items-center gap-1.5 absolute top-[20%] left-[15%] bg-white/80 px-2 py-0.5 rounded shadow-sm border border-slate-100">
                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_5px_#10B981]" />
                      <span className="text-[8px] font-bold text-[#667085]">Node A</span>
                    </motion.div>
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1 }} className="flex items-center gap-1.5 absolute bottom-[25%] right-[10%] bg-white/80 px-2 py-0.5 rounded shadow-sm border border-slate-100">
                      <div className="w-1.5 h-1.5 bg-[#6D4CFF] rounded-full shadow-[0_0_5px_#6D4CFF]" />
                      <span className="text-[8px] font-bold text-[#667085]">Syncing</span>
                    </motion.div>
                    <motion.div animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }} transition={{ duration: 3, repeat: Infinity }} className="w-1.5 h-1.5 bg-[#0086C9] rounded-full absolute" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Premium Floating Cards overlapping the dashboard */}
          {/* PO Approved */}
          <motion.div
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-[4%] -left-14 z-30 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[16px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] p-2 flex items-center gap-2 w-[160px] cursor-default"
          >
            <div className="w-6 h-6 rounded-full bg-[#ECFDF3] flex items-center justify-center border border-[#D1FADF] shadow-inner shrink-0">
              <CheckCircle2 className="w-3 h-3 text-[#027A48]" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-[#101828] mb-[1px]">PO Approved</div>
              <div className="text-[7.5px] text-[#667085] font-medium">Logistics Corp</div>
            </div>
          </motion.div>

          {/* AI Recommendation Card */}
          <motion.div
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-[42%] -right-16 z-30 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[16px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] p-2 flex items-center gap-2 w-[170px] cursor-default"
          >
            <div className="w-6 h-6 rounded-full bg-[#F5F3FF] flex items-center justify-center border border-[#EDE9FE] shadow-inner shrink-0">
              <Sparkles className="w-3 h-3 text-[#6D4CFF]" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-[#101828] mb-[1px]">AI Recommendation</div>
              <div className="text-[7.5px] text-[#667085] font-medium">Demand Forecast Ready</div>
            </div>
          </motion.div>

          {/* Vendor Connected */}
          <motion.div
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-[58%] -left-12 z-30 bg-white/95 backdrop-blur-xl border border-white/80 rounded-full shadow-[0_10px_20px_-5px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset] px-3 py-1.5 flex items-center gap-1.5 cursor-default"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#6D4CFF] shadow-[0_0_6px_#6D4CFF] animate-pulse" />
            <div className="text-[9px] font-bold text-[#344054]">Vendor Connected</div>
          </motion.div>

          {/* Inventory Synced */}
          <motion.div
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute bottom-[8%] -right-14 z-30 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-[16px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)_inset] p-2 flex items-center gap-2 w-[160px] cursor-default"
          >
            <div className="w-6 h-6 rounded-full bg-[#F0F9FF] flex items-center justify-center border border-[#B9E6FE] shadow-inner shrink-0">
              <Database className="w-3 h-3 text-[#026AA2]" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-[#101828] mb-[1px]">Inventory Synced</div>
              <div className="text-[7.5px] text-[#667085] font-medium">3 Warehouses</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}