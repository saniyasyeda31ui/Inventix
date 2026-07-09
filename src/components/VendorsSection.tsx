import React, { useState } from "react";
import {
  Users, Search, Plus, AlertCircle, Trash2, MoreVertical,
  ShieldAlert, Award, RefreshCw, CheckCircle, Edit2, X, CheckCircle2
} from "lucide-react";
import { VendorItem } from "../data/dashboardData";
import SkeletonLoader from "./SkeletonLoader";
import { useVendors } from "../hooks/useVendors";
import { useAuth } from "../context/AuthContext";

interface VendorsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info" | "warning" | "error") => void;
  onOpenModal: (modalName: string) => void;
  activeModal?: string | null;
  onCloseModal?: () => void;
}

export default function VendorsSection({ onShowToast, onOpenModal, activeModal, onCloseModal }: VendorsSectionProps) {
  const { permissions } = useAuth();
  const { vendors, loading, error, refreshVendors, addVendor, updateVendor, deleteVendor } = useVendors();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);

  const showAddModal = isAddModalOpen || activeModal === "addVendor";

  const initialFormState = {
    name: "", category: "Raw Materials", score: 90,
    onTime: "95%", contact: "", email: "", status: "Approved" as VendorItem["status"]
  };
  const [formData, setFormData] = useState(initialFormState);

  const filteredVendors = vendors.filter(v => {
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase()) ||
      v.contact.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id: string, newStatus: VendorItem["status"]) => {
    try {
      await updateVendor(id, { status: newStatus });
      onShowToast(`Updated supplier status to ${newStatus}`, "success");
    } catch (err: any) {
      onShowToast(`Failed to update status: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteVendor(id);
      onShowToast(`Deleted ${name} from vendors list.`, "success");
    } catch (err: any) {
      onShowToast(`Failed to delete vendor: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const handleAuditVendor = (name: string) => {
    onShowToast(`Dispatched compliance & SLA performance audit report for ${name}.`, "success");
    setActiveMenuId(null);
  };

  const handleEditClick = (v: VendorItem) => {
    setFormData({
      name: v.name,
      category: v.category,
      score: v.score,
      onTime: v.onTime,
      contact: v.contact,
      email: v.email,
      status: v.status,
    });
    setEditingVendorId(v.id);
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return onShowToast("Please enter a vendor name", "error");
    try {
      await addVendor(formData);
      onShowToast(`Successfully registered ${formData.name}!`, "success");
      setIsAddModalOpen(false);
      setFormData(initialFormState);
    } catch (err: any) {
      onShowToast(`Failed to add vendor: ${err.message}`, "error");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVendorId) return;
    try {
      await updateVendor(editingVendorId, formData);
      onShowToast(`Successfully updated ${formData.name}!`, "success");
      setIsEditModalOpen(false);
      setEditingVendorId(null);
      setFormData(initialFormState);
    } catch (err: any) {
      onShowToast(`Failed to update vendor: ${err.message}`, "error");
    }
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    onCloseModal?.();
    setEditingVendorId(null);
    setFormData(initialFormState);
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-500" />
            <span>Sourcing Vendors &amp; Supplier Directory</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Audit active vendor logs, supplier SLA quality rates, and on-time shipment compliance ratios.</p>
        </div>
        {permissions?.canManageVendors && (
          <button
            onClick={() => {
              setFormData(initialFormState);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Vendor</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search vendor name, contact or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Vendor Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-white/60 bg-white/60 text-slate-800 focus:outline-none"
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
            className="p-1.5 ml-2 rounded-lg border border-white/60 bg-white/60 hover:bg-white/70 text-slate-600 hover:text-slate-900 text-xs transition-colors"
            title="Reset Filters & Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
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
            <button onClick={refreshVendors} className="mt-2 w-fit text-xs font-semibold px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors">
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Vendors Table */}
      <div className="border border-white/60 rounded-2xl bg-white/50 backdrop-blur-2xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/60 bg-white/60/25 backdrop-blur-md text-[11px] font-extrabold text-slate-800 uppercase tracking-widest sticky top-0 z-10">
                <th className="py-4 px-5">Vendor ID</th>
                <th className="py-4 px-5">Supplier Name</th>
                <th className="py-4 px-5">Sourcing Category</th>
                <th className="py-4 px-5 text-center">Quality Score</th>
                <th className="py-4 px-5 text-center">On-Time Rate</th>
                <th className="py-4 px-5">Contact Representative</th>
                <th className="py-4 px-5">Status</th>
                {permissions?.canManageVendors && <th className="py-4 px-5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-16 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-32 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-5 w-12 rounded mx-auto" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-12 rounded mx-auto" /></td>
                    <td className="py-4 px-5">
                      <div className="space-y-1.5">
                        <SkeletonLoader className="h-3 w-24 rounded" />
                        <SkeletonLoader className="h-2 w-32 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-5 w-16 rounded" /></td>
                    {permissions?.canManageVendors && <td className="py-4 px-5"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>}
                  </tr>
                ))
              ) : filteredVendors.length > 0 ? (
                filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-white/60/40 transition-colors cursor-pointer group">
                    <td className="py-4 px-5 font-semibold text-slate-800 text-xs">{v.id}</td>
                    <td className="py-4 px-5 font-extrabold text-slate-950 text-sm">{v.name}</td>
                    <td className="py-4 px-5 font-medium text-slate-600 text-sm">{v.category}</td>
                    <td className="py-4 px-5 text-center font-extrabold font-mono text-slate-900 text-sm">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded shadow-sm text-[11px] font-bold border ${v.score >= 90 ? "text-emerald-800 border-emerald-500/20 bg-emerald-500/10" : "text-amber-800 border-amber-500/20 bg-amber-500/10"
                        }`}>
                        {v.score}/100
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center font-extrabold font-mono text-slate-900 text-sm">{v.onTime}</td>
                    <td className="py-4 px-5">
                      <span className="text-slate-800 font-medium text-sm block">{v.contact}</span>
                      <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{v.email}</span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded shadow-sm text-[11px] font-bold tracking-widest uppercase border ${v.status === "Preferred"
                          ? "bg-indigo-500/10 text-indigo-800 border-indigo-500/20"
                          : v.status === "Approved"
                            ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-800 border-amber-500/20"
                        }`}>
                        {v.status}
                      </span>
                    </td>
                    {permissions?.canManageVendors && (
                      <td className="py-4 px-5 text-center">
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === v.id ? null : v.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {activeMenuId === v.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-white/60 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                              <button
                                onClick={() => handleAuditVendor(v.name)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Award className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Audit SLA Compliance</span>
                              </button>
                              <button
                                onClick={() => handleEditClick(v)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Edit Details</span>
                              </button>
                              <div className="h-px bg-slate-800 my-1" />
                              <button
                                onClick={() => handleUpdateStatus(v.id, "Preferred")}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <CheckCircle className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Promote to Tier-1</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(v.id, "Under Review")}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                                <span>Put Under Review</span>
                              </button>
                              <div className="h-px bg-slate-800 my-1" />
                              <button
                                onClick={() => handleDelete(v.id, v.name)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Vendor</span>
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
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No suppliers matched your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {(showAddModal || isEditModalOpen) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={closeModal} />
          <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(168,85,247,0.2),inset_0_0_0_1px_rgba(255,255,255,0.6)] border border-white/50 rounded-[32px] p-8 overflow-hidden animate-slideUp">
            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[22px] font-extrabold text-slate-900 font-display tracking-tight">
                    {isEditModalOpen ? "Edit Vendor" : "Add Vendor"}
                  </h3>
                </div>
                <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Company Name</label>
                  <input
                    required type="text" value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Acme Corporation"
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Category</label>
                  <input
                    required type="text" value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Electronics, Logistics"
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Quality Score (0–100)</label>
                    <input
                      required type="number" min="0" max="100" value={formData.score}
                      onChange={e => setFormData({ ...formData, score: Number(e.target.value) })}
                      className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">On-Time % (e.g. 95%)</label>
                    <input
                      required type="text" placeholder="95%" value={formData.onTime}
                      onChange={e => setFormData({ ...formData, onTime: e.target.value })}
                      className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Contact Name</label>
                  <input
                    type="text" value={formData.contact}
                    onChange={e => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Contact Email</label>
                  <input
                    type="email" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. jane.doe@acme.com"
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/60 mt-6">
                <button
                  type="button" onClick={closeModal}
                  className="px-5 py-3.5 rounded-[14px] text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-transparent border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="relative rounded-[14px] bg-gradient-to-r from-[#9444ff] to-[#bd44ff] text-white font-bold py-3.5 px-6 shadow-[0_8px_20px_rgba(168,85,247,0.4)] focus:outline-none flex items-center justify-center gap-2 group overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 text-[13px]">{isEditModalOpen ? "Save Changes" : "Add Vendor"}</span>
                  <CheckCircle2 className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
