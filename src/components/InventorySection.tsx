import React, { useState } from "react";
import { 
  Sliders, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, 
  Package, AlertTriangle, ArrowRightLeft, ShieldCheck, MoreVertical, SlidersHorizontal, AlertCircle, Trash2
} from "lucide-react";
import { LiveStockItem } from "../data/dashboardData";
import SkeletonLoader from "./SkeletonLoader";
import { useInventory } from "../hooks/useInventory";
import { useProducts } from "../hooks/useProducts";
import { useWarehouses } from "../hooks/useWarehouses";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface InventorySectionProps {
  onShowToast: (msg: string, type?: "success" | "info" | "error" | "warning") => void;
  activeModal?: string | null;
  onCloseModal?: () => void;
}

export default function InventorySection({ onShowToast, activeModal, onCloseModal }: InventorySectionProps) {
  const { permissions } = useAuth();
  const { inventory: stock, setInventory: setStock, loading, error, refreshInventory, addInventory, updateInventory, deleteInventory } = useInventory();
  const { products } = useProducts();
  const { warehouses: warehouseData } = useWarehouses();
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

  const handleStockAdjustment = async (id: string, currentQty: number, delta: number) => {
    try {
      const newQty = Math.max(0, currentQty + delta);
      await updateInventory(id, { on_hand_qty: newQty });
      onShowToast(`Adjusted stock levels by ${delta > 0 ? "+" : ""}${delta} units.`, "success");
    } catch (err: any) {
      onShowToast(`Failed to adjust stock: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteInventory(id);
      onShowToast(`Deleted inventory record for ${name}.`, "success");
    } catch (err: any) {
      onShowToast(`Failed to delete inventory: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const showReceiveModal = isReceiveModalOpen || activeModal === "receiveStock";

  const initialFormState = {
    productId: "",
    warehouseId: "",
    qtyToAdd: 0,
    safetyStockQty: 50
  };
  const [formData, setFormData] = useState(initialFormState);

  const closeModal = () => {
    setIsReceiveModalOpen(false);
    setFormData(initialFormState);
    onCloseModal?.();
  };

  const handleReceiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.productId || !formData.warehouseId) {
      return onShowToast("Please select both a product and a warehouse.", "error");
    }
    try {
      await addInventory(formData.productId, formData.warehouseId, formData.qtyToAdd, formData.safetyStockQty);
      onShowToast(`Successfully received ${formData.qtyToAdd} units!`, "success");
      closeModal();
    } catch (err: any) {
      onShowToast(`Failed to receive stock: ${err.message}`, "error");
    }
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
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-7 h-7 text-indigo-500" />
            <span>Inventory Balance & Stock Levels</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Real-time counts, safety stock safety thresholds, and physical warehouse bin storage coordinates.</p>
        </div>
        {permissions?.canManageInventory && (
          <button
            onClick={() => {
              setFormData(initialFormState);
              setIsReceiveModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
          >
            <Package className="w-4 h-4" />
            <span>Receive Stock</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-2xl flex flex-col xl:flex-row gap-4 justify-between items-center">
        
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
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
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
              className="px-2 py-1.5 text-xs rounded-lg border border-white/60 bg-white/60 text-slate-800 focus:outline-none"
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
              className="px-2 py-1.5 text-xs rounded-lg border border-white/60 bg-white/60 text-slate-800 focus:outline-none"
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
            className="p-1.5 rounded-lg border border-white/60 bg-white/60 hover:bg-white/70 text-slate-600 hover:text-slate-900 text-xs ml-auto transition-colors"
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
      <div className="border border-white/60 rounded-2xl bg-white/50 backdrop-blur-2xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/60 bg-white/60/25 backdrop-blur-md text-[11px] font-extrabold text-slate-800 uppercase tracking-widest sticky top-0 z-10">
                <th className="py-4 px-5">SKU / ID</th>
                <th className="py-4 px-5">Material Description</th>
                <th className="py-4 px-5 text-right">Physical Quantity</th>
                <th className="py-4 px-5">Warehouse Facility</th>
                <th className="py-4 px-5">Category/Sector</th>
                <th className="py-4 px-5">Status</th>
                {permissions?.canManageInventory && <th className="py-4 px-5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-white/40">
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-32 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-16 rounded ml-auto" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-5 w-16 rounded" /></td>
                    {permissions?.canManageInventory && <td className="py-4 px-4"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>}
                  </tr>
                ))
              ) : paginatedStock.length > 0 ? (
                paginatedStock.map((item) => (
                  <tr 
                    key={item.id}
                    onClick={() => handleRowClick(item)}
                    className="hover:bg-white/60/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5 font-semibold text-slate-800 text-xs">{item.sku}</td>
                    <td className="py-4 px-5 font-extrabold text-slate-950 text-sm">{item.name}</td>
                    <td className="py-4 px-5 text-right font-extrabold font-mono text-slate-900 text-sm">
                      {item.qty.toLocaleString()} units
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-700 text-sm">{item.warehouse}</td>
                    <td className="py-4 px-5 font-medium text-slate-600 text-sm">{item.sector}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded shadow-sm text-[11px] font-bold tracking-widest uppercase border ${
                        item.status === "Optimal" 
                          ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
                          : item.status === "Low Stock"
                            ? "bg-amber-500/10 text-amber-800 border-amber-500/20"
                            : item.status === "Transit"
                              ? "bg-indigo-500/10 text-indigo-800 border-indigo-500/20"
                              : "bg-rose-500/10 text-rose-800 border-rose-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    {permissions?.canManageInventory && (
                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenuId === item.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-white/60 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                              <button
                                onClick={() => handleAuditPassed(item.id, item.name)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Audit Passed</span>
                              </button>
                              <button
                                onClick={() => handleStockAdjustment(item.id, item.qty, 500)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Package className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Adjust Stock (+500)</span>
                              </button>
                              <button
                                onClick={() => handleStockAdjustment(item.id, item.qty, -500)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5 text-rose-400" />
                                <span>Adjust Stock (-500)</span>
                              </button>
                              <div className="h-px bg-slate-800 my-1" />
                              <button
                                onClick={() => handleDelete(item.id, item.name)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Record</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    )}
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
        <div className="p-4 border-t border-white/60 bg-white/40 backdrop-blur-md flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500">
            Page <span className="font-bold text-slate-700">{currentPage}</span> of <span className="font-bold text-slate-700">{totalPages}</span>
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-white/60 bg-white/60/40 hover:bg-white/80 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-800 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-white/60 bg-white/60/40 hover:bg-white/80 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Receive Stock Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-[#050914] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] animate-slideIn">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-white/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <Package className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Receive Stock</h2>
                  <p className="text-[10px] text-slate-600">Add or adjust inventory balances.</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-white/80 text-slate-600 hover:text-slate-900 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleReceiveSubmit} className="p-6 space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">Product / Material</label>
                  <select
                    required
                    value={formData.productId}
                    onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-800 bg-white/60 text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">Destination Warehouse</label>
                  <select
                    required
                    value={formData.warehouseId}
                    onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-800 bg-white/60 text-slate-900 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>Select a warehouse facility...</option>
                    {warehouseData.map(w => (
                      <option key={w.uuid || w.id} value={w.uuid || w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">Quantity to Receive</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.qtyToAdd}
                      onChange={(e) => setFormData({ ...formData, qtyToAdd: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-800 bg-white/60 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-600 uppercase tracking-wider mb-1.5">Safety Stock Threshold</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.safetyStockQty}
                      onChange={(e) => setFormData({ ...formData, safetyStockQty: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-800 bg-white/60 text-slate-900 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-800 hover:bg-white/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                >
                  Process Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
