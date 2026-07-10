import { motion } from "motion/react";
import { 
  Building2, Warehouse, PackageCheck, Users, 
  BrainCircuit, FileText, CheckCircle, BarChart3,
  Network, Share2, Server, ArrowUpRight, CheckCircle2, ChevronRight, PlayCircle, Lock, Zap, ShieldCheck, Activity
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      id: "register",
      title: "Register Company",
      description: "Initialize your secure enterprise workspace with automated compliance checks.",
      icon: Building2,
      color: "from-blue-500 to-indigo-500",
      delay: 0.1,
      visual: (
        <div className="w-full h-full rounded-[2rem] border border-white/40 p-6 flex flex-col justify-center items-center relative overflow-hidden group bg-gradient-to-br from-white/80 via-indigo-50/50 to-blue-50/50 backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.8)]">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#94a3b8_1px,_transparent_1px)] opacity-20" style={{ backgroundSize: '16px 16px' }} />
           
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/20 rounded-full blur-[50px] group-hover:scale-150 transition-transform duration-1000" />
           
           <div className="relative z-10 flex items-center gap-6">
             <motion.div 
               animate={{ y: [-4, 4, -4] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-16 h-16 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] border border-white flex items-center justify-center relative"
             >
               <Server className="w-6 h-6 text-indigo-500" />
               <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
             </motion.div>

             <div className="w-16 h-1 bg-indigo-200/50 relative overflow-hidden rounded-full">
               <motion.div 
                 animate={{ x: [-40, 60] }} 
                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
               />
             </div>

             <motion.div 
               animate={{ y: [4, -4, 4] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-[1.5rem] shadow-[0_20px_40px_rgba(59,130,246,0.4)] border border-indigo-400 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500"
             >
               <Building2 className="w-10 h-10 text-white drop-shadow-md" />
             </motion.div>
           </div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="absolute top-4 left-4 bg-white/80 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white shadow-[0_10px_20px_rgba(0,0,0,0.05)] text-[9px] font-bold text-slate-700 flex items-center gap-1.5"
           >
             <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
             Enterprise SSL
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="absolute bottom-5 right-5 bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2 rounded-xl shadow-[0_15px_30px_rgba(16,185,129,0.3)] border border-emerald-300 text-[10px] font-black text-white flex items-center gap-2"
           >
             <div className="w-2 h-2 rounded-full bg-white animate-ping" />
             WORKSPACE INITIALIZED
           </motion.div>
        </div>
      )
    },
    {
      id: "warehouses",
      title: "Add Warehouses",
      description: "Map your physical infrastructure & storage zones.",
      icon: Warehouse,
      color: "from-indigo-500 to-violet-500",
      delay: 0.2,
      visual: (
        <div className="w-full h-full rounded-[2rem] border border-white/40 p-6 flex flex-col justify-center items-center relative overflow-hidden group bg-gradient-to-br from-white/80 via-violet-50/50 to-indigo-50/50 backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.8)]">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-400/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
           <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-400/20 rounded-full blur-[50px]" />
           
           <div className="relative w-64 h-48 perspective-1000 z-10 flex items-center justify-center">
             <motion.div 
               animate={{ rotateX: [60, 56, 60], rotateZ: [-35, -25, -35] }} 
               transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
               className="w-56 h-48 bg-white/30 backdrop-blur-2xl rounded-3xl border-2 border-white/80 grid grid-cols-4 grid-rows-3 gap-2.5 p-4 shadow-[0_30px_60px_rgba(99,102,241,0.2)] relative transform-style-3d group-hover:shadow-[0_40px_80px_rgba(99,102,241,0.3)] transition-shadow duration-500"
             >
               {[...Array(12)].map((_, i) => (
                 <motion.div 
                   key={i} 
                   animate={{ 
                     translateZ: [2, (i === 2 || i === 7 || i === 9) ? 20 : 2, 2],
                     backgroundColor: (i === 2 || i === 7 || i === 9) ? ['#6366f1', '#4f46e5', '#6366f1'] : '#ffffff'
                   }}
                   transition={{ duration: 4, repeat: Infinity, delay: i * 0.15 }}
                   className={`rounded-lg shadow-md border border-white/50 relative overflow-hidden ${(i === 2 || i === 7 || i === 9) ? 'shadow-[0_10px_20px_rgba(99,102,241,0.5)] border-indigo-300' : ''}`}
                 >
                   {(i === 2 || i === 7 || i === 9) && <div className="absolute inset-0 bg-white/30 blur-[2px]" />}
                 </motion.div>
               ))}
             </motion.div>
           </div>
           
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             className="absolute top-5 left-5 bg-white/80 backdrop-blur-xl px-3 py-2 rounded-xl border border-white shadow-[0_15px_30px_rgba(0,0,0,0.08)] text-[9px] font-bold text-slate-600 flex flex-col gap-1.5"
           >
             <span className="uppercase text-slate-400 text-[8px] tracking-widest">Global Capacity</span>
             <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden relative border border-slate-200">
                <motion.div animate={{ width: ["0%", "85%"] }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-indigo-400 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
             </div>
             <span className="text-indigo-600 absolute right-3 bottom-2 font-black">85%</span>
           </motion.div>

           <motion.div 
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="absolute bottom-5 right-5 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-white shadow-[0_20px_40px_rgba(99,102,241,0.15)] text-[10px] font-black text-indigo-700 flex items-center gap-2"
           >
             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
             5 ZONES ACTIVE
           </motion.div>
        </div>
      )
    },
    {
      id: "inventory",
      title: "Import Inventory",
      description: "Sync stock levels, locations, and thresholds.",
      icon: PackageCheck,
      color: "from-violet-500 to-purple-500",
      delay: 0.3,
      visual: (
        <div className="w-full h-full rounded-[2rem] border border-white/40 p-6 flex flex-col justify-end relative overflow-hidden group bg-gradient-to-br from-white/80 via-purple-50/50 to-violet-50/50 backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.8)]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
           <div className="absolute bottom-0 left-[20%] w-48 h-48 bg-purple-400/20 rounded-full blur-[60px]" />
           
           <motion.div 
             initial={{ opacity: 0, y: -10 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="absolute top-5 right-5 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-white shadow-[0_15px_30px_rgba(168,85,247,0.15)] text-[10px] font-black text-purple-700 flex items-center gap-2 z-20"
           >
             <Activity className="w-4 h-4 text-purple-500" />
             SYNCING 10K SKUS
           </motion.div>

           <div className="flex items-end gap-3 h-40 w-full px-2 relative z-10">
             <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                <motion.path 
                  d="M0,80 Q20,90 40,50 T80,30 T100,10" 
                  fill="none" 
                  stroke="rgba(168,85,247,0.4)" 
                  strokeWidth="3" 
                  strokeDasharray="6 6"
                  animate={{ strokeDashoffset: [30, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  style={{ filter: "drop-shadow(0 0 8px rgba(168,85,247,0.5))" }}
                />
             </svg>

             {[30, 50, 20, 75, 40, 90, 35, 65].map((h, i) => (
               <motion.div 
                 key={i} 
                 initial={{ height: 0 }}
                 whileInView={{ height: `${h}%` }}
                 transition={{ duration: 1.5, delay: i * 0.1, type: "spring", stiffness: 40 }}
                 className={`flex-1 rounded-t-2xl relative z-10 w-full border border-white/50 ${(i === 3 || i === 5) ? 'bg-gradient-to-t from-violet-500 to-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.5)] border-purple-300' : 'bg-white/80 backdrop-blur-md shadow-[0_10px_20px_rgba(0,0,0,0.05)]'}`}
               >
                 {(i === 3 || i === 5) && (
                   <motion.div 
                     animate={{ y: [0, -15, 0] }}
                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                     className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                   />
                 )}
               </motion.div>
             ))}
           </div>
        </div>
      )
    },
    {
      id: "vendors",
      title: "Connect Vendors",
      description: "Onboard suppliers and define contract SLAs.",
      icon: Users,
      color: "from-purple-500 to-fuchsia-500",
      delay: 0.4,
      visual: (
        <div className="w-full h-full rounded-[2rem] border border-white/40 p-6 flex items-center justify-center relative overflow-hidden group bg-gradient-to-br from-white/80 via-fuchsia-50/50 to-pink-50/50 backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.8)]">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#fbcfe8_1px,_transparent_1px)] opacity-30" style={{ backgroundSize: '20px 20px' }} />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-400/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
           
           <div className="relative w-64 h-64 z-10 flex items-center justify-center">
             <motion.div 
               animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}
               className="absolute z-30 w-20 h-20 bg-white/90 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-[0_20px_40px_rgba(217,70,239,0.3)] border border-fuchsia-200"
             >
               <Building2 className="w-10 h-10 text-fuchsia-500 drop-shadow-md" />
             </motion.div>
             
             <svg className="absolute inset-0 w-full h-full z-10 overflow-visible">
               {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                 const x2 = 50 + Math.cos(deg * Math.PI / 180) * 45;
                 const y2 = 50 + Math.sin(deg * Math.PI / 180) * 45;
                 return (
                   <g key={i}>
                     <line x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} stroke="rgba(217,70,239,0.3)" strokeWidth="3" />
                     <motion.line 
                       x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} 
                       stroke="rgba(217,70,239,0.8)" strokeWidth="4" strokeDasharray="10 25"
                       animate={{ strokeDashoffset: [35, 0] }}
                       transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
                       style={{ filter: "drop-shadow(0 0 8px rgba(217,70,239,0.6))" }}
                     />
                   </g>
                 );
               })}
             </svg>

             {[0, 60, 120, 180, 240, 300].map((deg, i) => (
               <motion.div 
                 key={i}
                 initial={{ scale: 0 }}
                 whileInView={{ scale: 1 }}
                 transition={{ duration: 0.5, delay: i * 0.1 }}
                 className={`absolute w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.1)] border-2 z-20 hover:scale-110 transition-transform ${i === 0 || i === 3 ? 'border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.4)]' : 'border-white'}`}
                 style={{ 
                   left: `calc(50% + ${Math.cos(deg * Math.PI / 180) * 100}px - 24px)`,
                   top: `calc(50% + ${Math.sin(deg * Math.PI / 180) * 100}px - 24px)`
                 }}
               >
                 <Network className={`w-5 h-5 ${i === 0 || i === 3 ? 'text-emerald-500' : 'text-slate-400'}`} />
                 {(i === 0 || i === 3) && (
                   <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                 )}
               </motion.div>
             ))}
           </div>
        </div>
      )
    },
    {
      id: "ai",
      title: "AI Analyzes Operations",
      description: "Neural networks monitor pricing and stock run-rates.",
      icon: BrainCircuit,
      color: "from-fuchsia-500 to-pink-500",
      delay: 0.5,
      visual: (
        <div className="w-full h-full rounded-[2rem] border border-white/40 p-6 flex items-center justify-center relative overflow-hidden group bg-slate-900 shadow-[inset_0_0_50px_rgba(217,70,239,0.2)]">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#e879f9_0%,_transparent_60%)] opacity-30" />
           <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-pink-500/20 rounded-full blur-[100px]" />
           
           <div className="relative z-10 flex items-center justify-center perspective-1000">
             <motion.div animate={{ rotateX: 360, rotateY: 180 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute w-52 h-52 border-2 border-fuchsia-500/40 rounded-full border-t-fuchsia-400 shadow-[0_0_30px_rgba(232,121,249,0.3)_inset]" style={{ transformStyle: 'preserve-3d' }} />
             <motion.div animate={{ rotateY: 360, rotateZ: 180 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute w-40 h-40 border-2 border-pink-500/40 rounded-full border-b-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.3)_inset]" style={{ transformStyle: 'preserve-3d' }} />
             <motion.div animate={{ rotateZ: 360, rotateX: 180 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} className="absolute w-28 h-28 border-2 border-rose-500/40 rounded-full border-l-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)_inset]" style={{ transformStyle: 'preserve-3d' }} />
             
             <motion.div 
               animate={{ scale: [1, 1.15, 1] }} 
               transition={{ duration: 2, repeat: Infinity }}
               className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(232,121,249,0.7)] border border-fuchsia-300 relative z-20 rotate-12"
             >
               <BrainCircuit className="w-10 h-10 text-white -rotate-12" />
             </motion.div>
           </div>

           <motion.div animate={{ y: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-5 left-5 bg-slate-800/90 backdrop-blur-xl rounded-xl p-2.5 px-4 flex items-center gap-2 border border-fuchsia-500/40 shadow-[0_10px_20px_rgba(232,121,249,0.2)] z-20">
             <div className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
             <span className="text-[10px] text-fuchsia-100 font-black tracking-wider">2.4M VARS/SEC</span>
           </motion.div>
           <motion.div animate={{ y: [5, -5, 5] }} transition={{ duration: 5, repeat: Infinity }} className="absolute bottom-5 right-5 bg-slate-800/90 backdrop-blur-xl rounded-xl p-2.5 px-4 flex items-center gap-2 border border-pink-500/40 shadow-[0_10px_20px_rgba(244,114,182,0.2)] z-20">
             <Activity className="w-3.5 h-3.5 text-pink-400" />
             <span className="text-[10px] text-pink-100 font-black tracking-wider">DEEP LEARNING</span>
           </motion.div>
        </div>
      )
    },
    {
      id: "pr",
      title: "Generate Purchase Requests",
      description: "System auto-drafts optimized orders before stock-outs.",
      icon: FileText,
      color: "from-pink-500 to-rose-500",
      delay: 0.6,
      visual: (
        <div className="w-full h-full rounded-[2rem] border border-white/40 p-6 flex flex-col items-center justify-center relative overflow-hidden group bg-gradient-to-br from-white/80 via-rose-50/50 to-pink-50/50 backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.8)]">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-400/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
           
           <motion.div 
             initial={{ y: 20, opacity: 0 }}
             whileInView={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.5 }}
             className="w-64 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_30px_60px_rgba(244,63,94,0.15)] border border-white p-6 relative z-10 group-hover:-translate-y-3 transition-transform duration-500"
           >
             <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(244,63,94,0.5)] border-[3px] border-white">
               <Zap className="w-4 h-4 text-white" />
             </div>

             <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
               <div className="text-[11px] bg-rose-50 text-rose-600 px-3 py-1 rounded shadow-sm font-bold font-mono border border-rose-100 tracking-wider">PR-8902</div>
               <Share2 className="w-4 h-4 text-slate-400" />
             </div>
             
             <div className="space-y-3 mb-6">
               <div className="h-2 w-full bg-slate-100 rounded-full" />
               <div className="h-2 w-full bg-slate-100 rounded-full" />
               <div className="h-2 w-2/3 bg-slate-100 rounded-full" />
             </div>

             <div className="flex items-center justify-between pt-2">
               <div>
                 <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Value</div>
                 <div className="text-xl font-black text-slate-800">$42,500</div>
               </div>
               <div className="px-3 py-1.5 bg-rose-500 text-white text-[10px] rounded-lg font-bold shadow-[0_5px_15px_rgba(244,63,94,0.4)]">Auto-Drafted</div>
             </div>
           </motion.div>

           <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-xl border border-white p-3 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.1)] flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
               <PackageCheck className="w-5 h-5 text-emerald-500" />
             </div>
             <div>
               <div className="text-[9px] text-slate-400 uppercase font-black tracking-wider">Stock Alert</div>
               <div className="text-xs text-slate-800 font-bold">SKU-990 Critical</div>
             </div>
           </motion.div>
        </div>
      )
    },
    {
      id: "approve",
      title: "Approve Purchase Orders",
      description: "Hierarchical workflows route orders for executive sign-off.",
      icon: CheckCircle,
      color: "from-rose-500 to-orange-500",
      delay: 0.7,
      visual: (
        <div className="w-full h-full rounded-[2rem] border border-white/40 p-6 flex items-center justify-center relative overflow-hidden group bg-gradient-to-br from-white/80 via-orange-50/50 to-rose-50/50 backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.8)]">
           <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/20 rounded-full blur-[60px]" />
           <div className="absolute bottom-0 left-0 w-48 h-48 bg-rose-400/20 rounded-full blur-[50px]" />

           <div className="flex flex-col gap-5 w-5/6 relative z-10 perspective-1000">
             {/* Tier 1 Approved */}
             <div className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.05)] border border-white flex items-center justify-between relative group-hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] transition-shadow duration-500">
               <div className="absolute -left-3 -top-3 w-7 h-7 bg-emerald-500 rounded-full border-[3px] border-white shadow-[0_5px_15px_rgba(16,185,129,0.4)] flex items-center justify-center">
                 <CheckCircle2 className="w-4 h-4 text-white" />
               </div>
               <div className="flex flex-col gap-2.5 w-1/2">
                 <div className="h-2 w-full bg-slate-100 rounded-full" />
                 <div className="h-2 w-2/3 bg-slate-50 rounded-full" />
               </div>
               <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">VP APPROVED</span>
             </div>
             
             {/* Connecting Line */}
             <div className="w-1 h-8 bg-slate-100 mx-auto relative overflow-hidden rounded-full shadow-inner">
               <motion.div animate={{ y: [-32, 32] }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="w-full h-5 bg-gradient-to-b from-transparent via-orange-400 to-transparent shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
             </div>
             
             {/* Tier 2 Pending */}
             <div className="bg-white/95 backdrop-blur-2xl p-5 rounded-2xl shadow-[0_20px_40px_rgba(249,115,22,0.15)] border border-white flex items-center justify-between scale-105 relative group-hover:-translate-y-2 transition-transform duration-500 z-10">
               <div className="absolute -left-3 -top-3 w-7 h-7 bg-orange-500 rounded-full border-[3px] border-white shadow-[0_5px_15px_rgba(249,115,22,0.4)] flex items-center justify-center">
                 <div className="w-2 h-2 bg-white rounded-full animate-ping" />
               </div>
               <div className="flex flex-col gap-2.5 w-1/2">
                 <div className="h-2 w-full bg-orange-50 rounded-full" />
                 <div className="h-2 w-3/4 bg-slate-50 rounded-full" />
               </div>
               <span className="text-[11px] font-black text-white bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-xl shadow-[0_10px_20px_rgba(249,115,22,0.3)] cursor-pointer hover:scale-105 transition-transform">SIGN OFF</span>
             </div>
           </div>
        </div>
      )
    },
    {
      id: "dashboard",
      title: "Business Dashboard",
      description: "Track global KPIs and live supply chain velocity.",
      icon: BarChart3,
      color: "from-orange-500 to-amber-500",
      delay: 0.8,
      visual: (
        <div className="w-full h-full rounded-[2rem] border border-white/40 p-6 flex flex-col gap-4 relative overflow-hidden group bg-gradient-to-br from-white/80 via-amber-50/50 to-orange-50/50 backdrop-blur-3xl shadow-[inset_0_0_40px_rgba(255,255,255,0.8)]">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/20 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-1000" />
           
           <div className="flex gap-4 h-24 relative z-10">
             <div className="flex-1 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-white p-4 flex flex-col justify-end relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-500">
               <div className="absolute top-3 right-3 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">+12%</div>
               <div className="text-[10px] text-slate-400 font-mono mb-1 uppercase tracking-widest font-bold">Velocity</div>
               <div className="text-2xl font-black font-kpi text-slate-800">8.4x</div>
             </div>
             <div className="flex-1 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-white p-4 flex flex-col justify-end relative overflow-hidden group-hover:-translate-y-2 transition-transform duration-500 delay-75">
               <div className="absolute top-3 right-3 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">+4%</div>
               <div className="text-[10px] text-slate-400 font-mono mb-1 uppercase tracking-widest font-bold">Savings</div>
               <div className="text-2xl font-black font-kpi text-slate-800">$1.2M</div>
             </div>
           </div>
           
           <div className="flex-1 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-white p-5 flex items-end gap-2 relative z-10">
             {[4, 6, 5, 8, 7, 10, 9, 12].map((h, i) => (
               <motion.div 
                 key={i} 
                 initial={{ height: 0 }}
                 whileInView={{ height: `${h * 8}%` }}
                 transition={{ duration: 1.5, delay: i * 0.1, type: "spring" }}
                 className={`flex-1 rounded-t-lg relative ${i === 7 ? 'bg-gradient-to-t from-orange-500 to-amber-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'bg-slate-100'}`} 
               >
                 {i === 7 && (
                   <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 1 }} className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-black text-white bg-slate-800 px-2 py-1 rounded shadow-lg">
                     PEAK
                   </motion.div>
                 )}
               </motion.div>
             ))}
           </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="pt-12 pb-16 relative z-10 bg-transparent overflow-visible">
      
      {/* Floating Elements Surround (Outside Timeline, not covering content) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        {/* Massive Ambient Background Meshes */}
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[5%] right-[-10%] w-[60vw] h-[60vw] bg-cyan-300/30 rounded-full blur-[140px] mix-blend-multiply" />
        <motion.div animate={{ scale: [1, 1.25, 1], y: [0, 50, 0], x: [0, -30, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[20%] left-[-15%] w-[55vw] h-[55vw] bg-pink-300/30 rounded-full blur-[150px] mix-blend-multiply" />
        <motion.div animate={{ scale: [1, 1.3, 1], x: [0, 30, 0], y: [0, 40, 0] }} transition={{ duration: 35, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[40%] right-[20%] w-[50vw] h-[50vw] bg-fuchsia-300/20 rounded-full blur-[160px] mix-blend-multiply" />
        
        {/* Decorative Floating Glass Bubbles & Translucent Rings */}
        
        {/* Top Right Floating Elements */}
        <motion.div animate={{ y: [0, -40, 0], rotate: [0, 20, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[8%] right-[5%] w-32 h-32 rounded-full bg-gradient-to-tr from-white/90 via-pink-200/40 to-fuchsia-400/40 backdrop-blur-xl shadow-[inset_-10px_-10px_30px_rgba(217,70,239,0.2),_0_20px_40px_rgba(0,0,0,0.05)] border border-white/80 z-0" />
        <motion.div animate={{ y: [0, 30, 0], rotate: [0, 180, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute top-[12%] right-[15%] w-48 h-48 rounded-full border-[3px] border-dashed border-fuchsia-300/30 opacity-60 z-0" />
        
        {/* Top Left Floating Elements */}
        <motion.div animate={{ y: [0, 40, 0], rotate: [0, -25, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }} className="absolute top-[25%] left-[3%] w-24 h-24 rounded-full bg-gradient-to-bl from-white/90 via-indigo-200/40 to-blue-400/40 backdrop-blur-xl shadow-[inset_-8px_-8px_25px_rgba(59,130,246,0.2),_0_15px_30px_rgba(0,0,0,0.05)] border border-white/80 z-0" />
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, -180, 0] }} transition={{ duration: 30, repeat: Infinity, ease: "linear", delay: 1 }} className="absolute top-[22%] left-[8%] w-36 h-36 rounded-full border-[2px] border-blue-300/20 opacity-50 z-0" />

        {/* Middle Right Floating Elements */}
        <motion.div animate={{ y: [0, -50, 0], rotate: [0, 30, 0] }} transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 4 }} className="absolute top-[45%] right-[2%] w-40 h-40 rounded-full bg-gradient-to-tr from-white/80 via-purple-200/30 to-violet-400/30 backdrop-blur-lg shadow-[inset_-12px_-12px_35px_rgba(139,92,246,0.2),_0_25px_50px_rgba(0,0,0,0.08)] border border-white/60 z-0" />
        
        {/* Middle Left Floating Elements */}
        <motion.div animate={{ y: [0, 35, 0], rotate: [0, -15, 0] }} transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute top-[65%] left-[4%] w-28 h-28 rounded-full bg-gradient-to-br from-white/90 via-emerald-200/40 to-teal-400/40 backdrop-blur-xl shadow-[inset_-10px_-10px_20px_rgba(20,184,166,0.2),_0_15px_30px_rgba(0,0,0,0.05)] border border-white/80 z-0" />
        <motion.div animate={{ y: [0, -25, 0], rotate: [0, 180, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }} className="absolute top-[68%] left-[2%] w-40 h-40 rounded-full border-[4px] border-dotted border-emerald-300/30 opacity-70 z-0" />

        {/* Bottom Right Floating Elements */}
        <motion.div animate={{ y: [0, -60, 0], rotate: [0, 45, 0] }} transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 5 }} className="absolute bottom-[10%] right-[6%] w-44 h-44 rounded-full bg-gradient-to-bl from-white/90 via-orange-200/40 to-amber-400/40 backdrop-blur-xl shadow-[inset_-15px_-15px_40px_rgba(245,158,11,0.2),_0_30px_60px_rgba(0,0,0,0.08)] border border-white/80 z-0" />
        
        {/* Glowing Gradient Spheres (Deep Background) */}
        <div className="absolute top-[30%] right-[25%] w-16 h-16 bg-blue-400 rounded-full blur-[20px] opacity-40 animate-pulse" />
        <div className="absolute top-[55%] left-[25%] w-20 h-20 bg-fuchsia-400 rounded-full blur-[25px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[25%] right-[30%] w-12 h-12 bg-amber-400 rounded-full blur-[15px] opacity-50 animate-pulse" style={{ animationDelay: '4s' }} />

        {/* Tiny Flowing Light Particles (Distributed throughout) */}
        {[...Array(24)].map((_, i) => (
          <motion.div 
            key={i} 
            animate={{ y: [0, -150, 0], opacity: [0, 0.9, 0], scale: [0.5, 1.2, 0.5], x: [0, Math.sin(i)*30, 0] }} 
            transition={{ duration: 12 + i * 1.5, repeat: Infinity, delay: i * 0.8 }} 
            className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,1)] z-0" 
            style={{ 
              left: `${Math.random() * 90 + 5}%`, 
              top: `${Math.random() * 90 + 5}%` 
            }} 
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center mb-16 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full border border-indigo-200 bg-white/80 backdrop-blur-xl shadow-[0_10px_20px_rgba(0,0,0,0.05)] text-[12px] font-black text-[#6D4CFF] uppercase tracking-widest mb-8"
          >
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500 drop-shadow-md" />
            AI ENERGY PIPELINE
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-4xl sm:text-5xl md:text-[58px] tracking-tight text-[#0A0F29] mb-8 leading-[1.1]"
          >
            A simple, guided workflow to <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#A855F7] via-[#ec4899] to-[#8B5CF6] bg-clip-text text-transparent pb-2 drop-shadow-sm">transform your supply chain.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-xl sm:text-2xl font-sans max-w-3xl leading-relaxed"
          >
            From setup to smarter operations — every step powered by autonomous AI engines.
          </motion.p>
        </div>

        {/* Animated Workflow Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Line Background */}
          <div className="absolute top-0 bottom-0 left-[50%] w-2 bg-white/60 backdrop-blur-md -translate-x-1/2 rounded-full hidden md:block shadow-[inset_0_0_10px_rgba(0,0,0,0.05)] border border-white" />
          
          {/* Animated Glowing Line */}
          <motion.div 
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute top-0 left-[50%] w-2 bg-gradient-to-b from-indigo-400 via-purple-400 to-rose-400 -translate-x-1/2 rounded-full shadow-[0_0_20px_rgba(139,92,246,0.6)] hidden md:block z-0"
          />

          {/* Moving Light Pulse Traveling Down the Timeline */}
          <div className="absolute top-0 bottom-0 left-[50%] w-2 -translate-x-1/2 rounded-full hidden md:block overflow-hidden z-0">
            <motion.div 
              animate={{ y: ["-10%", "110%"] }} 
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="w-full h-24 bg-white rounded-full shadow-[0_0_30px_rgba(255,255,255,1)]"
            />
          </div>

          <div className="space-y-28 md:space-y-40 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={step.id} className={`relative flex flex-col md:flex-row items-center justify-between w-full gap-12 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Visual Storytelling Widget Side */}
                  <div className="w-full md:w-[45%] h-80 relative group perspective-1000">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, x: isEven ? -30 : 30 }}
                      whileInView={{ opacity: 1, scale: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.8, delay: step.delay, type: "spring", stiffness: 60 }}
                      className="w-full h-full rounded-[2.5rem] bg-white/50 backdrop-blur-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1),inset_0_0_0_2px_rgba(255,255,255,1)] hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.25)] transition-all duration-700 p-3 relative transform-style-3d group-hover:scale-[1.02]"
                    >
                      <div className={`absolute -inset-4 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-[0.08] blur-3xl rounded-[3rem] transition-opacity duration-700 -z-10`} />
                      
                      <div className="w-full h-full rounded-[2rem] overflow-hidden relative shadow-inner">
                        {step.visual}
                      </div>
                    </motion.div>
                  </div>

                  {/* Premium Glowing Glass Step Indicator */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-150px" }}
                    transition={{ duration: 0.6, delay: step.delay, type: "spring" }}
                    className="relative z-30 hidden md:flex items-center justify-center w-20 h-20 shrink-0 group perspective-1000"
                  >
                    <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 3, repeat: Infinity }} className={`absolute inset-[-12px] rounded-full bg-gradient-to-br ${step.color} opacity-30 blur-md`} />
                    
                    <div className="w-full h-full rounded-full bg-white/90 backdrop-blur-2xl border-[4px] border-white shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_25px_50px_-5px_rgba(99,102,241,0.3)] transition-all duration-500 relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-[0.08] group-hover:opacity-20 transition-opacity duration-500`} />
                      <div className="absolute top-1.5 right-3 text-[10px] font-black text-slate-300">0{index + 1}</div>
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)] relative z-10`}>
                        <Icon className="w-5 h-5 text-white drop-shadow-md" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Redesigned Text Card - Premium Glassmorphism */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: step.delay + 0.1, type: "spring", stiffness: 80 }}
                    className="w-full md:w-[45%] text-center md:text-left relative group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 blur-3xl rounded-[3rem] transition-opacity duration-700 -z-10`} />
                    
                    <div className="p-10 lg:p-12 rounded-[3rem] bg-gradient-to-br from-white/95 to-white/60 backdrop-blur-3xl border border-white/60 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05),inset_0_0_0_1px_rgba(255,255,255,1)] hover:shadow-[0_40px_80px_-20px_rgba(99,102,241,0.2)] group-hover:-translate-y-3 transition-all duration-500 relative overflow-hidden h-full flex flex-col justify-center">
                      
                      {/* Inner ambient glow */}
                      <div className={`absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-bl ${step.color} opacity-[0.05] blur-3xl rounded-full`} />
                      
                      {/* Animated inner border that glows on hover */}
                      <div className={`absolute inset-0 rounded-[3rem] border-2 border-transparent group-hover:border-${step.color.split('-')[1]}-300/30 transition-colors duration-500 pointer-events-none`} />

                      <div className="flex items-center justify-center md:justify-start gap-5 mb-6 relative z-10">
                        {/* Refined Step Badge */}
                        <div className="px-3 py-1.5 rounded-xl bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] border border-slate-50 group-hover:scale-110 group-hover:shadow-[0_10px_20px_rgba(99,102,241,0.15)] transition-all duration-500">
                          <span className={`font-mono text-base font-black bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>
                            0{index + 1}
                          </span>
                        </div>
                        <h3 className="font-display font-black text-3xl text-slate-900 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:to-slate-700 transition-all">{step.title}</h3>
                      </div>
                      <p className="text-slate-500 text-xl leading-relaxed font-sans relative z-10 group-hover:text-slate-600 transition-colors">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}