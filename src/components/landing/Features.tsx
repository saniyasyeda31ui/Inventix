import { useState } from "react";
import { Sparkles, Package, Warehouse, Users, Receipt, FileBarChart2, BadgeCheck, Network, ArrowUpRight } from "lucide-react";

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState(0);

  const features = [
    {
      title: "AI Procurement & Auto-Bidding",
      description: "Automate contract negotiations and multi-bid sourcing workflows. Our AI system analyzes past supplier responses to optimize prices and guarantee fulfillment speeds.",
      icon: Sparkles,
      color: "from-indigo-500 to-indigo-600",
      stats: { metric: "$142k", label: "Avg. Monthly Procurement Savings", detail: "Based on 2025 pilot studies" },
      bullets: [
        "AI-Generated Purchase Requests based on warehouse trends",
        "Automated vendor contract discrepancy detection",
        "Dynamic dual-source bidding with risk mitigation scoring"
      ]
    },
    {
      title: "Real-Time Inventory Tracking",
      description: "Achieve 100% stock accuracy across global operations. Instantly register parts, batch lots, track serialization, and oversee real-time material flows.",
      icon: Package,
      color: "from-blue-500 to-indigo-500",
      stats: { metric: "0.1s", label: "Sync Latency to Local Scanners", detail: "Proprietary offline-first syncing" },
      bullets: [
        "Pallet and shelf-level absolute coordinate tracking",
        "Automated low-stock threshold alerts with PO triggers",
        "Barcode & RFID direct API integration readiness"
      ]
    },
    {
      title: "Multi-Warehouse Management",
      description: "Consolidate global sites, physical plants, distribution hubs, and storage yards into one virtual command deck. Handle bulk transfers with full routing visibility.",
      icon: Warehouse,
      color: "from-indigo-600 to-violet-500",
      stats: { metric: "99.98%", label: "Internal Transfer SLA", detail: "Minimized mid-transit log errors" },
      bullets: [
        "Inter-warehouse automated freight cost comparison",
        "Dynamic yard space allocation optimizer",
        "Silo, cold storage, and heavy machinery safety zones"
      ]
    },
    {
      title: "Enterprise Vendor Hub",
      description: "Build robust supplier relationships. Track lead times, delivery quality, contract SLAs, financial compliance, and credit rating risks in real-time.",
      icon: Users,
      color: "from-violet-500 to-fuchsia-500",
      stats: { metric: "4.8s", label: "Avg. On-Time Supplier Rating", detail: "Real-time automated performance reviews" },
      bullets: [
        "Automated EDI onboarding questionnaires",
        "Contract compliance checker and deadline alert triggers",
        "Historical quality rating scoreboards per SKU"
      ]
    },
    {
      title: "Purchase Order Automation",
      description: "Convert requests into fully-compliant Purchase Orders. Send direct via EDI, e-mail, or API, complete with custom multi-stage manager authorization flows.",
      icon: Receipt,
      color: "from-fuchsia-500 to-pink-500",
      stats: { metric: "100%", label: "Paperless Procurement Workflow", detail: "Digital-only secure audit trails" },
      bullets: [
        "Custom, granular corporate spending ceilings by role",
        "Multi-stage digital signatures & secure encrypted trails",
        "Direct export to standard enterprise formats"
      ]
    },
    {
      title: "Predictive Analytics & Reports",
      description: "Uncover operational inefficiencies before they impact the bottom line. Access auto-compiled balance sheet records, turnover ratios, and lead time forecasts.",
      icon: FileBarChart2,
      color: "from-rose-500 to-indigo-500",
      stats: { metric: "18%", label: "Stock Turnover Velocity Gain", detail: "Achieved via predictive batching" },
      bullets: [
        "Custom report builder with automated scheduling",
        "Interactive cost-center breakdown diagrams",
        "Historical burn-rate calculations with warning flags"
      ]
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#030712] relative z-10 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            Industrial-Grade Features Built for Enterprises
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Inventix standardizes procurement, minimizes supply chain friction, and maximizes warehouse efficiency. Click below to explore each core module.
          </p>
        </div>

        {/* Feature grid and active display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Grid Selector */}
          <div className="lg:col-span-5 space-y-3">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <button
                  key={feat.title}
                  onClick={() => setSelectedFeature(index)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start gap-4 group hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
                    selectedFeature === index
                      ? "bg-slate-900/80 border-indigo-500/30 shadow-lg shadow-indigo-950/20"
                      : "bg-slate-950/30 border-slate-900 hover:bg-slate-900/50 hover:border-slate-800/80"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 bg-gradient-to-br ${feat.color} text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-semibold text-sm transition-colors ${selectedFeature === index ? "text-indigo-400" : "text-slate-200"}`}>
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400/80 mt-1 line-clamp-1">{feat.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Detailed Visual Card */}
          <div className="lg:col-span-7 bg-slate-950/60 rounded-2xl border border-slate-800 p-6 md:p-8 relative glow-subtle transition-all duration-300">
            {/* Visual Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${features[selectedFeature].color} text-white shadow-md animate-pulse`}>
                  {(() => {
                    const TargetIcon = features[selectedFeature].icon;
                    return <TargetIcon className="w-6 h-6 animate-spin-slow" />;
                  })()}
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">{features[selectedFeature].title}</h3>
                  <span className="text-xs font-mono text-indigo-400">Enterprise Module V1.0</span>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 text-right">
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Preview Ready
                </span>
              </div>
            </div>

            {/* Content & Stats */}
            <div className="py-6 space-y-6">
              <p className="text-slate-300 text-sm leading-relaxed">{features[selectedFeature].description}</p>

              {/* Stats Badge */}
              <div className="p-4 rounded-xl bg-indigo-950/10 border border-indigo-500/10 grid grid-cols-3 gap-4 items-center hover:bg-indigo-950/20 transition-colors">
                <div className="col-span-1 text-center border-r border-slate-900/65">
                  <div className="text-2xl sm:text-3xl font-bold font-display text-white">{features[selectedFeature].stats.metric}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs font-semibold text-indigo-400">{features[selectedFeature].stats.label}</div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{features[selectedFeature].stats.detail}</div>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Platform Capabilities Include:</h4>
                <ul className="space-y-2">
                  {features[selectedFeature].bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-300 hover:text-white transition-colors">
                      <BadgeCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Callout & Learn More Link */}
            <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Inter-connected Architecture Enabled
              </span>
              <button 
                className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer group focus:outline-none focus:underline"
                onClick={() => {
                  const pricingSection = document.getElementById("pricing");
                  if (pricingSection) {
                    window.scrollTo({
                      top: pricingSection.offsetTop - 80,
                      behavior: "smooth"
                    });
                  }
                }}
              >
                <span>Learn More & Pricing</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
