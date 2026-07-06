import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Building2, AlertTriangle, Info, Plus, Users, Warehouse, 
  ShoppingBag, Truck, FileSpreadsheet, TrendingUp, Sliders, ChevronRight, CheckCircle, CreditCard, Box, UserPlus, FileText
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";
import { useAuth } from "../context/AuthContext";

interface OverviewProps {
  onDismissAlert: (id: number) => void;
  onOpenModal: (modalName: string) => void;
  onTabChange: (tabName: string) => void;
}

export default function OverviewSection({
  onDismissAlert,
  onOpenModal,
  onTabChange
}: OverviewProps) {
  
  const { user, profile, role, permissions } = useAuth();
  // Provide the current role to the metrics hook to avoid overfetching
  const { metrics, loading } = useDashboardMetrics(role || 'viewer');
  
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  if (loading || !metrics) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Live Dashboard Analytics...</div>;
  }

  const {
    totalInventoryValue,
    lowStockCount,
    overstockCount,
    inventoryAccuracy,
    pendingPRCount,
    activePOCount,
    activeVendorsCount,
    monthlyProcurementSpend,
    warehouseCapacity,
    warehouseUtilization,
    shipmentsToday,
    receivingToday,
    outstandingPaymentsTotal,
    paidThisMonth,
    overdueInvoices,
    activeEmployeesCount,
    totalWarehousesCount,
    spendData,
    recentActivities,
    activeAlerts
  } = metrics;

  const renderKPIs = () => {
    const kpiElements: React.JSX.Element[] = [];
    
    // Inventory KPIs
    if (permissions?.canAccessInventory) {
      kpiElements.push(
        <div key="inv-val" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Inventory Value</span>
          <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(totalInventoryValue)}</div>
          <div className="text-[9px] text-emerald-400 font-medium">Live Supabase Calculation</div>
        </div>
      );
      kpiElements.push(
        <div key="low-stock" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Low Stock Alert</span>
          <div className="text-2xl font-bold text-rose-400 tracking-tight">{lowStockCount} SKUs</div>
          <div className="text-[9px] text-slate-500 font-medium">Requires Immediate Ordering</div>
        </div>
      );
      if (role === 'inventory_manager' || role === 'admin') {
        kpiElements.push(
          <div key="overstock" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Overstock Items</span>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">{overstockCount} SKUs</div>
            <div className="text-[9px] text-slate-500 font-medium">Capital tied up in excess</div>
          </div>,
          <div key="inv-acc" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Inventory Accuracy</span>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">{inventoryAccuracy}</div>
            <div className="text-[9px] text-slate-500 font-medium">Last Audit: Today</div>
          </div>
        );
      }
    }

    // Procurement KPIs
    if (permissions?.canAccessPurchaseRequests) {
      kpiElements.push(
        <div key="prs" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Purchase Requests</span>
          <div className="text-2xl font-bold text-white tracking-tight">{pendingPRCount} Pending</div>
          <div className="text-[9px] text-amber-400 font-medium">Awaiting Signoff</div>
        </div>
      );
      kpiElements.push(
        <div key="pos" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Active Purchase Orders</span>
          <div className="text-2xl font-bold text-indigo-400 tracking-tight">{activePOCount} Open</div>
          <div className="text-[9px] text-emerald-400 font-medium">Currently processing</div>
        </div>
      );
      if (role === 'procurement_manager' || role === 'admin') {
        kpiElements.push(
          <div key="vendors" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Active Vendors</span>
            <div className="text-2xl font-bold text-white tracking-tight">{activeVendorsCount}</div>
            <div className="text-[9px] text-emerald-400 font-medium">Approved Suppliers</div>
          </div>,
          <div key="proc-spend" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Monthly Spend</span>
            <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(monthlyProcurementSpend)}</div>
            <div className="text-[9px] text-slate-500 font-medium">Current Month Procurement</div>
          </div>
        );
      }
    }

    // Finance KPIs
    if (permissions?.canAccessPayments) {
      kpiElements.push(
        <div key="outstanding-pay" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Outstanding Payments</span>
          <div className="text-2xl font-bold text-white tracking-tight">{formatCurrency(outstandingPaymentsTotal)}</div>
          <div className="text-[9px] text-slate-500 font-medium">Total Pending & Processing</div>
        </div>
      );
      if (role === 'finance_manager' || role === 'admin') {
        kpiElements.push(
          <div key="paid-mo" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Paid This Month</span>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">{formatCurrency(paidThisMonth)}</div>
            <div className="text-[9px] text-emerald-500/70 font-medium">Completed Outflow</div>
          </div>,
          <div key="overdue" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Overdue Invoices</span>
            <div className="text-2xl font-bold text-rose-400 tracking-tight">{overdueInvoices}</div>
            <div className="text-[9px] text-rose-500/70 font-medium">Action Required</div>
          </div>
        );
      }
    }

    // Warehouse KPIs
    if (role === 'warehouse_manager' || role === 'admin') {
      kpiElements.push(
        <div key="wh-cap" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Total Capacity</span>
          <div className="text-2xl font-bold text-white tracking-tight">{warehouseCapacity.toLocaleString()} sqft</div>
        </div>,
        <div key="wh-util" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Utilization</span>
          <div className="text-2xl font-bold text-indigo-400 tracking-tight">{warehouseUtilization}</div>
        </div>,
        <div key="wh-ship" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Shipments Today</span>
          <div className="text-2xl font-bold text-emerald-400 tracking-tight">{shipmentsToday}</div>
        </div>,
        <div key="wh-rec" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Receiving Today</span>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">{receivingToday}</div>
        </div>
      );
    }

    // Admin Specific KPIs
    if (role === 'admin') {
      kpiElements.push(
        <div key="admin-emp" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Active Employees</span>
          <div className="text-2xl font-bold text-white tracking-tight">{activeEmployeesCount}</div>
        </div>,
        <div key="admin-wh" className="p-6 rounded-2xl border border-slate-900 bg-[#040815] space-y-2 card-hover-effect">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Total Warehouses</span>
          <div className="text-2xl font-bold text-white tracking-tight">{totalWarehousesCount}</div>
        </div>
      );
    }

    return kpiElements;
  };

  const renderQuickOperations = () => {
    if (role === 'viewer') return null; // Viewers see NO quick operations

    const ops: React.JSX.Element[] = [];
    const btnClass = "p-4 rounded-xl border border-slate-900 bg-[#040815] hover:bg-indigo-600/5 hover:border-indigo-500/30 text-left transition-all group flex flex-col justify-between h-24 cursor-pointer button-hover-scale";

    if (permissions?.canManageInventory) {
      ops.push(
        <button key="add-product" onClick={() => { onTabChange("Products"); setTimeout(() => onOpenModal("addProduct"), 0); }} className={btnClass}>
          <Plus className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Add Product</span>
        </button>
      );
      if (role === 'inventory_manager' || role === 'admin') {
        ops.push(
          <button key="adj-inv" onClick={() => { onTabChange("Inventory"); setTimeout(() => onOpenModal("adjustInventory"), 0); }} className={btnClass}>
            <Sliders className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-200">Adjust Inventory</span>
          </button>
        );
      }
    }

    if (permissions?.canManageVendors) {
      ops.push(
        <button key="add-vendor" onClick={() => { onTabChange("Vendors"); setTimeout(() => onOpenModal("addVendor"), 0); }} className={btnClass}>
          <Users className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Register Vendor</span>
        </button>
      );
    }

    if (role === 'warehouse_manager' || role === 'admin') {
      ops.push(
        <button key="add-wh" onClick={() => { onTabChange("Warehouses"); setTimeout(() => onOpenModal("addWarehouse"), 0); }} className={btnClass}>
          <Warehouse className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Add Warehouse</span>
        </button>,
        <button key="opt-layout" onClick={() => { onTabChange("Warehouses"); setTimeout(() => onOpenModal("optimizeLayout"), 0); }} className={btnClass}>
          <Box className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Optimize Layout</span>
        </button>
      );
    }

    if (permissions?.canManagePurchaseRequests) {
      ops.push(
        <button key="add-pr" onClick={() => { onTabChange("Purchase Requests"); setTimeout(() => onOpenModal("createRequest"), 0); }} className={btnClass}>
          <ShoppingBag className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Create Request</span>
        </button>
      );
    }

    if (permissions?.canManagePurchaseOrders) {
      ops.push(
        <button key="add-po" onClick={() => { onTabChange("Purchase Orders"); setTimeout(() => onOpenModal("createPO"), 0); }} className={btnClass}>
          <FileText className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Create PO</span>
        </button>
      );
    }

    if (role === 'warehouse_manager' || role === 'inventory_manager' || role === 'admin') {
      ops.push(
        <button key="rec-stock" onClick={() => { onTabChange("Inventory"); setTimeout(() => onOpenModal("receiveStock"), 0); }} className={btnClass}>
          <Truck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Receive Stock</span>
        </button>
      );
    }

    if (permissions?.canManagePayments) {
      ops.push(
        <button key="record-pay" onClick={() => { onTabChange("Payments"); setTimeout(() => onOpenModal("recordPayment"), 0); }} className={btnClass}>
          <CreditCard className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Record Payment</span>
        </button>
      );
    }

    if (role === 'finance_manager' || role === 'admin') {
      ops.push(
        <button key="fin-report" onClick={() => onTabChange("Reports")} className={btnClass}>
          <FileSpreadsheet className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Generate Report</span>
        </button>
      );
    }

    if (role === 'admin') {
      ops.push(
        <button key="prov-user" onClick={() => { onTabChange("User Management"); }} className={btnClass}>
          <UserPlus className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold text-slate-200">Provision User</span>
        </button>
      );
    }

    if (ops.length === 0) return null;

    return (
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
          Quick Operations
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {ops}
        </div>
      </div>
    );
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayRole = role?.replace('_', ' ') || 'Viewer';

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
            Welcome back, <span className="capitalize">{displayName}</span>.
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed capitalize">
            {displayRole} Dashboard
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

      {/* KPI Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
          Performance Indicators
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {renderKPIs()}
        </div>
      </div>

      {/* Quick ERP Operations */}
      {renderQuickOperations()}

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Chart 1: Inventory Value Trend (Visible to Admin, Inventory, Viewer) */}
        {(role === 'admin' || role === 'inventory_manager' || role === 'viewer') && (
          <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-4 card-hover-effect">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-slate-400">Inventory Valuation Trend</h3>
                <p className="text-[10px] text-slate-500 mt-1">Historical snapshots unavailable</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                <span>Live Snapshot</span>
              </div>
            </div>

            <div className="relative pt-2 flex flex-col items-center justify-center h-44 border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
               <div className="text-center space-y-2">
                 <div className="text-3xl font-bold text-indigo-400">{formatCurrency(totalInventoryValue)}</div>
                 <div className="text-[10px] text-slate-500">Current Live Valuation</div>
               </div>
            </div>
          </div>
        )}

        {/* Chart 2: Monthly Spend (Visible to Admin, Procurement, Finance, Viewer) */}
        {(role === 'admin' || role === 'procurement_manager' || role === 'finance_manager' || role === 'viewer') && (
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
                {spendData.map((bar, idx) => (
                  <text key={`label-${idx}`} x={(bar.x || 0) + 11} y="190" fill="#64748b" fontSize="10" textAnchor="middle">{bar.month}</text>
                ))}

                <text x="45" y="24" fill="#475569" fontSize="9" textAnchor="end">$200k</text>
                <text x="45" y="74" fill="#475569" fontSize="9" textAnchor="end">$150k</text>
                <text x="45" y="124" fill="#475569" fontSize="9" textAnchor="end">$100k</text>
                <text x="45" y="174" fill="#475569" fontSize="9" textAnchor="end">$0</text>

                {/* Interactive Tooltip Group */}
                {hoveredBar !== null && (
                  <g className="pointer-events-none">
                    <rect
                      x={Math.max(10, Math.min(380, (spendData[hoveredBar].x || 0) - 44))}
                      y={Math.max(10, (spendData[hoveredBar].y || 0) - 45)}
                      width="110"
                      height="35"
                      rx="6"
                      fill="#090d1f"
                      stroke="#818cf8"
                      strokeWidth="1"
                    />
                    <text
                      x={Math.max(65, Math.min(435, (spendData[hoveredBar].x || 0) + 11))}
                      y={Math.max(10, (spendData[hoveredBar].y || 0) - 32)}
                      fill="#94a3b8"
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {spendData[hoveredBar].month} Spend
                    </text>
                    <text
                      x={Math.max(65, Math.min(435, (spendData[hoveredBar].x || 0) + 11))}
                      y={Math.max(10, (spendData[hoveredBar].y || 0) - 18)}
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
        )}

      </div>

      {/* Two-Column Area: AI Procurement Highlights + Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Quick AI Procurement Assistant (Hidden for Finance Manager & Warehouse Manager) */}
        {(role === 'admin' || role === 'procurement_manager' || role === 'inventory_manager' || role === 'viewer') && (
          <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] flex flex-col justify-between card-hover-effect">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-slate-400">AI {role === 'inventory_manager' ? 'Inventory' : 'Procurement'} Assistant</h3>
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
                Real-time predictive purchasing and optimization suggestions computed for Acme Industrial.
              </p>

              {/* Dynamic Alerts inside widget based on role */}
              <div className="space-y-3">
                {activeAlerts.slice(0,2).map(alert => (
                  <div key={alert.id} className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-200">System Notification</span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase badge-glow ${alert.type === 'warning' ? 'text-amber-500 bg-amber-500/10' : 'text-indigo-400 bg-indigo-500/10'}`}>
                        {alert.type === 'warning' ? 'Warning' : 'Info'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {alert.message}
                    </p>
                  </div>
                ))}
                {activeAlerts.length === 0 && (
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-900/60 text-center text-slate-500 text-xs">
                    No active suggestions for your domain.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900/60 mt-4 text-[10px] text-slate-600 font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Last recommendation batch processed: Just now</span>
              <span>Accuracy: 99.8%</span>
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className={`p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-4 card-hover-effect ${
          role === 'finance_manager' || role === 'warehouse_manager' ? 'lg:col-span-2' : ''
        }`}>
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
