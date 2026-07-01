import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Sparkles, Package, Shield, Globe, 
  RefreshCw, Layers, AlertCircle, Warehouse, Users, Receipt, 
  Bell, CheckCircle2, Activity, CircleDot, ChevronRight,
  TrendingUp, BarChart2
} from "lucide-react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"inventory" | "forecasting" | "procurement">("inventory");
  const [livePulse, setLivePulse] = useState(true);
  const [activeAlertsCount, setActiveAlertsCount] = useState(2);

  // Simulated live-updating timestamps
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative pt-32 pb-24 md:pt-40 md:pb-36 overflow-hidden bg-[#030712] bg-grid-pattern">
      {/* Decorative Gradients with subtle slow motion */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[700px] pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[10%] w-[550px] h-[550px] rounded-full bg-indigo-600/15 blur-[130px] animate-pulse duration-[8000ms]" />
        <div className="absolute top-[-5%] right-[10%] w-[550px] h-[550px] rounded-full bg-violet-500/15 blur-[130px] animate-pulse duration-[12000ms]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs text-indigo-300 font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
            <span className="tracking-wide">Next-Gen Autonomous Procurement Platform</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-6 text-white">
            Autonomous Procurement & Inventory,{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-violet-400 bg-clip-text text-transparent">
              Engineered by AI
            </span>
          </h1>

          {/* Description */}
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
            Automate your procurement lifecycle. Synchronize global warehouses, predict multi-tier supply chain trends, optimize contract terms, and scale operations with a singular system of record.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              id="hero-btn-register"
              to="/register-company"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all duration-300 shadow-xl hover:shadow-indigo-500/25 flex items-center justify-center gap-2 group cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Register Company</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                const nextSection = document.getElementById("features");
                if (nextSection) {
                  window.scrollTo({
                    top: nextSection.offsetTop - 80,
                    behavior: "smooth"
                  });
                }
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 hover:border-indigo-500/40 bg-slate-900/40 hover:bg-slate-900/80 text-slate-300 hover:text-white font-medium text-base transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              <span>Explore Core Features</span>
            </a>
          </div>

          {/* Benefits strip */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-12 text-xs sm:text-sm text-slate-400/80 font-medium">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>SOC 2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-500" />
              <span>Real-time ERP Synchronization</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>99.99% Enterprise Uptime SLA</span>
            </div>
          </div>
        </div>

        {/* High-Fidelity Enterprise Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto rounded-2xl border border-slate-800/80 bg-[#040814]/90 shadow-2xl shadow-indigo-950/30 glow-subtle">
          {/* Top window controls */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-900 bg-slate-950/70 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-[10px] text-slate-500 font-mono ml-4 hidden sm:inline-block">https://app.inventix.io/dashboard</span>
              <span className="text-[10px] text-indigo-400/80 font-mono ml-4 flex items-center gap-1">
                <CircleDot className="w-3 h-3 text-indigo-500 animate-pulse" />
                Live: {currentTime}
              </span>
            </div>
            
            {/* Interactive Tab Selectors */}
            <div className="flex gap-1 p-1 bg-slate-900/60 rounded-lg">
              <button
                onClick={() => setActiveTab("inventory")}
                className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                  activeTab === "inventory" ? "bg-slate-800 text-white font-medium shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Warehouse Map
              </button>
              <button
                onClick={() => setActiveTab("forecasting")}
                className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                  activeTab === "forecasting" ? "bg-slate-800 text-white font-medium shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                AI Insights Engine
              </button>
              <button
                onClick={() => setActiveTab("procurement")}
                className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 ${
                  activeTab === "procurement" ? "bg-slate-800 text-white font-medium shadow" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Procurement Pipeline
              </button>
            </div>
          </div>

          {/* Global Operations Stats Bar (Realistic SaaS Overview) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 border-b border-slate-900/80 bg-[#050c1e]/45">
            <div className="px-3 py-1.5 border-r border-slate-900 flex items-center gap-3">
              <div className="p-2 rounded bg-indigo-500/10 text-indigo-400">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Global stock value</div>
                <div className="text-sm font-bold text-white">$18,420,910</div>
              </div>
            </div>
            <div className="px-3 py-1.5 border-r border-slate-900 flex items-center gap-3">
              <div className="p-2 rounded bg-violet-500/10 text-violet-400">
                <Warehouse className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Total active hubs</div>
                <div className="text-sm font-bold text-white">5 / 5 Connected</div>
              </div>
            </div>
            <div className="px-3 py-1.5 border-r border-slate-900 flex items-center gap-3">
              <div className="p-2 rounded bg-emerald-500/10 text-emerald-400">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Active POs in Queue</div>
                <div className="text-sm font-bold text-white">12 Processing</div>
              </div>
            </div>
            <div className="px-3 py-1.5 flex items-center gap-3">
              <div className="p-2 rounded bg-amber-500/10 text-amber-400">
                <Bell className="w-4 h-4 animate-bounce" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase">Low Stock Alerts</div>
                <div className="text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  {activeAlertsCount} Critical Alert{activeAlertsCount > 1 ? "s" : ""}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar + Main Work Area layout */}
          <div className="flex flex-col md:flex-row min-h-[480px]">
            
            {/* Left Nav Sidebar (Simulated UI) */}
            <div className="w-full md:w-[180px] shrink-0 border-r border-slate-900/80 p-3 bg-slate-950/40 hidden md:flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest pl-2">System navigation</span>
                <div className="flex items-center gap-2 px-3 py-2 rounded bg-slate-900/60 text-xs font-semibold text-white border-l-2 border-indigo-500 cursor-pointer">
                  <Activity className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dashboard</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-900/30 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                  <Package className="w-3.5 h-3.5 text-slate-500" />
                  <span>SKU Directory</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-900/30 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                  <Warehouse className="w-3.5 h-3.5 text-slate-500" />
                  <span>Warehouses</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-900/30 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>Suppliers</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-900/30 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                  <Receipt className="w-3.5 h-3.5 text-slate-500" />
                  <span>Purchase Orders</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded hover:bg-slate-900/30 text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
                  <BarChart2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reports</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-900/20 border border-slate-900">
                <div className="text-[9px] font-mono text-slate-500">SERVER STATUS</div>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 font-semibold mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ledger Encrypted
                </div>
              </div>
            </div>

            {/* Main Interactive Workspace Area */}
            <div className="flex-1 p-4 sm:p-6 bg-[#040916]">
              
              {/* Tab 1: Inventory & Warehouse Map */}
              {activeTab === "inventory" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Dynamic Alert Banner if stock is low */}
                  <div className="p-3.5 rounded-lg border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-amber-300 block">Low Stock Alert: Silicon-Wafers (Tier-1) in Singapore Hub</span>
                        <p className="text-[11px] text-slate-400">Current levels (4,200) dropped below safe threshold buffer (5,000).</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        AutoPO generated: #PO-12095
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Chicago Warehouse */}
                    <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 hover:border-slate-800 transition-all duration-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-slate-400">WH-CHICAGO-01</span>
                          <span className="px-2 py-0.5 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-full flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-400" /> Safe Capacity
                          </span>
                        </div>
                        <div className="text-2xl font-bold font-display tracking-tight text-white">84.2%</div>
                        <p className="text-[10px] text-slate-500 mt-1">Stored Volume: 126,300 / 150,000 SKUs</p>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1.5 rounded-full" style={{ width: "84.2%" }} />
                      </div>
                    </div>

                    {/* Rotterdam Warehouse */}
                    <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/50 hover:border-slate-800 transition-all duration-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-slate-400">WH-ROTTERDAM-03</span>
                          <span className="px-2 py-0.5 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 rounded-full flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-400" /> Optimal
                          </span>
                        </div>
                        <div className="text-2xl font-bold font-display tracking-tight text-white">68.5%</div>
                        <p className="text-[10px] text-slate-500 mt-1">Stored Volume: 205,500 / 300,000 SKUs</p>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-1.5 rounded-full" style={{ width: "68.5%" }} />
                      </div>
                    </div>

                    {/* Singapore Warehouse */}
                    <div className="p-4 rounded-xl border border-amber-500/20 bg-slate-950/50 hover:border-slate-800 transition-all duration-200 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono text-slate-400">WH-SINGAPORE-02</span>
                          <span className="px-2 py-0.5 text-[9px] font-semibold text-amber-400 bg-amber-500/10 rounded-full flex items-center gap-1 animate-pulse">
                            <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" /> Reorder Needed
                          </span>
                        </div>
                        <div className="text-2xl font-bold font-display tracking-tight text-white">42.1%</div>
                        <p className="text-[10px] text-slate-500 mt-1">Stored Volume: 84,200 / 200,000 SKUs</p>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 mt-4 overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-indigo-500 h-1.5 rounded-full" style={{ width: "42.1%" }} />
                      </div>
                    </div>
                  </div>

                  {/* Stock table list */}
                  <div className="border border-slate-900 bg-slate-950/30 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-[#050c1f] border-b border-slate-900 flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Live Global Material Replenishment Feed</span>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Auto-Pilot Synced
                      </span>
                    </div>
                    <div className="divide-y divide-slate-900 font-mono text-[11px] text-slate-300">
                      <div className="p-3 flex items-center justify-between hover:bg-slate-900/10 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span className="font-semibold text-slate-200">Copper Pipes (Grade-A)</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                          <span>Qty: 12,500</span>
                          <span>Chicago-01</span>
                          <span className="text-emerald-400">In Transit (Arrives in 1.4h)</span>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between hover:bg-slate-900/10 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500" />
                          <span className="font-semibold text-slate-200">Lithium-Ion Battery Cylinders</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                          <span>Qty: 8,200</span>
                          <span>Rotterdam-03</span>
                          <span className="text-emerald-400">Customs Approved</span>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between hover:bg-slate-900/10 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          <span className="font-semibold text-slate-200">Silicon-Wafers (Tier-1)</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-400">
                          <span>Qty: 4,200</span>
                          <span className="text-amber-400">Singapore-02</span>
                          <span className="text-indigo-400">PO #12095 Generated</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: AI Sourcing & Insights */}
              {activeTab === "forecasting" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* AI Recommendation Card */}
                  <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-950/15 flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5">
                        <h4 className="text-xs font-bold text-white">AI Procurement Suggestion: Spot Metal Surcharge Risk</h4>
                        <span className="px-2 py-0.5 rounded text-[8px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">Market Alert</span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Refining output indices for aluminum alloys show a projected 12% price surge across late Q3 due to regional smelting caps. We advise locking contract pricing for standard supply lines immediately.
                      </p>
                      <div className="flex gap-2 pt-2">
                        <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-[10px] font-semibold transition-all">
                          Lock Sourcing Rates
                        </button>
                        <button className="px-3 py-1.5 border border-slate-900 text-slate-400 hover:text-slate-200 rounded-md text-[10px] font-medium transition-all">
                          Ignore Recommendation
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Price Trends Widget */}
                    <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">Supplier Delivery Lead-Times</span>
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-white">-18.4% Days</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-semibold">Optimization Gain</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">
                          Our AI auto-routes orders through vendors with proven 5-day delivery windows during peak shipping weeks.
                        </p>
                      </div>

                      {/* Custom styled CSS graph bars */}
                      <div className="mt-4 flex items-end gap-2 h-14 pt-2">
                        <div className="w-full bg-slate-900 h-[60%] rounded hover:bg-indigo-500/30 transition-all" title="Average: 12 days" />
                        <div className="w-full bg-slate-900 h-[50%] rounded hover:bg-indigo-500/30 transition-all" title="Month 2: 10 days" />
                        <div className="w-full bg-slate-900 h-[40%] rounded hover:bg-indigo-500/30 transition-all" title="Month 3: 8 days" />
                        <div className="w-full bg-indigo-500/60 h-[25%] rounded hover:bg-indigo-50 transition-all" title="Optimized: 4.8 days" />
                      </div>
                    </div>

                    {/* Cost Optimization Report */}
                    <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-slate-500 uppercase">Multi-Bid Sourcing Yield</span>
                          <BarChart2 className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-indigo-400">-$142,500</span>
                          <span className="text-[10px] text-emerald-400 font-mono font-semibold">SLA Savings</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">
                          Direct dual-source bidding on our ledger triggers automated competitive quotes from pre-verified manufacturers.
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Contract Rate Locked:</span>
                        <span className="text-emerald-400 font-semibold font-mono">Steel alloy at $6.82/kg</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Purchase Orders & Approval Pipelines */}
              {activeTab === "procurement" && (
                <div className="space-y-6 animate-fadeIn">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-900 gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-indigo-400" />
                        Hierarchical Cost Approvals
                      </h3>
                      <p className="text-[10px] text-slate-500">Auto-routes to correct signers based on budget thresholds</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                      Pipeline Velocity: 1.8h Avg Approval Cycle
                    </span>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-slate-300">
                    
                    {/* Row 1: Heavy Turbine Gaskets */}
                    <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-indigo-400 font-bold">PR-#38291</span>
                          <span className="text-xs font-bold text-slate-200">Heavy Turbine Gaskets</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">Operator: J. Alvarez (Chicago-01) • Total Price: $124,500</div>
                      </div>
                      
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="flex -space-x-1">
                          <span className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/30 text-[8px] flex items-center justify-center font-bold text-indigo-400" title="Operations Lead Approved">OP</span>
                          <span className="w-5 h-5 rounded-full bg-violet-950 border border-violet-500/30 text-[8px] flex items-center justify-center font-bold text-violet-400" title="Logistics VP Approved">VP</span>
                          <span className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-[8px] flex items-center justify-center font-bold text-slate-400" title="CFO Pending">CF</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pending CFO Review
                        </span>
                      </div>
                    </div>

                    {/* Row 2: Semiconductor Chips */}
                    <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">PO-#12093</span>
                          <span className="text-xs font-bold text-slate-200">Semiconductor Chips</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">Supplier: Intel Sourcing • Contract Multi-Bid Optimization • Total: $450,000</div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> PO Dispatched (EDI)
                        </span>
                      </div>
                    </div>

                    {/* Row 3: Titanium Plates */}
                    <div className="p-3.5 rounded-xl border border-slate-900 bg-slate-950/40 hover:border-slate-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500">PO-#12091</span>
                          <span className="text-xs font-bold text-slate-200">Titanium Plates (Grade 5)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">Supplier: Nippon Metals Ltd • Automated replenish trigger • Total: $35,000</div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Completed & Received
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Scroll indicator at bottom of section */}
      <div 
        role="button"
        tabIndex={0}
        aria-label="Scroll to Features"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2"
        onClick={() => {
          const nextSection = document.getElementById("features");
          if (nextSection) {
            window.scrollTo({
              top: nextSection.offsetTop - 80,
              behavior: "smooth"
            });
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            const nextSection = document.getElementById("features");
            if (nextSection) {
              window.scrollTo({
                top: nextSection.offsetTop - 80,
                behavior: "smooth"
              });
            }
          }
        }}
      >
        <span className="text-[10px] font-mono tracking-widest uppercase opacity-75 group-hover:opacity-100 transition-opacity">Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border-2 border-slate-700 group-hover:border-indigo-500 p-1 flex justify-center transition-colors">
          <div className="w-1 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
