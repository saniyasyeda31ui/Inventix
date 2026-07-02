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

  console.log('[AIInsightsSection] Rendering recs:', recs, 'loading:', loading);

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
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span>AI Procurement Assistant & Predictive Insights</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Autonomous demand forecasts, automatic stockout prevention algorithms, and smart cost-optimization opportunities.</p>
        </div>
        
        <button
          onClick={handleRefreshAI}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/60 text-slate-300 text-xs font-semibold cursor-pointer disabled:opacity-50 button-hover-scale"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>{isRefreshing ? "Calculating..." : "Recalculate Models"}</span>
        </button>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-1 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Potential Cost Savings</span>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">$34,800/mo</div>
          <p className="text-[10px] text-slate-400">Through strategic supplier switches and volume optimizations.</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-1 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Supply Chain Risk Score</span>
          <div className="text-2xl font-bold text-indigo-400 tracking-tight">94.2 / 100</div>
          <p className="text-[10px] text-slate-400">99.8% accurate lead-time prediction buffer active.</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-1 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Predicted Stockouts Avoided</span>
          <div className="text-2xl font-bold text-white tracking-tight">12 SKUs</div>
          <p className="text-[10px] text-slate-400">Automated buffer threshold triggered last 30 days.</p>
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
          <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
            Supplier Recommendations & Reorder Triggers
          </h2>

          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={`skeleton-${i}`} className="p-5 rounded-2xl border bg-[#040815] border-slate-900/40 space-y-4 animate-pulse">
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
                  className={`p-5 rounded-2xl border bg-[#040815] transition-all flex flex-col justify-between gap-4 card-hover-effect ${
                    r.severity === "high" 
                      ? "border-rose-500/10 hover:border-rose-500/20" 
                      : r.severity === "medium" 
                        ? "border-amber-500/10 hover:border-amber-500/20" 
                        : "border-indigo-500/10 hover:border-indigo-500/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg border ${
                      r.severity === "high" 
                        ? "bg-rose-500/10 border-rose-500/20 text-rose-400" 
                        : r.severity === "medium"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                          : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                    }`}>
                      {r.severity === "high" ? <AlertTriangle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-200">{r.item}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{r.alert}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-900/50">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold mb-1">Reorder Volume</span>
                      <span className="text-sm font-bold text-slate-200">{r.reorderQty} units</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-900/50">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold mb-1">Alt. Supplier</span>
                      <span className="text-sm font-bold text-slate-200">{r.alternativeSupplier}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-900/50">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-bold mb-1">Proj. Savings</span>
                      <span className="text-sm font-bold text-emerald-400">{r.estimatedSavings}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400/90 font-medium bg-emerald-500/5 px-2 py-1 rounded">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{r.priceReduction}</span>
                    </div>
                    
                    <button 
                      onClick={() => handleApplySourcing(r)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer button-hover-scale"
                    >
                      <span>Apply Strategy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 rounded-2xl border border-slate-900 bg-[#040815] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900/50 flex items-center justify-center border border-slate-800">
                  <Sparkles className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-slate-300 font-bold">No Active Recommendations</h3>
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
          <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
            Predicted Demand Curve
          </h2>

          <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-4 card-hover-effect">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">Seasonal Demand Forecast</span>
              <h3 className="text-sm font-bold text-white">Q3/Q4 Production Wave</h3>
              <p className="text-xs text-slate-500">Autonomous predictions modeling higher requirements in autumn.</p>
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

            <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/10 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-200">Recommended Stock Buffers:</h4>
              <ul className="space-y-1 text-[10px] text-slate-400 list-disc list-inside">
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
