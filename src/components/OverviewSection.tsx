import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, AlertTriangle, Info, Plus, Users, Warehouse, 
  ShoppingBag, Truck, FileSpreadsheet, TrendingUp, Sliders, ChevronRight
} from "lucide-react";
import { 
  Activity, LiveStockItem, PurchaseRequest, 
  vendorPerformance, warehouseCapacity 
} from "../data/dashboardData";

interface OverviewProps {
  liveStock: LiveStockItem[];
  purchaseRequests: PurchaseRequest[];
  recentActivities: Activity[];
  activeAlerts: { id: number; message: string; type: string }[];
  onDismissAlert: (id: number) => void;
  onOpenModal: (modalName: string) => void;
  onTabChange: (tabName: string) => void;
}

export default function OverviewSection({
  liveStock,
  purchaseRequests,
  recentActivities,
  activeAlerts,
  onDismissAlert,
  onOpenModal,
  onTabChange
}: OverviewProps) {
  
  // High accuracy KPI calculations
  const totalValue = 1248500;
  const lowStockCount = liveStock.filter(i => i.status === "Low Stock" || i.status === "Critical").length;
  const pendingPRCount = purchaseRequests.filter(r => r.status === "Pending").length;

  // Chart interactivity states
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const valuationData = [
    { month: "Jan", val: "$800,000", cx: 50, cy: 140 },
    { month: "Feb", val: "$1,200,000", cx: 134, cy: 116 },
    { month: "Mar", val: "$950,000", cx: 218, cy: 131 },
    { month: "Apr", val: "$1,050,000", cx: 302, cy: 120 },
    { month: "May", val: "$1,300,000", cx: 386, cy: 101 },
    { month: "Jun", val: "$1,600,000", cx: 470, cy: 80 }
  ];

  const spendData = [
    { month: "Jan", spend: "$110,000", x: 75, y: 80, height: 90 },
    { month: "Feb", spend: "$145,000", x: 145, y: 55, height: 115 },
    { month: "Mar", spend: "$100,000", x: 215, y: 90, height: 80 },
    { month: "Apr", spend: "$165,000", x: 285, y: 40, height: 130 },
    { month: "May", spend: "$130,000", x: 355, y: 65, height: 105 },
    { month: "Jun", spend: "$150,000", x: 425, y: 50, height: 120 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="space-y-8"
    >
      
      {/* Welcome Section */}
      <div className="p-6 rounded-2xl border border-slate-900 bg-gradient-to-r from-[#030712] to-[#0a101f] flex flex-col md:flex-row md:items-center justify-between gap-6 card-hover-effect">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Welcome back, Alexander.
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            Manage your products, warehouses, vendors, purchase orders, and inventory from one centralized workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950/40 text-[11px] font-mono">
            <span className="text-slate-600 uppercase block font-bold text-[8px] tracking-wider mb-0.5">Primary Organization</span>
            <span className="text-slate-200 font-bold">Acme Sourcing Hub</span>
          </div>
          <div className="px-4 py-2.5 rounded-xl border border-slate-900 bg-slate-950/40 text-[11px] font-mono">
            <span className="text-slate-600 uppercase block font-bold text-[8px] tracking-wider mb-0.5">Workspace Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Synced & Active
            </span>
          </div>
        </div>
      </div>

      {/* Business Alerts Feed */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 text-xs transition-colors duration-150 ${
                alert.type === "warning" 
                  ? "bg-amber-500/5 border-amber-500/10 text-amber-300/90"
                  : "bg-indigo-500/5 border-indigo-500/10 text-indigo-300/90"
              }`}
            >
              <div className="flex items-center gap-3">
                {alert.type === "warning" ? (
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
                ) : (
                  <Info className="w-4.5 h-4.5 text-indigo-400 shrink-0" />
                )}
                <span className="font-medium">{alert.message}</span>
              </div>
              <button 
                onClick={() => onDismissAlert(alert.id)}
                className="text-[10px] font-mono text-slate-500 hover:text-slate-300 px-2 py-1 rounded border border-slate-900 hover:border-slate-800 bg-slate-950/40 transition-all cursor-pointer shrink-0"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* KPI Cards: Clean, large, highly professional whitespace */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
          Performance Indicators
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          
          {/* Card 1: Inventory Value */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Inventory Value</span>
            <div className="text-2xl font-bold text-white tracking-tight">${totalValue.toLocaleString()}</div>
            <div className="text-[9px] text-emerald-400 font-medium">99.9% Audit Accuracy</div>
          </div>

          {/* Card 2: Low Stock Items */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Low Stock Alert</span>
            <div className="text-2xl font-bold text-rose-400 tracking-tight">{lowStockCount} SKUs</div>
            <div className="text-[9px] text-slate-500 font-medium">Requires Immediate Ordering</div>
          </div>

          {/* Card 3: Purchase Requests */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Purchase Requests</span>
            <div className="text-2xl font-bold text-white tracking-tight">{pendingPRCount} Pending</div>
            <div className="text-[9px] text-amber-400 font-medium">Awaiting Manager Signoff</div>
          </div>

          {/* Card 4: Monthly Spend */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Procurement Cost</span>
            <div className="text-2xl font-bold text-white tracking-tight">$150,000</div>
            <div className="text-[9px] text-slate-500 font-medium">Approved Monthly Budget</div>
          </div>

          {/* Card 5: Warehouse Capacity */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Warehouse Capacity</span>
            <div className="text-2xl font-bold text-indigo-400 tracking-tight">82.4%</div>
            <div className="text-[9px] text-emerald-400 font-medium">Optimal Storage Buffer</div>
          </div>

        </div>
      </div>

      {/* Quick ERP Operations */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
          Quick Operations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          
          <button 
            onClick={() => onOpenModal("addProduct")}
            className="p-4 rounded-xl border border-slate-900 bg-[#040815] hover:bg-indigo-600/5 hover:border-indigo-500/30 text-left transition-all group flex flex-col justify-between h-24 cursor-pointer button-hover-scale"
          >
            <Plus className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Add Product</span>
          </button>

          <button 
            onClick={() => onOpenModal("addVendor")}
            className="p-4 rounded-xl border border-slate-900 bg-[#040815] hover:bg-indigo-600/5 hover:border-indigo-500/30 text-left transition-all group flex flex-col justify-between h-24 cursor-pointer button-hover-scale"
          >
            <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Add Vendor</span>
          </button>

          <button 
            onClick={() => onOpenModal("addWarehouse")}
            className="p-4 rounded-xl border border-slate-900 bg-[#040815] hover:bg-indigo-600/5 hover:border-indigo-500/30 text-left transition-all group flex flex-col justify-between h-24 cursor-pointer button-hover-scale"
          >
            <Warehouse className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Add Warehouse</span>
          </button>

          <button 
            onClick={() => onOpenModal("createRequest")}
            className="p-4 rounded-xl border border-slate-900 bg-[#040815] hover:bg-indigo-600/5 hover:border-indigo-500/30 text-left transition-all group flex flex-col justify-between h-24 cursor-pointer button-hover-scale"
          >
            <ShoppingBag className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Create Request</span>
          </button>

          <button 
            onClick={() => onOpenModal("receiveStock")}
            className="p-4 rounded-xl border border-slate-900 bg-[#040815] hover:bg-indigo-600/5 hover:border-indigo-500/30 text-left transition-all group flex flex-col justify-between h-24 cursor-pointer button-hover-scale"
          >
            <Truck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Receive Stock</span>
          </button>

          <button 
            onClick={() => onOpenModal("generateReport")}
            className="p-4 rounded-xl border border-slate-900 bg-[#040815] hover:bg-indigo-600/5 hover:border-indigo-500/30 text-left transition-all group flex flex-col justify-between h-24 cursor-pointer button-hover-scale"
          >
            <FileSpreadsheet className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Generate Report</span>
          </button>

        </div>
      </div>

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Chart 1: Inventory Value Trend */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-4 card-hover-effect">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-slate-400">Inventory Valuation Trend</h3>
              <p className="text-[10px] text-slate-500 mt-1">Total valuation in Jan 2026 - Jun 2026</p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-400 bg-indigo-500/5 border border-indigo-500/10 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>+24.8% Year-to-date</span>
            </div>
          </div>

          <div className="relative pt-2">
            <svg viewBox="0 0 500 200" className="w-full h-44">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="470" y2="20" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="50" y1="60" x2="470" y2="60" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="50" y1="100" x2="470" y2="100" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="50" y1="140" x2="470" y2="140" stroke="#111827" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="50" y1="170" x2="470" y2="170" stroke="#1e293b" strokeWidth="1" />
              
              {/* Area Fill */}
              <motion.path
                d="M 50,140 Q 134,116 218,131 T 386,101 T 470,80 L 470,170 L 50,170 Z"
                fill="url(#areaGrad)"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
              {/* Line Stroke */}
              <motion.path
                d="M 50,140 Q 134,116 218,131 T 386,101 T 470,80"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              
              {/* Point circles with interaction */}
              {valuationData.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.cx}
                    cy={pt.cy}
                    r="15"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  <motion.circle
                    cx={pt.cx}
                    cy={pt.cy}
                    initial={{ r: 3, strokeWidth: 2, fill: "#030712" }}
                    animate={{
                      r: hoveredPoint === idx ? 6 : 3,
                      strokeWidth: hoveredPoint === idx ? 3 : 2,
                      fill: hoveredPoint === idx ? "#6366f1" : "#030712"
                    }}
                    transition={{ duration: 0.15 }}
                    stroke="#6366f1"
                    className="pointer-events-none"
                  />
                </g>
              ))}

              {/* Grid labels */}
              <text x="50" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Jan</text>
              <text x="134" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Feb</text>
              <text x="218" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Mar</text>
              <text x="302" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Apr</text>
              <text x="386" y="190" fill="#64748b" fontSize="10" textAnchor="middle">May</text>
              <text x="470" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Jun</text>

              <text x="45" y="24" fill="#475569" fontSize="9" textAnchor="end">$1.5M</text>
              <text x="45" y="64" fill="#475569" fontSize="9" textAnchor="end">$1.2M</text>
              <text x="45" y="104" fill="#475569" fontSize="9" textAnchor="end">$1.0M</text>
              <text x="45" y="144" fill="#475569" fontSize="9" textAnchor="end">$0.8M</text>

              {/* Interactive Tooltip Group */}
              {hoveredPoint !== null && (
                <g className="pointer-events-none">
                  <line
                    x1={valuationData[hoveredPoint].cx}
                    y1="20"
                    x2={valuationData[hoveredPoint].cx}
                    y2="170"
                    stroke="#4f46e5"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                    opacity="0.6"
                  />
                  <rect
                    x={Math.max(10, Math.min(380, valuationData[hoveredPoint].cx - 55))}
                    y={Math.max(10, valuationData[hoveredPoint].cy - 45)}
                    width="110"
                    height="35"
                    rx="6"
                    fill="#090d1f"
                    stroke="#4f46e5"
                    strokeWidth="1"
                  />
                  <text
                    x={Math.max(65, Math.min(435, valuationData[hoveredPoint].cx))}
                    y={Math.max(10, valuationData[hoveredPoint].cy - 32)}
                    fill="#94a3b8"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {valuationData[hoveredPoint].month} Valuation
                  </text>
                  <text
                    x={Math.max(65, Math.min(435, valuationData[hoveredPoint].cx))}
                    y={Math.max(10, valuationData[hoveredPoint].cy - 18)}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {valuationData[hoveredPoint].val}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Chart 2: Monthly Spend */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-4 card-hover-effect">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-slate-400">Monthly Procurement Spend</h3>
              <p className="text-[10px] text-slate-500 mt-1">Acquisition budget spend over the last two quarters</p>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Average: $135k/mo</span>
          </div>

          <div className="relative pt-2">
            <svg viewBox="0 0 500 200" className="w-full h-44">
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c7d2fe" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="470" y2="20" stroke="#111827" strokeDasharray="3,3" />
              <line x1="50" y1="70" x2="470" y2="70" stroke="#111827" strokeDasharray="3,3" />
              <line x1="50" y1="120" x2="470" y2="120" stroke="#111827" strokeDasharray="3,3" />
              <line x1="50" y1="170" x2="470" y2="170" stroke="#1e293b" />

              {/* Interactive Bars */}
              {spendData.map((bar, idx) => (
                <motion.rect
                  key={idx}
                  x={bar.x}
                  y={bar.y}
                  width="22"
                  height={bar.height}
                  rx="3"
                  initial={{ height: 0, y: 170 }}
                  animate={{ 
                    height: bar.height, 
                    y: bar.y,
                    fill: hoveredBar === idx ? "url(#barGradActive)" : "url(#barGrad)",
                    stroke: hoveredBar === idx ? "#a5b4fc" : "none",
                    strokeWidth: hoveredBar === idx ? 1.5 : 0
                  }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}
                  onMouseEnter={() => setHoveredBar(idx)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="cursor-pointer"
                />
              ))}

              {/* Labels */}
              <text x="86" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Jan</text>
              <text x="156" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Feb</text>
              <text x="226" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Mar</text>
              <text x="296" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Apr</text>
              <text x="366" y="190" fill="#64748b" fontSize="10" textAnchor="middle">May</text>
              <text x="436" y="190" fill="#64748b" fontSize="10" textAnchor="middle">Jun</text>

              <text x="45" y="24" fill="#475569" fontSize="9" textAnchor="end">$200k</text>
              <text x="45" y="74" fill="#475569" fontSize="9" textAnchor="end">$150k</text>
              <text x="45" y="124" fill="#475569" fontSize="9" textAnchor="end">$100k</text>
              <text x="45" y="174" fill="#475569" fontSize="9" textAnchor="end">$0</text>

              {/* Interactive Tooltip Group */}
              {hoveredBar !== null && (
                <g className="pointer-events-none">
                  <rect
                    x={Math.max(10, Math.min(380, spendData[hoveredBar].x - 44))}
                    y={Math.max(10, spendData[hoveredBar].y - 45)}
                    width="110"
                    height="35"
                    rx="6"
                    fill="#090d1f"
                    stroke="#818cf8"
                    strokeWidth="1"
                  />
                  <text
                    x={Math.max(65, Math.min(435, spendData[hoveredBar].x + 11))}
                    y={Math.max(10, spendData[hoveredBar].y - 32)}
                    fill="#94a3b8"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {spendData[hoveredBar].month} Spend
                  </text>
                  <text
                    x={Math.max(65, Math.min(435, spendData[hoveredBar].x + 11))}
                    y={Math.max(10, spendData[hoveredBar].y - 18)}
                    fill="#ffffff"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {spendData[hoveredBar].spend}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

      </div>

      {/* Two-Column Area: AI Procurement Highlights + Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick AI Procurement Assistant */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] flex flex-col justify-between card-hover-effect">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-slate-400">AI Procurement Assistant</h3>
              </div>
              <button 
                onClick={() => onTabChange("AI Insights")}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Full Insights</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Real-time predictive purchasing and vendor optimization suggestions computed for Acme Industrial.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/10 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-300">Copper Tubing (Grade-X)</span>
                  <span className="text-[9px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded uppercase badge-glow">Urgent</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Copper Tubes will reach low stock in 5 days. Suggested reorder quantity: 250 units.
                </p>
                <p className="text-[10px] text-indigo-400/90 font-medium font-mono">
                  Vendor SteelWorks offers 8% lower pricing. Estimated monthly savings: ₹48,500.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200">Silicon-Wafers (Tier-1)</span>
                  <span className="text-[9px] font-mono text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded uppercase badge-glow">Warning</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Supplier lead time extended. Shift next PO trigger threshold by 4 days to guarantee continuous production.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-900/60 mt-4 text-[10px] text-slate-600 font-mono flex items-center justify-between">
            <span>Last recommendation batch processed: Just now</span>
            <span>Accuracy: 99.8%</span>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-4 card-hover-effect">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-slate-400">Activity Logs</h3>
            <span className="text-[10px] text-slate-500 font-mono">System Live</span>
          </div>

          <div className="space-y-3.5 max-h-[280px] overflow-y-auto">
            {recentActivities.slice(0, 5).map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs p-1 rounded-lg hover:bg-slate-950/40 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  act.type === "success" 
                    ? "bg-emerald-500" 
                    : act.type === "warning" 
                      ? "bg-amber-500" 
                      : "bg-indigo-500"
                }`} />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-200">{act.action}</span>
                    <span className="text-[9px] text-slate-500 font-mono whitespace-nowrap">{act.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-slate-500">{act.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.div>
  );
}
