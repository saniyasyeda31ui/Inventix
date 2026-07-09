import React, { useState } from "react";
import { 
  Warehouse, Search, Filter, Plus, Mail, User, MapPin, 
  Layers, MoreVertical, Edit2, ShieldAlert, CheckCircle, Sliders, RefreshCw, AlertCircle, Trash2
} from "lucide-react";
import { WarehouseItem } from "../data/dashboardData";
import { useWarehouses } from "../hooks/useWarehouses";
import { useAuth } from "../context/AuthContext";

interface WarehousesSectionProps {
  onShowToast: (msg: string, type?: "success" | "info" | "warning" | "error") => void;
  onOpenModal: (modalName: string) => void;
  activeModal?: string | null;
  onCloseModal?: () => void;
}

export default function WarehousesSection({ onShowToast, onOpenModal, activeModal, onCloseModal }: WarehousesSectionProps) {
  const { permissions } = useAuth();
  const { warehouses, setWarehouses, loading, error, refreshWarehouses, addWarehouse, updateWarehouse, deleteWarehouse } = useWarehouses();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingWarehouseId, setEditingWarehouseId] = useState<string | null>(null);

  const showAddModal = isAddModalOpen || activeModal === "addWarehouse";

  const initialFormState = { name: "", location: "", totalAreaSqFt: 0 };
  const [formData, setFormData] = useState(initialFormState);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return onShowToast("Please enter a warehouse name", "error");
    try {
      await addWarehouse(formData as any);
      onShowToast(`Successfully added warehouse ${formData.name}!`, "success");
      setIsAddModalOpen(false);
      onCloseModal?.();
      setFormData(initialFormState);
    } catch (err: any) {
      onShowToast(`Failed to add warehouse: ${err.message}`, "error");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWarehouseId) return;
    try {
      await updateWarehouse(editingWarehouseId, formData as any);
      onShowToast(`Successfully updated warehouse ${formData.name}!`, "success");
      setIsEditModalOpen(false);
      setEditingWarehouseId(null);
      setFormData(initialFormState);
    } catch (err: any) {
      onShowToast(`Failed to update warehouse: ${err.message}`, "error");
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    onCloseModal?.();
    setEditingWarehouseId(null);
    setFormData(initialFormState);
  };

  const filteredWarehouses = warehouses.filter(wh => {
    const matchesSearch = 
      wh.name.toLowerCase().includes(search.toLowerCase()) ||
      wh.location.toLowerCase().includes(search.toLowerCase()) ||
      wh.manager.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || wh.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: any) => {
    try {
      await updateWarehouse(id, { status: newStatus });
      onShowToast(`Updated Warehouse status to ${newStatus}`, "success");
    } catch (err: any) {
      onShowToast(`Failed to update status: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteWarehouse(id);
      onShowToast(`Deleted ${name} from warehouses.`, "success");
    } catch (err: any) {
      console.error("[handleDelete] Caught error:", err);
      onShowToast(`Failed to delete warehouse: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const handleEditClick = (wh: WarehouseItem) => {
    setFormData({
      name: wh.name,
      location: wh.location,
      totalAreaSqFt: wh.totalAreaSqFt
    });
    setEditingWarehouseId(wh.id);
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleOptimizeLayout = (name: string) => {
    onShowToast(`Dispatched layout optimization model for ${name}. Expected reduction: 4.2% footprint.`, "success");
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-indigo-400" />
            <span>Warehouses & Facilities</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Monitor real-time storage capacities, physical layouts, and site manager logs.</p>
        </div>
        {permissions?.canManageWarehouses && (
          <button
            onClick={() => {
              setFormData(initialFormState);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Warehouse Hub</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search warehouse name, location, or manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Multi-Selectors */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Facility Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-white/60 bg-white/60 text-slate-800 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="At Capacity">At Capacity</option>
            <option value="Maintenance">Maintenance</option>
          </select>

          <button 
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              refreshWarehouses();
              onShowToast("Filters reset and data refreshed.", "info");
            }}
            className="p-1.5 ml-2 rounded-lg border border-white/60 bg-white/60 hover:bg-white/70 text-slate-600 hover:text-slate-900 text-xs transition-colors"
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
              onClick={refreshWarehouses} 
              className="mt-2 w-fit text-xs font-semibold px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="p-5 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl hover:bg-white/40 backdrop-blur-md space-y-4 animate-pulse relative h-[240px] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-16 bg-slate-800 rounded" />
                  <div className="h-4 w-32 bg-slate-800 rounded" />
                </div>
                <div className="h-6 w-6 bg-slate-800 rounded" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-32 bg-slate-800 rounded" />
                  <div className="h-3 w-8 bg-slate-800 rounded" />
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full" />
              </div>
              <div className="pt-3 border-t border-white/60/60 space-y-2.5">
                <div className="h-3 w-40 bg-slate-800 rounded" />
                <div className="h-3 w-32 bg-slate-800 rounded" />
                <div className="h-3 w-48 bg-slate-800 rounded" />
              </div>
            </div>
          ))
        ) : filteredWarehouses.length > 0 ? (
          filteredWarehouses.map((wh) => (
            <div 
              key={wh.id}
              className="p-5 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl hover:border-indigo-500/20 hover:bg-white/40 backdrop-blur-md transition-all flex flex-col justify-between space-y-4 relative"
            >
              
              {/* Header inside Card */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest">{wh.id}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                      wh.status === "Active" 
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                        : wh.status === "At Capacity"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                    }`}>
                      {wh.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">{wh.name}</h3>
                </div>

                  {permissions?.canManageWarehouses && (
                    <div className="relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === wh.id ? null : wh.id)}
                        className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === wh.id && (
                        <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-white/60 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                          <button
                            onClick={() => handleOptimizeLayout(wh.name)}
                            className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-800 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                          >
                            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Optimize Layout</span>
                          </button>
                          <div className="h-px bg-slate-900 my-1" />
                          <button
                            onClick={() => handleUpdateStatus(wh.id, "Active")}
                            className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-800 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Set Active</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(wh.id, "At Capacity")}
                            className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-800 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                          >
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            <span>Set At Capacity</span>
                          </button>
                          <div className="h-px bg-slate-900 my-1" />
                          <button
                            onClick={() => handleEditClick(wh)}
                            className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-800 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Edit Warehouse</span>
                          </button>
                          <button
                            onClick={() => handleDelete(wh.id, wh.name)}
                            className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-800 hover:bg-rose-500/10 hover:text-rose-400 flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Delete Facility</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              {/* Gauge Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">Storage Capacity Utilization</span>
                  <span className={`font-bold font-mono ${wh.capacityUsed >= 90 ? "text-rose-400" : wh.capacityUsed >= 75 ? "text-amber-400" : "text-indigo-400"}`}>
                    {wh.capacityUsed}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)]">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      wh.capacityUsed >= 90 ? "bg-rose-500" : wh.capacityUsed >= 75 ? "bg-amber-500" : "bg-indigo-500"
                    }`}
                    style={{ width: `${wh.capacityUsed}%` }}
                  />
                </div>
              </div>

              {/* Specs & Info */}
              <div className="pt-3 border-t border-white/60/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">{wh.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Mgr: {wh.manager}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500 font-mono text-[10px]">
                  <Layers className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Facility Footprint: {wh.totalAreaSqFt.toLocaleString()} sq ft</span>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-white/60 rounded-2xl bg-white/50 backdrop-blur-2xl">
            No warehouses matching your filter.
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || isEditModalOpen) && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div className="absolute inset-0 bg-white/60/80 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative w-full max-w-md bg-[#050914] border border-white/60 rounded-2xl p-6 shadow-2xl z-10 animate-slideUp">
            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-white/60">
                <Warehouse className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900">{isEditModalOpen ? "Edit Warehouse Facility" : "Add Physical Warehouse Facility"}</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-semibold uppercase tracking-wider block">Warehouse Name</label>
                  <input required type="text" placeholder="e.g. Frankfurt Storage Hub" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder:text-slate-700 focus:border-indigo-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-semibold uppercase tracking-wider block">Geographic Territory</label>
                    <input required type="text" placeholder="e.g. Germany" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-semibold uppercase tracking-wider block">Total Sq Ft (Capacity)</label>
                    <input required type="number" placeholder="e.g. 100000" min="0" value={formData.totalAreaSqFt || ''} onChange={e => setFormData({ ...formData, totalAreaSqFt: Number(e.target.value) })} className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer">
                  {isEditModalOpen ? "Save Changes" : "Confirm Storage Hub"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
