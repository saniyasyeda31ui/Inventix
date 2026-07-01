import { useState, useEffect } from "react";
import { UserPlus, Settings, Warehouse, Package, Lightbulb, Play } from "lucide-react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Register Company",
      description: "Create your secure business workspace, register administrative accounts, and establish secure permission boundaries to begin centralizing your operations in minutes.",
      icon: UserPlus,
      mockup: {
        title: "Company Onboarding",
        code: `// Initialize isolated enterprise workspace environment
const clientProfile = await Inventix.registerCompany({
  companyName: "Acme Industrial Sourcing",
  domain: "acme-industrial.inventix.com",
  administrator: "admin@acme-industrial.com",
  securitySLA: "Standard-Enterprise-V1"
});
// Workspace status: ACTIVE and isolated.`,
        actionText: "Setup 1: Create your secure, isolated organizational profile"
      }
    },
    {
      title: "Configure Organization",
      description: "Map your business departments, organize cost-centers, invite staff, and define customized spending limits to ensure strict financial control for procurement teams.",
      icon: Settings,
      mockup: {
        title: "Organizational Blueprint Setup",
        code: `// Define roles and purchase budget boundaries
const organization = await Inventix.configureOrganization({
  costCenters: ["OPS-01", "FACILITIES-03"],
  approvers: ["manager.smith@acme.com", "cfo@acme.com"],
  spendingLimits: {
    operatorLimit: 5000,    // Auto-approves instantly
    managerLimit: 50000,    // Triggers supervisor review
    directorLimit: 150000   // Requires VP or CFO signature
  }
});
// Organization configuration successfully locked.`,
        actionText: "Setup 2: Establish spending limits and approval guidelines"
      }
    },
    {
      title: "Add Warehouses",
      description: "Add your physical storage locations, define storage sections, set minimum safety stock limits, and connect active scanning hardware for each unique facility.",
      icon: Warehouse,
      mockup: {
        title: "Warehouse Network Registration",
        code: `// Register distribution facilities and custom safety stock levels
const warehouse = await Inventix.addWarehouse({
  facilityName: "Central Midwest Hub",
  facilityCode: "WH-MIDWEST-02",
  address: "750 Logistics Drive, Chicago IL",
  storageZones: ["Dry-Bulk", "Temp-Controlled", "High-Value"],
  safetyStockBuffers: { 
    "COPPER-TUBING-X": 500, 
    "STAINLESS-STEEL-A": 200 
  }
});
// Facility synchronized. Loading bays connected to live monitors.`,
        actionText: "Setup 3: Map out your physical facilities and inventory safeguards"
      }
    },
    {
      title: "Manage Inventory",
      description: "Log incoming items, track material states, input SKU counts, and monitor inventory movements across all your sites in real time.",
      icon: Package,
      mockup: {
        title: "Real-Time Stock Monitoring",
        code: `// Track material levels and inbound scanning logs
const liveStock = await Inventix.getInventoryStatus({
  sku: "STAINLESS-STEEL-A",
  locations: ["WH-MIDWEST-02", "WH-EAST-01"]
});
console.log(\`Current Total Stock: \${liveStock.totalOnHand} units\`);
console.log(\`Reserved for active shipments: \${liveStock.reserved} units\`);
// Alert State: NORMAL (inventory levels are healthy)`,
        actionText: "Setup 4: Oversee inventory counts and active movements live"
      }
    },
    {
      title: "AI Procurement Insights",
      description: "Receive automatic alerts when stock runs low, compare supplier delivery times, view performance scores, and get optimization tips to make smart reordering decisions.",
      icon: Lightbulb,
      mockup: {
        title: "AI Procurement Optimizations",
        code: `// Analyze market patterns and supplier delivery times
const aiInsights = await Inventix.getProcurementInsights({
  targetSKU: "STAINLESS-STEEL-A",
  historicalRunwaysDays: 90
});
console.log(\`AI suggestion: Purchase from Supplier 'Nippon Sourcing'\`);
console.log(\`Estimated savings: $14,250 based on current spot-price discounts\`);
// INSIGHT READY: Purchase Stainless Steel. Spot prices are down 6%.`,
        actionText: "Setup 5: Translate historical inventory patterns into cash savings"
      }
    }
  ];

  // Auto-scroll loop to simulate real dynamic highlights
  useEffect(() => {
    const handleScrollHighlight = () => {
      const section = document.getElementById("how-it-works");
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          const totalHeight = rect.height;
          const scrolledAmount = Math.max(0, -rect.top);
          const rawIndex = Math.floor((scrolledAmount / totalHeight) * steps.length);
          const index = Math.min(steps.length - 1, Math.max(0, rawIndex));
        }
      }
    };
    window.addEventListener("scroll", handleScrollHighlight);
    return () => window.removeEventListener("scroll", handleScrollHighlight);
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-[#02050c]/50 relative z-10 border-t border-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight text-white mb-4">
            Unified Operations, Re-imagined
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            Five simple steps to modernize your physical supply lines and achieve total operational clarity. Click on any step to preview the interface code.
          </p>
        </div>

        {/* Step Selector Bars with animated line connectors */}
        <div className="relative mb-12">
          {/* Timeline Connector Line */}
          <div className="absolute top-[28px] left-[6%] right-[6%] h-[2px] bg-slate-800/80 hidden sm:block z-0">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-500 transition-all duration-500 ease-out" 
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch justify-between gap-4 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isPassed = index <= activeStep;
              const isActive = index === activeStep;
              return (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(index)}
                  className={`flex-1 text-left p-4 rounded-xl border transition-all duration-300 relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isActive
                      ? "bg-slate-900 border-indigo-500/40 shadow-lg shadow-indigo-950/25 scale-[1.01]"
                      : "bg-[#030712]/95 border-slate-900/60 hover:bg-slate-900/40 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                        : isPassed 
                          ? "bg-indigo-950/50 text-indigo-400 border border-indigo-500/20" 
                          : "bg-slate-900 text-slate-500"
                    }`}>
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className={`text-[10px] font-mono tracking-wider ${isActive ? "text-indigo-400 font-bold animate-pulse" : "text-slate-500"}`}>
                      0{index + 1}.
                    </span>
                  </div>
                  <h3 className={`font-semibold text-sm transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
                    {step.title}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Layout details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
          {/* Description Block */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-xs text-indigo-400 font-medium">
              <Play className="w-3 h-3 fill-current animate-pulse text-indigo-400" />
              <span>Step 0{activeStep + 1} of 05</span>
            </div>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white transition-all duration-300">{steps[activeStep].title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed min-h-[60px]">{steps[activeStep].description}</p>
            <div className="h-px bg-slate-900" />
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <span className="text-xs font-mono text-indigo-400 font-medium">{steps[activeStep].mockup.actionText}</span>
            </div>
          </div>

          {/* Simulated Code Panel */}
          <div className="lg:col-span-7 bg-[#02050b] rounded-2xl border border-slate-900 shadow-xl overflow-hidden glow-subtle">
            <div className="px-4 py-3 bg-[#03070d] border-b border-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs text-slate-400 font-semibold font-mono">{steps[activeStep].mockup.title}</span>
              </div>
              <span className="text-[10px] text-indigo-400 font-mono uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                PROD INTEGRATION
              </span>
            </div>
            <div className="p-4 sm:p-6 font-mono text-xs text-indigo-200/90 leading-relaxed overflow-x-auto whitespace-pre bg-[#010307]">
              {steps[activeStep].mockup.code}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
