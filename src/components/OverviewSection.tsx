import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Building2, AlertTriangle, Info, Plus, Users, Warehouse,
  ShoppingBag, Truck, FileSpreadsheet, TrendingUp, Sliders, ChevronRight, CheckCircle, CreditCard, Box, UserPlus, FileText, Sparkles, Activity, Zap
} from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import { useDashboardMetrics } from "../hooks/useDashboardMetrics";
import { useAuth } from "../context/AuthContext";

interface OverviewProps {
  onOpenModal: (modalName: string) => void;
  onTabChange: (tabName: string) => void;
}

export default function OverviewSection({
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

  const kpiClass = "p-5 rounded-[20px] border border-white/60 bg-white/80 backdrop-blur-xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.04),0_20px_50px_-15px_rgba(99,102,241,0.05)] hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.06),0_30px_70px_-15px_rgba(99,102,241,0.08)] space-y-3 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-default";

  // Dynamic Chart Calculations
  const spendValues = spendData.map(d => d.spendValue || 0);
  const maxSpend = spendValues.length > 0 ? Math.max(...spendValues) * 1.2 : 1000;
  const avgSpend = spendValues.length > 0 ? spendValues.reduce((a, b) => a + b, 0) / spendValues.length : 0;

  const renderEnterpriseHealth = () => {
    return (
      <div className="p-6 md:p-8 rounded-[32px] border border-white/80 bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_30px_80px_-20px_rgba(99,102,241,0.06),inset_0_1px_1px_rgba(255,255,255,1)] relative overflow-hidden flex flex-col gap-6 group">
        
        {/* Subtle Background Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-bl-full -z-10 group-hover:from-indigo-500/20 transition-all duration-1000 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/10 rounded-full blur-[60px] pointer-events-none" />

        {/* Top Section: Identity & Welcome */}
        <div className="flex items-start gap-5 relative z-10">
          
          {/* Large Company Logo/Avatar */}
          <div className="hidden sm:flex shrink-0 w-16 h-16 rounded-[16px] bg-gradient-to-tr from-indigo-50 to-white border border-white shadow-[0_8px_16px_-6px_rgba(99,102,241,0.2),inset_0_4px_6px_rgba(255,255,255,0.6)] items-center justify-center relative overflow-hidden group-hover:shadow-[0_12px_24px_-8px_rgba(99,102,241,0.3)] transition-all duration-500">
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Building2 className="w-8 h-8 text-indigo-600 drop-shadow-sm group-hover:scale-105 transition-transform duration-500" />
          </div>

          <div className="space-y-3 flex-1">
            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-1.5 rounded-full bg-white/80 border border-indigo-100 shadow-sm flex items-center gap-2 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                <span className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-widest">{profile?.organization || ''}</span>
              </div>
              <div className="px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-100/50 shadow-sm flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-widest">Live Sync</span>
              </div>
            </div>
            
            {/* Welcome Text */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.1]">
                Welcome back, <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{profile?.full_name?.split(' ')[0] || ''}</span>. <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
              </h1>
              <p className="text-[14px] text-slate-500 font-medium pt-1">
                Executive Command Center overview for {profile?.organization || ''}.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Glass Metric Capsules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 relative z-10 w-full">
          
          {/* Capsule 1: Portfolio Value */}
          <div className="p-4 rounded-[20px] bg-white/60 border border-white/60 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-xl group-hover:bg-white/80 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-xl bg-indigo-50 text-indigo-600">
                <Activity className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Portfolio</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(totalInventoryValue)}</div>
          </div>

          {/* Capsule 2: Spend */}
          <div className="p-4 rounded-[20px] bg-white/60 border border-white/60 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-xl group-hover:bg-white/80 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Spend</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{formatCurrency(monthlyProcurementSpend)}</div>
          </div>

          {/* Capsule 3: Operations */}
          <div className="p-4 rounded-[20px] bg-white/60 border border-white/60 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-xl group-hover:bg-white/80 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-xl bg-violet-50 text-violet-600">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Operations</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {activePOCount + pendingPRCount} <span className="text-sm font-bold text-slate-400">Active</span>
            </div>
          </div>

          {/* Capsule 4: Warehouses */}
          <div className="p-4 rounded-[20px] bg-white/60 border border-white/60 shadow-[0_8px_30px_-5px_rgba(0,0,0,0.03),inset_0_1px_2px_rgba(255,255,255,1)] backdrop-blur-xl group-hover:bg-white/80 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600">
                <Warehouse className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">Warehouses</span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {warehouseUtilization.length} <span className="text-sm font-bold text-slate-400">Online</span>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderGroupedKPIs = () => {
    return (
      <div className="space-y-12">

        {/* Operations & Logistics */}
        {(permissions?.canAccessPurchaseRequests || role === 'warehouse_manager' || role === 'admin') && (
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">Operations & Logistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {permissions?.canAccessPurchaseRequests && (
                <div key="prs" className={kpiClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600"><FileText className="w-4 h-4" /></div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Purchase Requests</span>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{pendingPRCount} <span className="text-lg text-slate-400">Pending</span></div>
                    <div className="text-[10px] text-amber-600 font-bold mt-1 bg-amber-50 inline-block px-2 py-0.5 rounded-full">Awaiting Approval</div>
                  </div>
                </div>
              )}
              {permissions?.canAccessPurchaseRequests && (
                <div key="pos" className={kpiClass}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><ShoppingBag className="w-4 h-4" /></div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Active POs</span>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{activePOCount} <span className="text-lg text-slate-400">Open</span></div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-1 bg-emerald-50 inline-block px-2 py-0.5 rounded-full">Currently processing</div>
                  </div>
                </div>
              )}
              {(role === 'warehouse_manager' || role === 'admin') && (
                <div key="wh-ship" className={kpiClass}>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Shipments Today</span>
                  <div className="text-2xl font-bold text-emerald-600 tracking-tight">{shipmentsToday}</div>
                </div>
              )}
              {(role === 'warehouse_manager' || role === 'admin') && (
                <div key="wh-rec" className={kpiClass}>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Receiving Today</span>
                  <div className="text-2xl font-bold text-amber-600 tracking-tight">{receivingToday}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inventory & Warehousing */}
        {permissions?.canAccessInventory && (
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">Inventory & Warehousing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div key="low-stock" className={kpiClass}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-bl-full -z-10 group-hover:bg-rose-500/10 transition-colors" />
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600"><AlertTriangle className="w-4 h-4" /></div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Low Stock Alert</span>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{lowStockCount} <span className="text-lg text-slate-400">SKUs</span></div>
                  <div className="text-[10px] text-rose-600 font-bold mt-1 bg-rose-50 inline-block px-2 py-0.5 rounded-full">Action Required</div>
                </div>
              </div>
              {(role === 'inventory_manager' || role === 'admin') && (
                <div key="overstock" className={kpiClass}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -z-10 group-hover:bg-amber-500/10 transition-colors" />
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600"><Box className="w-4 h-4" /></div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Overstock Items</span>
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{overstockCount} <span className="text-lg text-slate-400">SKUs</span></div>
                    <div className="text-[10px] text-slate-500 font-medium mt-1">Capital tied up in excess</div>
                  </div>
                </div>
              )}
              {(role === 'warehouse_manager' || role === 'admin') && (
                <div key="wh-cap" className={kpiClass}>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Total Capacity</span>
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">{warehouseCapacity.toLocaleString()} sqft</div>
                </div>
              )}
              {(role === 'warehouse_manager' || role === 'admin') && (
                <div key="wh-util" className={kpiClass}>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Utilization</span>
                  <div className="text-2xl font-bold text-indigo-600 tracking-tight">{warehouseUtilization}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Finance */}
        {permissions?.canAccessPayments && (
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">Finance</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div key="outstanding-pay" className={kpiClass}>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Outstanding Payments</span>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{formatCurrency(outstandingPaymentsTotal)}</div>
                <div className="text-[9px] text-slate-500 font-bold bg-slate-100 inline-block px-2 py-0.5 rounded-full mt-1">Total Pending & Processing</div>
              </div>
              {(role === 'finance_manager' || role === 'admin') && (
                <div key="paid-mo" className={kpiClass}>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Paid This Month</span>
                  <div className="text-2xl font-bold text-emerald-600 tracking-tight">{formatCurrency(paidThisMonth)}</div>
                  <div className="text-[9px] text-emerald-600 font-bold bg-emerald-50 inline-block px-2 py-0.5 rounded-full mt-1">Completed Outflow</div>
                </div>
              )}
              {(role === 'finance_manager' || role === 'admin') && (
                <div key="overdue" className={kpiClass}>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Overdue Invoices</span>
                  <div className="text-2xl font-bold text-rose-600 tracking-tight">{overdueInvoices}</div>
                  <div className="text-[9px] text-rose-600 font-bold bg-rose-50 inline-block px-2 py-0.5 rounded-full mt-1">Action Required</div>
                </div>
              )}
              {(role === 'admin' || role === 'procurement_manager') && (
                <div key="vendors" className={kpiClass}>
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">Active Vendors</span>
                  <div className="text-2xl font-bold text-slate-900 tracking-tight">{activeVendorsCount}</div>
                  <div className="text-[9px] text-emerald-600 font-bold bg-emerald-50 inline-block px-2 py-0.5 rounded-full mt-1">Approved Suppliers</div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    );
  };

  const renderQuickOperations = () => {
    if (role === 'viewer') return null; // Viewers see NO quick operations

    const ops: React.JSX.Element[] = [];
    const btnClass = "p-5 rounded-[20px] border border-white/60 bg-white/40 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.04)] hover:bg-white/80 hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.04),0_30px_60px_-10px_rgba(99,102,241,0.06)] hover:-translate-y-1 text-left transition-all duration-300 group flex flex-col justify-between h-[104px] cursor-pointer";

    if (permissions?.canManageInventory) {
      ops.push(
        <button key="add-product" onClick={() => { onTabChange("Products"); setTimeout(() => onOpenModal("addProduct"), 0); }} className={btnClass}>
          <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold text-slate-700">Add Product</span>
        </button>
      );
      if (role === 'inventory_manager' || role === 'admin') {
        ops.push(
          <button key="adj-inv" onClick={() => { onTabChange("Inventory"); setTimeout(() => onOpenModal("adjustInventory"), 0); }} className={btnClass}>
            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Sliders className="w-4 h-4" />
            </div>
            <span className="text-[12px] font-bold text-slate-700">Adjust Inventory</span>
          </button>
        );
      }
    }

    if (permissions?.canManageVendors) {
      ops.push(
        <button key="add-vendor" onClick={() => { onTabChange("Vendors"); setTimeout(() => onOpenModal("addVendor"), 0); }} className={btnClass}>
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold text-slate-700">Register Vendor</span>
        </button>
      );
    }

    if (role === 'warehouse_manager' || role === 'admin') {
      ops.push(
        <button key="add-wh" onClick={() => { onTabChange("Warehouses"); setTimeout(() => onOpenModal("addWarehouse"), 0); }} className={btnClass}>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <Warehouse className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold text-slate-700">Add Warehouse</span>
        </button>
      );
    }

    if (permissions?.canManagePurchaseRequests) {
      ops.push(
        <button key="add-pr" onClick={() => { onTabChange("Purchase Requests"); setTimeout(() => onOpenModal("createRequest"), 0); }} className={btnClass}>
          <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold text-slate-700">Create Request</span>
        </button>
      );
    }

    if (permissions?.canManagePurchaseOrders) {
      ops.push(
        <button key="add-po" onClick={() => { onTabChange("Purchase Orders"); setTimeout(() => onOpenModal("createPO"), 0); }} className={btnClass}>
          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold text-slate-700">Create PO</span>
        </button>
      );
    }

    if (role === 'warehouse_manager' || role === 'inventory_manager' || role === 'admin') {
      ops.push(
        <button key="rec-stock" onClick={() => { onTabChange("Inventory"); setTimeout(() => onOpenModal("receiveStock"), 0); }} className={btnClass}>
          <div className="w-8 h-8 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
            <Truck className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold text-slate-700">Receive Stock</span>
        </button>
      );
    }

    if (permissions?.canManagePayments) {
      ops.push(
        <button key="record-pay" onClick={() => { onTabChange("Payments"); setTimeout(() => onOpenModal("recordPayment"), 0); }} className={btnClass}>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold text-slate-700">Record Payment</span>
        </button>
      );
    }

    if (role === 'finance_manager' || role === 'admin') {
      ops.push(
        <button key="fin-report" onClick={() => onTabChange("Reports")} className={btnClass}>
          <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold text-slate-700">Generate Report</span>
        </button>
      );
    }

    if (role === 'admin') {
      ops.push(
        <button key="prov-user" onClick={() => { onTabChange("User Management"); }} className={btnClass}>
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
            <UserPlus className="w-4 h-4" />
          </div>
          <span className="text-[12px] font-bold text-slate-700">Provision User</span>
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
      className="space-y-6"
    >

      {/* Enterprise Health Summary */}
      {renderEnterpriseHealth()}

      {/* Live Business Alerts Feed */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          {activeAlerts.slice(0, 5).map((alert) => {
            let colors = "bg-slate-50 border-slate-200 text-slate-800";
            let icon = <Info className="w-5 h-5 text-slate-500 shrink-0" />;
            
            if (alert.type === "critical") {
              colors = "bg-rose-50/80 border-rose-200 shadow-[0_4px_20px_-5px_rgba(225,29,72,0.1)] text-rose-900";
              icon = <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />;
            } else if (alert.type === "warning") {
              colors = "bg-amber-50/80 border-amber-200 shadow-[0_4px_20px_-5px_rgba(217,119,6,0.1)] text-amber-900";
              icon = <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />;
            } else if (alert.type === "info") {
              colors = "bg-indigo-50/80 border-indigo-200 shadow-[0_4px_20px_-5px_rgba(79,70,229,0.1)] text-indigo-900";
              icon = <Info className="w-5 h-5 text-indigo-600 shrink-0" />;
            } else if (alert.type === "success") {
              colors = "bg-emerald-50/80 border-emerald-200 shadow-[0_4px_20px_-5px_rgba(16,185,129,0.1)] text-emerald-900";
              icon = <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />;
            }

            return (
              <div 
                key={alert.id}
                className={`p-4 rounded-[16px] border flex items-center justify-between gap-4 text-sm font-semibold transition-all duration-300 backdrop-blur-md ${colors}`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-1.5 rounded-xl bg-white/60 shadow-sm border border-white/50">
                    {icon}
                  </div>
                  <span>{alert.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* KPI Groups */}
      {renderGroupedKPIs()}

      {/* Quick ERP Operations */}
      {renderQuickOperations()}

      {/* SVG Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Chart 1: Inventory Value Trend */}
        {(role === 'admin' || role === 'inventory_manager' || role === 'viewer') && (
          <div className="p-7 rounded-[32px] border border-white bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_30px_80px_-20px_rgba(99,102,241,0.08),inset_0_1px_1px_rgba(255,255,255,1)] space-y-4 relative overflow-hidden group cursor-default">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/30 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-[14px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                  Inventory Value Trend
                </h3>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/60 border border-white shadow-sm text-slate-600 text-[11px] font-bold cursor-pointer hover:bg-white transition-colors">
                <span>This Month</span>
                <ChevronRight className="w-3 h-3 rotate-90" />
              </div>
            </div>

            <div className="relative pt-6 h-[260px] flex items-end">
              {/* Premium Gradient Area Chart Simulation */}
              <div className="absolute inset-0 pt-10 px-2 pointer-events-none">
                <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
                      <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                    </linearGradient>
                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="50%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  <path d="M0,150 L0,80 Q50,90 100,50 T200,40 T300,70 T400,30 T500,20 L500,150 Z" fill="url(#trendGradient)" />
                  <path d="M0,80 Q50,90 100,50 T200,40 T300,70 T400,30 T500,20" fill="none" stroke="url(#lineGrad)" strokeWidth="4" filter="url(#glow)" strokeLinecap="round" strokeLinejoin="round" />

                  {/* Data Points */}
                  <circle cx="100" cy="50" r="5" fill="white" stroke="#6366f1" strokeWidth="2.5" />
                  <circle cx="200" cy="40" r="5" fill="white" stroke="#6366f1" strokeWidth="2.5" />
                  <circle cx="300" cy="70" r="5" fill="white" stroke="#6366f1" strokeWidth="2.5" />
                  <circle cx="400" cy="30" r="5" fill="white" stroke="#6366f1" strokeWidth="2.5" />
                  <circle cx="500" cy="20" r="7" fill="#4f46e5" stroke="white" strokeWidth="3" filter="url(#glow)" />
                </svg>
              </div>

              {/* Value Overlay */}
              <div className="absolute top-2 left-2 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">{formatCurrency(totalInventoryValue)}</span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-sm">
                  <TrendingUp className="w-3 h-3" />
                  +12.5%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Chart 2: Monthly Spend */}
        {(role === 'admin' || role === 'procurement_manager' || role === 'finance_manager' || role === 'viewer') && (
          <div className="p-7 rounded-[32px] border border-white bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_30px_80px_-20px_rgba(99,102,241,0.08),inset_0_1px_1px_rgba(255,255,255,1)] space-y-4 relative overflow-hidden group cursor-default">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200/30 via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <h3 className="text-[14px] font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  Monthly Procurement Spend
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-700 bg-white/60 border border-white shadow-sm px-3 py-1.5 rounded-lg backdrop-blur-md">Avg: {formatCurrency(avgSpend)}/mo</span>
            </div>

            <div className="relative pt-4 h-[260px]">
              <svg viewBox="0 0 500 200" className="w-full h-full">
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a5b4fc" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                  <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="50" y1="20" x2="470" y2="20" stroke="#e2e8f0" strokeDasharray="4,4" />
                <line x1="50" y1="70" x2="470" y2="70" stroke="#e2e8f0" strokeDasharray="4,4" />
                <line x1="50" y1="120" x2="470" y2="120" stroke="#e2e8f0" strokeDasharray="4,4" />
                <line x1="50" y1="170" x2="470" y2="170" stroke="#cbd5e1" strokeWidth="2" />

                {/* Interactive Bars */}
                {spendData.map((bar, idx) => {
                  const val = bar.spendValue || 0;
                  const h = maxSpend > 0 ? (val / maxSpend) * 150 : 10;
                  const barY = 170 - h;
                  return (
                    <motion.rect
                      key={idx}
                      x={bar.x}
                      y={barY}
                      width="26"
                      height={h}
                      rx="4"
                      initial={{ height: 0, y: 170 }}
                      animate={{
                        height: h,
                        y: barY,
                        fill: hoveredBar === idx ? "url(#barGradActive)" : "url(#barGrad)",
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: idx * 0.04 }}
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="cursor-pointer transition-shadow hover:drop-shadow-md"
                    />
                  );
                })}

                {/* Labels */}
                {spendData.map((bar, idx) => (
                  <text key={`label-${idx}`} x={(bar.x || 0) + 13} y="190" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">{bar.month}</text>
                ))}

                <text x="40" y="24" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="end">{formatCurrency(maxSpend)}</text>
                <text x="40" y="74" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="end">{formatCurrency(maxSpend * 0.66)}</text>
                <text x="40" y="124" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="end">{formatCurrency(maxSpend * 0.33)}</text>
                <text x="40" y="174" fill="#94a3b8" fontSize="10" fontWeight="600" textAnchor="end">$0</text>

                {/* Interactive Tooltip Group */}
                {hoveredBar !== null && (() => {
                  const val = spendData[hoveredBar].spendValue || 0;
                  const h = maxSpend > 0 ? (val / maxSpend) * 150 : 10;
                  const hoveredY = 170 - h;
                  return (
                    <g className="pointer-events-none drop-shadow-xl">
                      <rect
                        x={Math.max(10, Math.min(380, (spendData[hoveredBar].x || 0) - 44))}
                        y={Math.max(10, hoveredY - 45)}
                        width="110"
                        height="42"
                        rx="8"
                        fill="#ffffff"
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        className="drop-shadow-xl"
                      />
                      <text
                        x={Math.max(65, Math.min(435, (spendData[hoveredBar].x || 0) + 13))}
                        y={Math.max(10, hoveredY - 26)}
                        fill="#64748b"
                        fontSize="9"
                        fontWeight="800"
                        textAnchor="middle"
                        letterSpacing="0.05em"
                        textTransform="uppercase"
                      >
                        {spendData[hoveredBar].month} Spend
                      </text>
                      <text
                        x={Math.max(65, Math.min(435, (spendData[hoveredBar].x || 0) + 13))}
                        y={Math.max(10, hoveredY - 10)}
                        fill="#0f172a"
                        fontSize="14"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {spendData[hoveredBar].spend}
                      </text>
                    </g>
                  );
                })()}
              </svg>
            </div>
          </div>
        )}

      </div>

      {/* Two-Column Area: AI Procurement Highlights + Recent Activity Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* AI Recommendations */}
        {(role === 'admin' || role === 'procurement_manager' || role === 'inventory_manager' || role === 'viewer') && (
          <div className="p-7 rounded-[28px] border border-white/60 bg-gradient-to-b from-violet-50/50 to-white/45 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02),0_20px_40px_-10px_rgba(99,102,241,0.03)] flex flex-col justify-between hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.04),0_30px_60px_-10px_rgba(99,102,241,0.06)] transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/5 rounded-bl-full pointer-events-none" />
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-extrabold text-slate-900 tracking-tight">AI Recommendations</h3>
                <button
                  onClick={() => onTabChange("AI Insights")}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {activeAlerts.length > 0 ? (
                  activeAlerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="flex items-start gap-4 p-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-default">
                      <div className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-105 ${alert.type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'
                        }`}>
                        {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{alert.type === 'warning' ? 'Action Required' : 'Optimization'}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${alert.type === 'warning' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                            }`}>
                            {alert.type === 'warning' ? 'High' : 'Low'} priority
                          </span>
                        </div>
                        <p className="text-[12px] font-bold text-slate-800 mt-1 line-clamp-1">{alert.message}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-500 text-sm">
                    No active suggestions for your domain.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className={`p-7 rounded-[28px] border border-white/60 bg-white/45 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02),0_20px_40px_-10px_rgba(99,102,241,0.03)] space-y-5 hover:shadow-[0_20px_50px_-5px_rgba(0,0,0,0.04),0_30px_60px_-10px_rgba(99,102,241,0.06)] transition-all duration-300 relative overflow-hidden ${role === 'finance_manager' || role === 'warehouse_manager' ? 'lg:col-span-2' : ''
          }`}>
          <div className="flex items-center justify-between relative z-10">
            <h3 className="text-[13px] font-extrabold text-slate-900 tracking-tight">Activity Feed</h3>
            <button className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-0 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar relative z-10 pl-2 mt-4">
            <div className="absolute left-5 top-2 bottom-6 w-0.5 bg-slate-200 rounded-full" />
            {recentActivities.slice(0, 5).map((act, index) => (
              <div key={act.id} className="flex items-start gap-5 p-3 rounded-xl hover:bg-white/60 transition-colors cursor-default group relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 relative z-10 shadow-sm border-2 border-white ${act.type === "success" ? "bg-emerald-100 text-emerald-600"
                    : act.type === "warning" ? "bg-amber-100 text-amber-600"
                      : "bg-indigo-100 text-indigo-600"
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${act.type === "success" ? "bg-emerald-500"
                      : act.type === "warning" ? "bg-amber-500"
                        : "bg-indigo-500"
                    }`} />
                </div>
                <div className="flex-1 space-y-1.5 pt-1 bg-white/40 p-3 rounded-2xl border border-white/60 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-shadow">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-[12px] text-slate-800">{act.action}</span>
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{act.timestamp}</span>
                  </div>
                  <p className="text-[11.5px] text-slate-500 font-medium">{act.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </motion.div>
  );
}
