import React, { useState } from "react";
import { 
  Users, Search, Filter, Plus, Mail, Star, Phone, CheckCircle, 
  AlertCircle, Trash2, MoreVertical, ShieldAlert, Award, RefreshCw
} from "lucide-react";
import { VendorItem } from "../data/dashboardData";
import SkeletonLoader from "./SkeletonLoader";
import { useVendors } from "../hooks/useVendors";

interface VendorsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
  onOpenModal: (modalName: string) => void;
}

export default function VendorsSection({ onShowToast, onOpenModal }: VendorsSectionProps) {
  const { vendors, setVendors, loading, error, refreshVendors } = useVendors();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = 
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.contact.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setVendors(vendors.map(v => v.id === id ? { ...v, status: newStatus } : v));
    onShowToast(`Updated supplier status to ${newStatus}`, "success");
    setActiveMenuId(null);
  };

  const handleAuditVendor = (name: string) => {
    onShowToast(`Dispatched compliance & SLA performance audit report for ${name}.`, "success");
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>Sourcing Vendors & Supplier Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Audit active vendor logs, supplier SLA quality rates, and on-time shipment compliance ratios.</p>
        </div>
        <button
          onClick={() => onOpenModal("addVendor")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Vendor</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-slate-900 bg-[#040815] flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search vendor name, contact or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-900 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Vendor Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
          >
            <option value="All">All Suppliers</option>
            <option value="Preferred">Preferred (Tier 1)</option>
            <option value="Approved">Approved</option>
            <option value="Under Review">Under Review</option>
            <option value="Suspended">Suspended</option>
          </select>
          
          <button 
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              refreshVendors();
              onShowToast("Filters reset and data refreshed.", "info");
            }}
            className="p-1.5 ml-2 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900/60 text-slate-400 hover:text-white text-xs transition-colors"
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
              onClick={refreshVendors} 
              className="mt-2 w-fit text-xs font-semibold px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Vendors List Table */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/20 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Vendor ID</th>
                <th className="py-3 px-4">Supplier Name</th>
                <th className="py-3 px-4">Sourcing Category</th>
                <th className="py-3 px-4 text-center">Quality Score</th>
                <th className="py-3 px-4 text-center">On-Time rate</th>
                <th className="py-3 px-4">Contact Representative</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-slate-900/40">
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-16 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-32 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-5 w-12 rounded mx-auto" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-12 rounded mx-auto" /></td>
                    <td className="py-4 px-4">
                      <div className="space-y-1.5">
                        <SkeletonLoader className="h-3 w-24 rounded" />
                        <SkeletonLoader className="h-2 w-32 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-5 w-16 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>
                  </tr>
                ))
              ) : filteredVendors.length > 0 ? (
                filteredVendors.map((v) => (
                  <tr 
                    key={v.id}
                    className="border-b border-slate-900/50 hover:bg-slate-950/20 transition-all text-xs"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-400">{v.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{v.name}</td>
                    <td className="py-3.5 px-4 text-slate-400">{v.category}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-bold">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        v.score >= 90 ? "text-emerald-400 bg-emerald-500/5" : "text-amber-400 bg-amber-500/5"
                      }`}>
                        {v.score}/100
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-300 font-semibold">{v.onTime}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 block">{v.contact}</span>
                      <span className="text-[10px] text-slate-500 block">{v.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        v.status === "Preferred" 
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                          : v.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === v.id ? null : v.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeMenuId === v.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-slate-900 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                            <button
                              onClick={() => handleAuditVendor(v.name)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <Award className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Audit SLA Compliance</span>
                            </button>
                            <div className="h-px bg-slate-900 my-1" />
                            <button
                              onClick={() => handleUpdateStatus(v.id, "Preferred")}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Promote to Tier-1</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(v.id, "Under Review")}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                              <span>Put Under Review</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No suppliers matched your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
