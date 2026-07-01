import React, { useState, useEffect } from "react";
import { Package, Warehouse, Users, Receipt, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

export default function TrustedBy() {
  // Real-time counter increments for authentic feel
  const [poCount, setPoCount] = useState(124840);
  const [aiRecs, setAiRecs] = useState(42109);

  useEffect(() => {
    const interval = setInterval(() => {
      setPoCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
      if (Math.random() > 0.6) {
        setAiRecs((prev) => prev + 1);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "Products Managed",
      value: "1,420,500+",
      sub: "SKUs Tracked Live",
      icon: Package,
      color: "text-indigo-400",
      bgGlow: "rgba(99, 102, 241, 0.05)",
    },
    {
      label: "Warehouses Connected",
      value: "24 Active Hubs",
      sub: "Global Multi-Tier Sync",
      icon: Warehouse,
      color: "text-violet-400",
      bgGlow: "rgba(139, 92, 246, 0.05)",
    },
    {
      label: "Vendors Managed",
      value: "850+ Partners",
      sub: "EDI & Contract-Integrated",
      icon: Users,
      color: "text-blue-400",
      bgGlow: "rgba(59, 130, 246, 0.05)",
    },
    {
      label: "Purchase Orders Processed",
      value: poCount.toLocaleString() + "+",
      sub: "Auto-Routed & Dispatched",
      icon: Receipt,
      color: "text-emerald-400",
      bgGlow: "rgba(16, 185, 129, 0.05)",
      isLive: true,
    },
    {
      label: "Inventory Accuracy",
      value: "99.98%",
      sub: "Zero-Downtime Reconciled",
      icon: ShieldCheck,
      color: "text-cyan-400",
      bgGlow: "rgba(6, 182, 212, 0.05)",
    },
    {
      label: "AI Recommendations",
      value: aiRecs.toLocaleString() + "+",
      sub: "Cost & Supply-Chain Optimization",
      icon: Sparkles,
      color: "text-amber-400",
      bgGlow: "rgba(245, 158, 11, 0.05)",
      isLive: true,
    },
  ];

  return (
    <section id="business-impact" className="py-20 border-y border-slate-900/80 bg-[#02050c]/80 relative z-10 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] pointer-events-none opacity-20 bg-radial-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <p className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            System Performance & Operational Reach
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Real-Time Platform Scale & Business Impact
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2">
            Inventix empowers global enterprises with automated supply chain infrastructure running on precision live ledger technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-5 rounded-xl border border-slate-900 bg-slate-950/40 relative overflow-hidden flex flex-col justify-between hover:border-slate-800 hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5"
                style={{
                  boxShadow: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.02), 0 4px 20px -2px rgba(0,0,0,0.5)`
                }}
              >
                {/* Background radial accent hover glow */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${stat.bgGlow} 0%, transparent 70%)`
                  }}
                />

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    {stat.isLive ? (
                      <span className="inline-flex items-center gap-1.5 text-indigo-400 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                        LIVE
                      </span>
                    ) : (
                      "STAT"
                    )}
                  </span>
                  <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800/85 transition-colors group-hover:border-slate-700 ${stat.color}`}>
                    <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>

                <div className="relative z-10">
                  <div className="text-xl sm:text-2xl font-bold font-display tracking-tight text-white mb-1 group-hover:text-slate-100 transition-colors">
                    {stat.value}
                  </div>
                  <h3 className="text-xs font-semibold text-slate-300 leading-tight mb-0.5">{stat.label}</h3>
                  <p className="text-[10px] text-slate-500 leading-normal">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
