import React, { useState } from "react";
import { 
  Sliders, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, 
  Package, AlertTriangle, ArrowRightLeft, ShieldCheck, MoreVertical, SlidersHorizontal, AlertCircle
} from "lucide-react";
import { LiveStockItem } from "../data/dashboardData";
import SkeletonLoader from "./SkeletonLoader";
import { useInventory } from "../hooks/useInventory";

interface InventorySectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
}

export default function InventorySection({ onShowToast }: InventorySectionProps) {
  const { inventory: stock, setInventory: setStock, loading, error, refreshInventory } = useInventory();
  const [search, setSearch] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 5;

  // Derive filter selectors
  const warehouses = ["All", ...Array.from(new Set(stock.map(s => s.warehouse)))];
  const statuses = ["All", "Optimal", "Low Stock", "Critical", "Transit"];

  const handleRowClick = (item: LiveStockItem) => {
    onShowToast(`Selected stock item: ${item.name} - SKU: ${item.sku}. Status is ${item.status}.`, "info");
  };

  const handleAuditPassed = (id: string, name: string) => {
    onShowToast(`Physical inventory audit completed for ${name}. Variance: 0.00%.`, "success");
    setActiveMenuId(null);
  };

  const handleStockAdjustment = (id: string, delta: number) => {
    setStock(stock.map(item => {
      if (item.id === id) {
        const nextQty = Math.max(0, item.qty + delta);
        let nextStatus: "Optimal" | "Low Stock" | "Critical" | "Transit" = "Optimal";
        if (nextQty < 1000) nextStatus = "Critical";
        else if (nextQty < 5000) nextStatus = "Low Stock";
        return { ...item, qty: nextQty, status: nextStatus };
      }
      return item;
    }));
    onShowToast(`Adjusted stock levels by ${delta > 0 ? "+" : ""}${delta} units.`, "success");
    setActiveMenuId(null);
  };

  // Filter & Paginate
  const filteredStock = stock.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase()) ||
      item.sector.toLowerCase().includes(search.toLowerCase());
    
    const matchesWarehouse = warehouseFilter === "All" || item.warehouse === warehouseFilter;
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesWarehouse && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStock.length / itemsPerPage) || 1;
  const paginatedStock = filteredStock.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <span>Inventory Balance & Stock Levels</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Real-time counts, safety stock safety thresholds, and physical warehouse bin storage coordinates.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-slate-900 bg-[#040815] flex flex-col xl:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full xl:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search material SKU, bin, or sector..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-900 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Multi-Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Facility</span>
            <select
              value={warehouseFilter}
              onChange={(e) => {
                setWarehouseFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
            >
              {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Stock Status</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button 
            onClick={() => {
              setSearch("");
              setWarehouseFilter("All");
              setStatusFilter("All");
              setCurrentPage(1);
              refreshInventory();
              onShowToast("Filters reset and inventory refreshed.", "info");
            }}
            className="p-1.5 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900/60 text-slate-400 hover:text-white text-xs ml-auto transition-colors"
            title="Reset Filters & Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-400 animate-slideIn">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-rose-300">Data Fetch Error</span>
            <span className="leading-relaxed mt-1 text-xs">{error}</span>
            <button 
              onClick={refreshInventory} 
              className="mt-2 w-fit text-xs font-semibold px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Stocks Table */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/20 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">SKU / ID</th>
                <th className="py-3 px-4">Material Description</th>
                <th className="py-3 px-4 text-right">Physical Quantity</th>
                <th className="py-3 px-4">Warehouse Facility</th>
                <th className="py-3 px-4">Category/Sector</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-slate-900/40">
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-32 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-16 rounded ml-auto" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-5 w-16 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>
                  </tr>
                ))
              ) : paginatedStock.length > 0 ? (
                paginatedStock.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="border-b border-slate-900/50 hover:bg-slate-950/20 transition-all cursor-pointer text-xs"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-300 font-semibold">{item.sku}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{item.name}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-200">
                      {item.qty.toLocaleString()} units
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{item.warehouse}</td>
                    <td className="py-3.5 px-4 text-slate-400">{item.sector}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        item.status === "Optimal" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                          : item.status === "Low Stock"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            : item.status === "Transit"
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeMenuId === item.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-slate-900 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                            <button
                              onClick={() => handleAuditPassed(item.id, item.name)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Audit Passed</span>
                            </button>
                            <button
                              onClick={() => handleStockAdjustment(item.id, 500)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <Package className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Adjust Stock (+500)</span>
                            </button>
                            <button
                              onClick={() => handleStockAdjustment(item.id, -500)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5 text-rose-400" />
                              <span>Adjust Stock (-500)</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No physical stock records matched your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/20 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
