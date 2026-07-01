import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, AlertTriangle, TrendingUp, DollarSign, RefreshCw, 
  ChevronRight, ArrowRight, CheckCircle2, ShieldCheck, Zap, Factory
} from "lucide-react";
import { aiRecommendations, AIRecommendation } from "../data/dashboardData";

interface AIInsightsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function AIInsightsSection({ onShowToast }: AIInsightsSectionProps) {
  const [recs, setRecs] = useState<AIRecommendation[]>(aiRecommendations);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hoveredForecastPoint, setHoveredForecastPoint] = useState<boolean>(false);

  const handleRefreshAI = () => {
    setIsRefreshing(true);
    onShowToast("Re-evaluating inventory trends, lead-times, and global commodity pricing...", "info");
    setTimeout(() => {
      setIsRefreshing(false);
      onShowToast("AI Sourcing recommendations updated successfully.", "success");
    }, 1200);
  };

  const handleApplySourcing = (rec: AIRecommendation) => {
    onShowToast(`Dispatched reorder for ${rec.reorderQty} units of ${rec.item} from ${rec.alternativeSupplier}. Estimated monthly savings: ${rec.estimatedSavings}!`, "success");
    setRecs(recs.filter(r => r.id !== rec.id));
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

      {/* Grid: Recommendations + Demand Curves */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Sourcing Actions & Supplier Switching */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
            Supplier Recommendations & Reorder Triggers
          </h2>

          <div className="space-y-4">
            {recs.length > 0 ? (
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
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase badge-glow ${
                          r.severity === "high" 
                            ? "bg-rose-500/15 text-rose-400" 
                            : r.severity === "medium" 
                              ? "bg-amber-500/15 text-amber-400" 
                              : "bg-indigo-500/15 text-indigo-400"
                        }`}>
                          {r.severity} Priority
                        </span>
                        <h4 className="text-xs font-mono font-bold text-slate-500 uppercase">Automated Alert</h4>
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-tight mt-1">{r.item}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">{r.alert}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[10px] text-slate-500 block font-mono">Suggested Reorder Quantity</span>
                      <span className="text-sm font-bold text-white font-mono">{r.reorderQty} units</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <span>Alternative Sourcing:</span>
                        <span className="font-semibold text-slate-200">{r.alternativeSupplier}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px]">
                        <span>{r.priceReduction}</span>
                        <span>•</span>
                        <span>Est. Savings: {r.estimatedSavings}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleApplySourcing(r)}
                      className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[11px] transition-all flex items-center gap-1 justify-center cursor-pointer shrink-0 button-hover-scale"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Execute Recommendation</span>
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl bg-[#040815] flex flex-col items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <p className="text-xs font-semibold text-slate-400">All predictions cleared. AI models monitoring supply parameters safely.</p>
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
