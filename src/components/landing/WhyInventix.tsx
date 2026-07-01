import React, { useState, useEffect } from "react";
import { Sparkles, Package, Warehouse, Users, Receipt, BarChart3, GitCommit, ShieldCheck, Award, Check } from "lucide-react";

export default function WhyInventix() {
  const [poCount, setPoCount] = useState(1240);
  const [slashPercent, setSlashPercent] = useState(15);
  const [supplierCount, setSupplierCount] = useState(480);

  useEffect(() => {
    // Elegant counts simulation
    const poTimer = setInterval(() => {
      setPoCount((prev) => {
        if (prev >= 2480) {
          clearInterval(poTimer);
          return 2480;
        }
        return prev + 40;
      });
    }, 15);

    const slashTimer = setInterval(() => {
      setSlashPercent((prev) => {
        if (prev >= 85) {
          clearInterval(slashTimer);
          return 85;
        }
        return prev + 2;
      });
    }, 25);

    const supplierTimer = setInterval(() => {
      setSupplierCount((prev) => {
        if (prev >= 4500) {
          clearInterval(supplierTimer);
          return 4500;
        }
        return prev + 100;
      });
    }, 15);

    return () => {
      clearInterval(poTimer);
      clearInterval(slashTimer);
      clearInterval(supplierTimer);
    };
  }, []);

  const features = [
    {
      title: "AI Procurement Assistant",
      what: "An intelligent companion that monitors market prices, vendor delivery histories, and company supply records automatically.",
      why: "It flags price drops and identifies optimal times to reorder without requiring manual mathematical modeling.",
      how: "Helps your business lower raw material costs and prevent sudden supply shortage emergencies.",
      icon: Sparkles,
      color: "text-amber-400 font-semibold border-amber-500/20 bg-amber-500/5",
      badge: "AI Powered",
    },
    {
      title: "Smart Inventory Tracking",
      what: "A live, real-time ledger that records exact item levels, storage shelf locations, and active SKU movements.",
      why: "Provides immediate visibility, ensuring you always know what products are on hand and where they are placed.",
      how: "Eliminates stock discrepancies, prevents double-ordering, and speeds up manual audit processes.",
      icon: Package,
      color: "text-indigo-400 font-semibold border-indigo-500/20 bg-indigo-500/5",
      badge: "Core Ledger",
    },
    {
      title: "Multi-Warehouse Management",
      what: "A central system to synchronize stock, shipments, and receiving records across several physical locations.",
      why: "Links distant warehouses and logistics centers, keeping all inventories visible on a single dashboard.",
      how: "Allows operations teams to shift items between hubs easily and optimize delivery dispatch routes.",
      icon: Warehouse,
      color: "text-violet-400 font-semibold border-violet-500/20 bg-violet-500/5",
      badge: "Logistics Hub",
    },
    {
      title: "Vendor Management",
      what: "A single, structured database to score supplier response rates, price consistency, and average lead times.",
      why: "Keeps contact details, purchase terms, and historic delivery performance logs organized in one place.",
      how: "Helps procurement managers negotiate better contract rates and source materials from the most reliable partners.",
      icon: Users,
      color: "text-blue-400 font-semibold border-blue-500/20 bg-blue-500/5",
      badge: "Supplier Portal",
    },
    {
      title: "Purchase Order Automation",
      what: "A background pipeline that compiles, formats, and dispatches official purchase orders to suppliers.",
      why: "Triggers replenishment orders instantly when inventory dips below safety levels, with zero drafting delay.",
      how: "Saves hours of paper admin and slashes delivery wait cycles from several days to mere minutes.",
      icon: Receipt,
      color: "text-emerald-400 font-semibold border-emerald-500/20 bg-emerald-500/5",
      badge: "Automation",
    },
    {
      title: "Analytics & Reports",
      what: "A clean visualization dashboard that tracks inventory turnover rates, historical costs, and capital usage.",
      why: "Turns thousands of individual transactions into easy-to-read charts for immediate executive insight.",
      how: "Empowers business owners and managers to make strategic, data-driven planning and budgeting decisions.",
      icon: BarChart3,
      color: "text-rose-400 font-semibold border-rose-500/20 bg-rose-500/5",
      badge: "Business Intelligence",
    },
    {
      title: "Approval Workflow",
      what: "Custom, rule-based request systems that automatically route large purchase requisitions to managers.",
      why: "Ensures no large transaction is dispatched to a supplier without correct department sign-offs.",
      how: "Guarantees strict financial control and budget compliance, preventing unapproved team spending.",
      icon: GitCommit,
      color: "text-cyan-400 font-semibold border-cyan-500/20 bg-cyan-500/5",
      badge: "Governance",
    },
    {
      title: "Role-Based Access",
      what: "Fine-grained permission controls to limit which parts of the system different employees can view or edit.",
      why: "Restricts loading bay staff to warehouse logs, while restricting financial ledgers strictly to accounting teams.",
      how: "Protects sensitive pricing information and business operations from accidental changes or internal errors.",
      icon: ShieldCheck,
      color: "text-teal-400 font-semibold border-teal-500/20 bg-teal-500/5",
      badge: "Security Standard",
    },
  ];

  return (
    <section id="why-inventix" className="py-24 bg-[#030712] relative z-10 border-t border-slate-900/80">
      {/* Decorative gradient spot */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none opacity-10 bg-radial-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Title & Concept */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-widest mb-3">
            Professional Inventory & Procurement Suite
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            Everything You Need to Manage Your Supply Chain
          </h2>
          <p className="text-slate-400 text-base leading-relaxed">
            A complete, easy-to-understand logistics suite that connects loading bays, purchasing teams, and management in real time.
          </p>
        </div>

        {/* Dynamic Business Statistics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/60 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Autonomous Scale</span>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white my-3 flex items-baseline gap-1">
              ${(poCount / 1000).toFixed(2)}B<span className="text-indigo-400 text-base">+</span>
            </div>
            <p className="text-xs text-slate-400">Total volume of purchase orders successfully routed globally on our ledger.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/60 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Velocity Improvement</span>
            <div className="text-3xl sm:text-4xl font-bold font-display text-emerald-400 my-3 flex items-baseline gap-1">
              -{slashPercent}% Time
            </div>
            <p className="text-xs text-slate-400">Average reduction in draft-to-approve cycles for multi-warehouse orders.</p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/60 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
            <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Supply Security</span>
            <div className="text-3xl sm:text-4xl font-bold font-display text-white my-3 flex items-baseline gap-1">
              {supplierCount.toLocaleString()}
              <span className="text-indigo-400 text-base">+</span>
            </div>
            <p className="text-xs text-slate-400">Directly connected manufacturers, logistics providers, and verified suppliers.</p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 relative overflow-hidden flex flex-col justify-between hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300 group"
                style={{
                  boxShadow: `inset 0 1px 1px 0 rgba(255, 255, 255, 0.02), 0 10px 40px -10px rgba(0, 0, 0, 0.8)`
                }}
              >
                {/* Subtle spotlight glow on card hover */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors duration-500" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[9px] font-mono uppercase bg-slate-900 border border-slate-800/80 px-2 py-0.5 rounded text-slate-400">
                      {item.badge}
                    </span>
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800/80 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      <Icon className="w-4 h-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-base text-white mb-4 group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h3>

                  <div className="space-y-3.5">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400/80 uppercase block mb-0.5">What it does</span>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">{item.what}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400/80 uppercase block mb-0.5">Why it matters</span>
                      <p className="text-xs text-slate-400 leading-relaxed font-normal">{item.why}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom benefit banner */}
                <div className="mt-5 pt-4 border-t border-slate-900/60 flex items-start gap-1.5 text-xs text-slate-400">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">
                    <strong className="text-slate-300 font-semibold">Value:</strong> {item.how}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Approval Flow Visual Aid Card (Enterprise governance demo) */}
        <div className="mt-8 p-6 sm:p-8 rounded-2xl border border-slate-900 bg-gradient-to-r from-slate-950/80 to-[#050b18]/50 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-indigo-500/20 transition-all duration-300">
          <div className="space-y-4 max-w-xl">
            <span className="text-[10px] font-mono uppercase bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20 text-indigo-400">
              Governance Visualized
            </span>
            <h3 className="font-display font-bold text-xl text-white">Interactive Budget Threshold Approvals</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Every step of our procurement process is governed by strict financial boundaries. A standard request is auto-approved instantly, while larger transactions are routed to the relevant manager, VP, or CFO based on custom thresholds.
            </p>
          </div>

          {/* Mini diagram showing flow */}
          <div className="w-full md:w-auto shrink-0 bg-[#02050c]/90 rounded-xl border border-slate-900/85 p-4 font-mono text-xs text-slate-400 space-y-3 min-w-[280px]">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900/30">
              <span className="text-slate-400">1. Request &lt; $5k</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-400" /> Auto-Approved
              </span>
            </div>
            <div className="flex items-center justify-center">
              <GitCommit className="w-4 h-4 text-slate-600 rotate-90" />
            </div>
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900/30 border border-slate-800">
              <span className="text-slate-300">2. Request &lt; $100k</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" /> CFO Sign-off
              </span>
            </div>
            <div className="flex items-center justify-center">
              <GitCommit className="w-4 h-4 text-slate-600 rotate-90" />
            </div>
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-slate-900/30">
              <span className="text-slate-400">3. Request &gt; $100k</span>
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-rose-400" /> Board Review
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
