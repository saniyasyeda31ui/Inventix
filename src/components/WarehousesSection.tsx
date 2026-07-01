import React, { useState } from "react";
import { 
  Warehouse, Search, Filter, Plus, Mail, User, MapPin, 
  Layers, MoreVertical, Edit2, ShieldAlert, CheckCircle, Sliders
} from "lucide-react";
import { WarehouseItem, initialWarehouses } from "../data/dashboardData";

interface WarehousesSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
  onOpenModal: (modalName: string) => void;
}

export default function WarehousesSection({ onShowToast, onOpenModal }: WarehousesSectionProps) {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>(initialWarehouses);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredWarehouses = warehouses.filter(wh => {
    const matchesSearch = 
      wh.name.toLowerCase().includes(search.toLowerCase()) ||
      wh.location.toLowerCase().includes(search.toLowerCase()) ||
      wh.manager.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || wh.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setWarehouses(warehouses.map(wh => wh.id === id ? { ...wh, status: newStatus } : wh));
    onShowToast(`Updated Warehouse status to ${newStatus}`, "success");
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
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Warehouse className="w-5 h-5 text-indigo-400" />
            <span>Warehouses & Facilities</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Monitor real-time storage capacities, physical layouts, and site manager logs.</p>
        </div>
        <button
          onClick={() => onOpenModal("addWarehouse")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Warehouse Hub</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl border border-slate-900 bg-[#040815] flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search warehouse name, location, or manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-900 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Multi-Selectors */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Facility Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="At Capacity">At Capacity</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredWarehouses.length > 0 ? (
          filteredWarehouses.map((wh) => (
            <div 
              key={wh.id}
              className="p-5 rounded-2xl border border-slate-900 bg-[#040815] hover:border-indigo-500/20 hover:bg-slate-950/20 transition-all flex flex-col justify-between space-y-4 relative"
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
                  <h3 className="text-sm font-bold text-white tracking-tight">{wh.name}</h3>
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === wh.id ? null : wh.id)}
                    className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900/60 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === wh.id && (
                    <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-slate-900 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                      <button
                        onClick={() => handleOptimizeLayout(wh.name)}
                        className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                      >
                        <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Optimize Layout</span>
                      </button>
                      <div className="h-px bg-slate-900 my-1" />
                      <button
                        onClick={() => handleUpdateStatus(wh.id, "Active")}
                        className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Set Active</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(wh.id, "At Capacity")}
                        className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>Set At Capacity</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Gauge Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono">Storage Capacity Utilization</span>
                  <span className={`font-bold font-mono ${wh.capacityUsed >= 90 ? "text-rose-400" : wh.capacityUsed >= 75 ? "text-amber-400" : "text-indigo-400"}`}>
                    {wh.capacityUsed}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      wh.capacityUsed >= 90 ? "bg-rose-500" : wh.capacityUsed >= 75 ? "bg-amber-500" : "bg-indigo-500"
                    }`}
                    style={{ width: `${wh.capacityUsed}%` }}
                  />
                </div>
              </div>

              {/* Specs & Info */}
              <div className="pt-3 border-t border-slate-900/60 text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span className="truncate">{wh.location}</span>
                </div>
                
                <div className="flex items-center gap-2 text-slate-400">
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
          <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-900 rounded-2xl bg-[#040815]">
            No warehouses matching your filter.
          </div>
        )}
      </div>

    </div>
  );
}
