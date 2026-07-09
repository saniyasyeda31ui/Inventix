import { motion } from "motion/react";
import { Sparkles, BrainCircuit, Activity, LineChart as LineChartIcon, BarChart3, Users, DollarSign, Globe2, ChevronRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function WhyInventix() {
  return (
    <section id="why-inventix" className="relative z-10 w-full min-h-[85vh] flex items-center justify-center py-8">

      {/* Ambient Background matching the image (Purple, Pink, Cyan mix) */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-fuchsia-300/30 blur-[120px] mix-blend-multiply" />
        <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-300/30 blur-[130px] mix-blend-multiply" />
        <motion.div animate={{ scale: [1, 1.2, 1], y: [0, -30, 0] }} transition={{ duration: 22, repeat: Infinity }} className="absolute top-[20%] right-[20%] w-[40vw] h-[40vw] rounded-full bg-purple-300/30 blur-[100px] mix-blend-multiply" />
        <motion.div animate={{ scale: [1, 1.05, 1], x: [0, 30, 0] }} transition={{ duration: 18, repeat: Infinity }} className="absolute bottom-[20%] left-[10%] w-[45vw] h-[45vw] rounded-full bg-pink-300/30 blur-[110px] mix-blend-multiply" />

        {/* Floating Glass Bubbles */}
        <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[10%] left-[5%] w-24 h-24 rounded-full bg-white/40 backdrop-blur-md shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.8),_0_10px_20px_rgba(0,0,0,0.05)] border border-white/60" />
        <motion.div animate={{ y: [0, 40, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] right-[35%] w-16 h-16 rounded-full bg-white/40 backdrop-blur-md shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.8),_0_10px_20px_rgba(0,0,0,0.05)] border border-white/60" />
        <motion.div animate={{ y: [0, -50, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[10%] right-[5%] w-32 h-32 rounded-full bg-white/40 backdrop-blur-md shadow-[inset_-5px_-5px_15px_rgba(255,255,255,0.8),_0_10px_20px_rgba(0,0,0,0.05)] border border-white/60" />

        {/* Floating Light Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 8 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 5 }}
            className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-4 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-10 items-center">

        {/* Left Side: Text & Glass Cards */}
        <div className="lg:col-span-5 flex flex-col gap-4">

          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/80 shadow-sm w-max mb-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            <span className="text-[9px] font-black tracking-widest text-purple-600 uppercase">Why Inventix</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl lg:text-[2.75rem] text-slate-900 leading-[1.1] tracking-tight"
          >
            One Platform.<br />
            <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">Infinite Impact.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg font-sans leading-snug pr-4"
          >
            Everything you need to run a smarter, faster, more resilient supply chain without the enterprise bloat.
          </motion.p>

          {/* Inventix AI Main Glass Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,255,255,0.8)] p-5 relative overflow-hidden mt-1 group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/20 blur-[40px] rounded-full group-hover:scale-150 transition-transform duration-700" />

            <div className="flex justify-between items-start mb-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] flex items-center justify-center p-2">
                  <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center gap-1 shadow-inner relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-500/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-bold text-lg text-slate-800 tracking-tight">Inventix AI</h3>
                    <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <p className="text-xs text-slate-500 leading-snug w-[85%]">
                    Continuously analyzing 2.4M supply chain variables to uncover hidden efficiencies.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[9px] font-black tracking-wider flex items-center gap-1.5 border border-emerald-100 shadow-sm mt-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM ACTIVE
              </div>
            </div>

            {/* Progress Bar Area */}
            <div className="mt-5 relative z-10 pl-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-600">AI scanning 2.4M+ variables...</span>
              </div>
              <div className="w-full max-w-xs h-2.5 bg-white/50 rounded-full overflow-hidden shadow-inner border border-white/60">
                <motion.div animate={{ width: ["0%", "100%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="h-full bg-gradient-to-r from-purple-400 via-fuchsia-400 to-cyan-300 shadow-[0_0_10px_rgba(192,132,252,0.8)] rounded-full relative">
                  <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/50" />
                </motion.div>
              </div>

              <div className="flex gap-2 mt-3">
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50/80 px-2 py-1 rounded-md border border-indigo-100/50">Predictive Modeling</span>
                <span className="text-[9px] font-bold text-fuchsia-600 bg-fuchsia-50/80 px-2 py-1 rounded-md border border-fuchsia-100/50">Auto-Resolution</span>
              </div>
            </div>

            {/* Circular AI Core visualization */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center opacity-80 group-hover:scale-110 transition-transform duration-700">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border border-dashed border-purple-300/60" />
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-300">
                <BrainCircuit className="w-5 h-5 text-white drop-shadow-md" />
              </div>
            </div>
          </motion.div>

          {/* 3 Small Metric Cards */}
          <div className="grid grid-cols-3 gap-3 mt-1">

            {/* Cost Savings Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] p-3 flex flex-col relative overflow-hidden group">
              <div className="w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center mb-2.5 text-rose-500 group-hover:scale-110 transition-transform">
                <DollarSign className="w-3.5 h-3.5" />
              </div>
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Cost Savings</div>
              <div className="text-xl font-black text-slate-800 tracking-tight">$3.2M</div>
              <div className="text-[9px] text-slate-500 mt-0.5">This Quarter</div>

              <div className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-between px-2 gap-1 opacity-80">
                <div className="h-2 w-full bg-rose-200 rounded-t-sm" />
                <div className="h-4 w-full bg-rose-300 rounded-t-sm" />
                <div className="h-6 w-full bg-rose-400 rounded-t-sm" />
                <div className="h-3 w-full bg-rose-200 rounded-t-sm" />
                <div className="h-8 w-full bg-rose-500 rounded-t-sm relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] font-black text-rose-600">+32%</span>
                </div>
              </div>
            </motion.div>

            {/* Supplier Perf Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] p-3 flex flex-col relative overflow-hidden group">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mb-2.5 text-emerald-500 group-hover:scale-110 transition-transform">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Supplier Perf.</div>
              <div className="text-xl font-black text-slate-800 tracking-tight">98.5%</div>
              <div className="text-[9px] text-slate-500 mt-0.5">On-time Delivery</div>

              <div className="absolute bottom-1 left-0 right-0 h-8 w-full px-1.5 opacity-80">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0,35 L20,25 L40,30 L60,15 L80,20 L100,5" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="100" cy="5" r="2.5" fill="#10b981" />
                </svg>
              </div>
            </motion.div>

            {/* Analytics Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] p-3 flex flex-col relative overflow-hidden group">
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mb-2.5 text-indigo-600 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-3.5 h-3.5" />
              </div>
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Analytics</div>
              <div className="text-lg font-black text-indigo-700 tracking-tight">Live View</div>
              <div className="text-[9px] text-slate-500 mt-0.5">Real-time Insights</div>

              <div className="absolute bottom-0 left-0 right-0 h-10 w-full opacity-80">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                  <path d="M0,20 Q25,5 50,20 T100,20 L100,40 L0,40 Z" fill="#818cf8" opacity="0.3" />
                  <path d="M0,25 Q25,10 50,25 T100,25 L100,40 L0,40 Z" fill="#6366f1" opacity="0.4" />
                  <path d="M0,30 Q25,15 50,30 T100,30 L100,40 L0,40 Z" fill="#4f46e5" opacity="0.8" />
                </svg>
              </div>
            </motion.div>

          </div>
        </div>


        {/* Right Side: Massive Global Operations Command Dashboard */}
        <motion.div
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="lg:col-span-7 bg-[#101524] rounded-3xl border border-slate-700 shadow-2xl p-4 relative overflow-hidden flex flex-col gap-3 text-white z-20 group !transform-none !rotate-0 !skew-x-0 !skew-y-0"
        >
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Dashboard Header */}
          <div className="flex justify-between items-start mb-1 relative z-10">
            <div>
              <h2 className="text-xl font-display font-semibold tracking-wide text-white mb-0.5">Global Operations Command</h2>
              <p className="text-slate-400 text-[10px]">Unify regions, currencies and compliance in a single view.</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
                <span className="text-[10px] font-semibold text-slate-300">All Systems Operational</span>
              </div>
              <span className="text-[9px] text-slate-500 mt-1">Last updated: just now</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">

            {/* Main Chart Card */}
            <div className="md:col-span-2 bg-[#1A1F35] border border-slate-700/50 rounded-2xl p-4 flex flex-col hover:border-slate-600 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xs font-semibold text-slate-200">Operational Efficiency</h3>
                  <p className="text-[9px] text-slate-500">Live metrics</p>
                </div>
                <div className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 text-[9px] rounded border border-indigo-500/30 font-semibold">Live</div>
              </div>

              {/* Complex Glowing Line Chart */}
              <div className="flex-1 relative w-full h-24 flex items-end">
                <div className="absolute inset-0 flex items-end justify-between px-1.5 gap-0.5 opacity-20 pb-3">
                  {[40, 30, 50, 45, 60, 40, 70, 65, 80, 90, 60, 50].map((h, i) => (
                    <div key={i} className="w-full bg-slate-500 rounded-t-sm" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="absolute inset-0 pb-3">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,80 L10,75 L20,55 L30,40 L40,55 L50,60 L60,55 L70,45 L80,20 L90,40 L100,50" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(168,85,247,0.8))" }} />
                    <path d="M0,80 L10,75 L20,55 L30,40 L40,55 L50,60 L60,55 L70,45 L80,20 L90,40 L100,50 L100,100 L0,100 Z" fill="url(#purpleGlow)" opacity="0.3" />
                    <defs>
                      <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#1a1f35" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[[0, 80], [10, 75], [20, 55], [30, 40], [40, 55], [50, 60], [60, 55], [70, 45], [80, 20], [90, 40], [100, 50]].map((pt, i) => (
                      <circle key={i} cx={pt[0]} cy={pt[1]} r="2.5" fill="#ffffff" stroke="#a855f7" strokeWidth="1" />
                    ))}
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] text-slate-500 px-1 font-mono">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                </div>
              </div>
            </div>

            {/* Right Side 3 Stacked Cards */}
            <div className="md:col-span-1 flex flex-col gap-2.5">

              {/* Inventix AI Mini */}
              <div className="bg-[#1A1F35] border border-indigo-500/30 rounded-xl p-3 relative group hover:border-indigo-400 transition-colors shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-5 h-5 rounded bg-indigo-500/20 flex items-center justify-center border border-indigo-500/40">
                    <BrainCircuit className="w-3 h-3 text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-200 uppercase tracking-wider">Inventix AI</span>
                </div>
                <p className="text-[9px] text-slate-400 leading-snug pr-5">Optimize logistics and reduce cost by 18%</p>
                <div className="absolute top-1/2 -translate-y-1/2 right-3 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center border border-slate-600 group-hover:bg-indigo-500 group-hover:border-indigo-400 transition-colors cursor-pointer">
                  <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-white" />
                </div>
              </div>

              {/* Health Score */}
              <div className="bg-[#1A1F35] border border-slate-700/50 rounded-xl p-3 flex flex-col items-center justify-center flex-1 hover:border-slate-600 transition-colors relative">
                <span className="absolute top-2 left-3 text-[9px] font-semibold text-slate-400">Health Score</span>
                <div className="w-12 h-12 mt-3 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#2a3149" strokeWidth="4" />
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="125" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm font-black text-white z-10">92%</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-semibold mt-1">Excellent</span>
              </div>

              {/* Inventory Synced */}
              <div className="bg-[#1A1F35] border border-slate-700/50 rounded-xl p-2.5 flex items-center gap-2.5 hover:border-slate-600 transition-colors">
                <div className="w-6 h-6 rounded bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                  <div className="w-3 h-3 border-y-2 border-blue-400 rounded-sm" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-slate-200">Inventory Synced</div>
                  <div className="text-[9px] text-slate-500">3 Warehouses</div>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">

            {/* Live Activity Feed */}
            <div className="bg-[#1A1F35] border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-colors">
              <h3 className="text-xs font-semibold text-slate-200 mb-3">Live Activity</h3>
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Warehouse synced", time: "Just now", color: "bg-emerald-400" },
                  { label: "Purchase approved", time: "2m ago", color: "bg-purple-400" },
                  { label: "Vendor connected", time: "5m ago", color: "bg-fuchsia-400" },
                  { label: "Payment received", time: "12m ago", color: "bg-cyan-400" },
                  { label: "Shipment dispatched", time: "18m ago", color: "bg-indigo-400" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.color} shadow-[0_0_6px_currentColor]`} />
                      <span className="text-[10px] text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <span className="text-[9px] text-slate-500">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Network Status / Map */}
            <div className="bg-[#1A1F35] border border-slate-700/50 rounded-xl p-4 hover:border-slate-600 transition-colors flex flex-col">
              <h3 className="text-xs font-semibold text-slate-200 mb-2">Network Status</h3>
              <div className="flex-1 relative w-full flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-full h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiM0NzU1NjkiLz48L3N2Zz4=')] relative opacity-60">
                  <div className="absolute top-[30%] left-[20%] w-1 h-1 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
                  <div className="absolute top-[40%] left-[25%] w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]" />
                  <div className="absolute top-[25%] left-[45%] w-1 h-1 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
                  <div className="absolute top-[35%] left-[50%] w-1 h-1 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(192,132,252,1)]" />

                  <svg className="absolute inset-0 w-full h-full">
                    <path d="M 20% 30% Q 30% 10% 45% 25%" fill="none" stroke="rgba(168,85,247,0.4)" strokeWidth="1" strokeDasharray="2 2" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-4 mt-2 pt-2 border-t border-slate-700/50">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] text-slate-300">24 Hubs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span className="text-[9px] text-slate-300">6 Transit</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}