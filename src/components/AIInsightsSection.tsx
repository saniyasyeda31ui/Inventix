import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, AlertTriangle, TrendingUp, DollarSign, RefreshCw, 
  ChevronRight, ArrowRight, CheckCircle2, ShieldCheck, Zap, Factory
} from "lucide-react";
import { AIRecommendation } from "../data/dashboardData";
import { useAIRecommendations } from "../hooks/useAIRecommendations";

interface AIInsightsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function AIInsightsSection({ onShowToast }: AIInsightsSectionProps) {
  const { recommendations: recs, loading, error, refreshRecommendations, executeRecommendation } = useAIRecommendations();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredForecastPoint, setHoveredForecastPoint] = useState(false);

  const handleRefreshAI = async () => {
    setIsRefreshing(true);
    onShowToast("Re-evaluating inventory trends, lead-times, and global commodity pricing...", "info");
    await refreshRecommendations();
    setIsRefreshing(false);
    onShowToast("AI Sourcing recommendations updated successfully.", "success");
  };

  const handleApplySourcing = async (rec: AIRecommendation) => {
    try {
      await executeRecommendation(rec.id);
      onShowToast(`Dispatched reorder for ${rec.reorderQty} units of ${rec.item} from ${rec.alternativeSupplier}.`, "success");
    } catch (err: any) {
      onShowToast(err.message || "Failed to apply strategy.", "error");
    }
  };


  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-6"
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-500" />
            <span>AI Procurement Assistant & Predictive Insights</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Autonomous demand forecasts, automatic stockout prevention algorithms, and smart cost-optimization opportunities.</p>
        </div>
        
        <button
          onClick={handleRefreshAI}
          disabled={isRefreshing}
          className="premium-button-secondary disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Calculating..." : "Recalculate Models"}</span>
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-6 rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] space-y-2 card-hover-effect">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Potential Cost Savings</span>
          <div className="text-3xl font-black text-emerald-500 tracking-tight">$34,800/mo</div>
          <p className="text-xs font-medium text-slate-500/80">Through strategic supplier switches and volume optimizations.</p>
        </div>

        <div className="p-6 rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] space-y-2 card-hover-effect">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Supply Chain Risk Score</span>
          <div className="text-3xl font-black text-indigo-500 tracking-tight">94.2 / 100</div>
          <p className="text-xs font-medium text-slate-500/80">99.8% accurate lead-time prediction buffer active.</p>
        </div>

        <div className="p-6 rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-3xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] space-y-2 card-hover-effect">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Predicted Stockouts Avoided</span>
          <div className="text-3xl font-black text-slate-900 tracking-tight">12 SKUs</div>
          <p className="text-xs font-medium text-slate-500/80">Automated buffer threshold triggered last 30 days.</p>
        </div>

      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-400 animate-slideIn">
          <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-rose-300">AI Engine Connectivity Error</span>
            <span className="leading-relaxed mt-1 text-xs">{error}</span>
            <button 
              onClick={refreshRecommendations} 
              className="mt-2 w-fit text-xs font-semibold px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Grid: Recommendations + Demand Curves */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Sourcing Actions & Supplier Switching */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-widest pl-1">
            Supplier Recommendations & Reorder Triggers
          </h2>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="p-5 rounded-2xl border bg-white/50 backdrop-blur-2xl border-white/40 space-y-4 animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800" />
                    <div className="h-5 w-48 rounded bg-slate-800" />
                  </div>
                  <div className="h-4 w-full rounded bg-slate-800" />
                  <div className="h-4 w-3/4 rounded bg-slate-800" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="h-12 w-full rounded-xl bg-slate-800" />
                    <div className="h-12 w-full rounded-xl bg-slate-800" />
                    <div className="h-12 w-full rounded-xl bg-slate-800" />
                  </div>
                </div>
              ))
            ) : recs.length > 0 ? (
              recs.map((r) => (
                <div 
                  key={r.id}
                  className={`p-6 md:p-8 rounded-[32px] border bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_30px_80px_-20px_rgba(99,102,241,0.06),inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col justify-between gap-5 card-hover-effect relative overflow-hidden group ${
                    r.severity === "high" 
                      ? "!border-rose-500/30 hover:!border-rose-500/50" 
                      : r.severity === "medium" 
                        ? "!border-amber-500/30 hover:!border-amber-500/50" 
                        : "!border-indigo-500/30 hover:!border-indigo-500/50"
                  }`}
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-bl-full -z-10 group-hover:from-indigo-500/20 transition-all duration-1000 blur-3xl pointer-events-none" />
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-2 rounded-xl border ${
                      r.severity === "high" 
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" 
                        : r.severity === "medium"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                          : "bg-indigo-500/10 border-indigo-500/20 text-indigo-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                    }`}>
                      {r.severity === "high" ? <AlertTriangle className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-lg">{r.item}</h3>
                      <p className="text-[13px] font-medium text-slate-500/90 mt-1 leading-relaxed">{r.alert}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
                    <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Reorder Volume</span>
                      <span className="text-[15px] font-black text-slate-900">{r.reorderQty} units</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Alt. Supplier</span>
                      <span className="text-[15px] font-black text-slate-900">{r.alternativeSupplier}</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Proj. Savings</span>
                      <span className="text-[15px] font-black text-emerald-600">{r.estimatedSavings}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2 relative z-10">
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold uppercase tracking-widest bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shadow-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{r.priceReduction}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleApplySourcing(r)}
                      className="premium-button-primary w-full sm:w-auto"
                    >
                      <span>Apply Strategy</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900/50 flex items-center justify-center border border-slate-800">
                  <Sparkles className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-slate-800 font-bold">No Active Recommendations</h3>
                  <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
                    The AI engine has optimized your current inventory parameters. Check back later for newly computed sourcing strategies.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Demand Forecast Widget */}
        <div className="space-y-4">
          <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-widest pl-1">
            Predicted Demand Curve
          </h2>

          <div className="p-6 md:p-8 rounded-[32px] border border-white/80 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_30px_80px_-20px_rgba(99,102,241,0.06),inset_0_1px_1px_rgba(255,255,255,1)] relative overflow-hidden space-y-5 card-hover-effect group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-bl-full -z-10 group-hover:from-indigo-500/20 transition-all duration-1000 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/10 rounded-full blur-[60px] pointer-events-none" />

            <div className="space-y-1 relative z-10">
              <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest block">Seasonal Demand Forecast</span>
              <h3 className="text-lg font-black text-slate-900">Q3/Q4 Production Wave</h3>
              <p className="text-[13px] font-medium text-slate-500/90">Autonomous predictions modeling higher requirements in autumn.</p>
            </div>

            {/* Custom SVG line plot with mouse triggers */}
            <div className="pt-2 relative">
              <svg viewBox="0 0 300 150" className="w-full h-32">
                <motion.path 
                  d="M 10,120 Q 80,100 150,50 T 290,30" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="1.5" 
                  strokeDasharray="3,3" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <motion.path 
                  d="M 10,120 Q 80,110 150,80 T 290,40" 
                  fill="none" 
                  stroke="#818cf8" 
                  strokeWidth="2.5" 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
                />
                
                {/* Labels */}
                <text x="10" y="140" fill="#475569" fontSize="8">Jul</text>
                <text x="80" y="140" fill="#475569" fontSize="8">Aug</text>
                <text x="150" y="140" fill="#475569" fontSize="8">Sep</text>
                <text x="220" y="140" fill="#475569" fontSize="8">Oct</text>
                <text x="290" y="140" fill="#475569" fontSize="8">Nov</text>
                
                {/* Invisible hover trigger zone for point */}
                <circle 
                  cx="150" 
                  cy="80" 
                  r="15" 
                  fill="transparent" 
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredForecastPoint(true)}
                  onMouseLeave={() => setHoveredForecastPoint(false)}
                />

                <motion.circle 
                  cx="150" 
                  cy="80" 
                  initial={{ r: 3 }}
                  animate={{ r: hoveredForecastPoint ? 6 : 3 }}
                  fill="#fbbf24" 
                  className="pointer-events-none"
                />
                <text x="155" y="75" fill="#fbbf24" fontSize="8" fontWeight="bold">Forecast Apex</text>

                {/* Live Tooltip when hovered */}
                {hoveredForecastPoint && (
                  <g className="pointer-events-none">
                    <rect x="110" y="20" width="80" height="30" rx="4" fill="#090d1f" stroke="#fbbf24" strokeWidth="1" />
                    <text x="150" y="32" fill="#94a3b8" fontSize="7" textAnchor="middle" fontWeight="bold">Peak Demand</text>
                    <text x="150" y="44" fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">+145% vs baseline</text>
                  </g>
                )}
              </svg>
            </div>

            <div className="p-5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] space-y-3 relative z-10">
              <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Recommended Stock Buffers:</h4>
              <ul className="space-y-2 text-[13px] font-medium text-slate-700 list-disc list-inside">
                <li>Increase Copper Safety margins by 15%</li>
                <li>Lock pricing contracts for Polymers now</li>
                <li>Verify air cargo lanes for wafer transit</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

    </motion.div>
  );
}
