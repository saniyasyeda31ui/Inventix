import React, { useState, useEffect } from "react";
import { 
  FileText, Search, Filter, Plus, Printer, Mail, MoreVertical, 
  Trash2, RefreshCw, Eye, Send, CheckCircle2, AlertCircle, Edit2, X
} from "lucide-react";
import { PurchaseOrder, PurchaseRequest, VendorItem } from "../data/dashboardData";
import SkeletonLoader from "./SkeletonLoader";
import { usePurchaseOrders } from "../hooks/usePurchaseOrders";
import { useVendors } from "../hooks/useVendors";
import { usePurchaseRequests } from "../hooks/usePurchaseRequests";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseOrdersSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
  activeModal?: string | null;
  onCloseModal?: () => void;
}

export default function PurchaseOrdersSection({ onShowToast, activeModal, onCloseModal }: PurchaseOrdersSectionProps) {
  const { permissions } = useAuth();
  const { purchaseOrders: orders, loading, error, refreshPurchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } = usePurchaseOrders();
  const { vendors } = useVendors();
  const { purchaseRequests } = usePurchaseRequests();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);

  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    vendor_id: "",
    purchase_request_id: "",
    total_amount: 0,
    itemsCount: 0,
    deliveryDate: new Date().toISOString().split('T')[0],
    status: "Draft"
  });

  useEffect(() => {
    if (activeModal === "createOrder") {
      openAddModal();
      if (onCloseModal) onCloseModal();
    }
  }, [activeModal, onCloseModal]);

  const openAddModal = () => {
    setFormData({
      vendor_id: "",
      purchase_request_id: "",
      total_amount: 0,
      itemsCount: 0,
      deliveryDate: new Date().toISOString().split('T')[0],
      status: "Draft"
    });
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const openEditModal = (o: PurchaseOrder) => {
    setFormData({
      vendor_id: o.vendor_id || "",
      purchase_request_id: o.purchase_request_id || "",
      total_amount: o.total_amount || 0,
      itemsCount: o.itemsCount || 0,
      deliveryDate: o.deliveryDate === '-' ? '' : o.deliveryDate,
      status: o.status
    });
    setEditingOrder(o);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handlePRChange = (prId: string) => {
    if (!prId) {
      setFormData(prev => ({ ...prev, purchase_request_id: "" }));
      return;
    }
    
    const pr = purchaseRequests.find(r => r.id === prId);
    if (pr) {
      let matchVendorId = "";
      if (pr.supplier) {
        const v = vendors.find(ven => ven.name.toLowerCase() === pr.supplier.toLowerCase());
        if (v) matchVendorId = v.uuid || v.id;
      }
      
      const parsedAmount = typeof pr.amount === 'string' 
        ? parseFloat(pr.amount.replace(/[^0-9.-]+/g,""))
        : (pr.amount as number) || 0;

      setFormData(prev => ({
        ...prev,
        purchase_request_id: pr.id,
        vendor_id: matchVendorId || prev.vendor_id,
        total_amount: parsedAmount || prev.total_amount,
        itemsCount: (pr as any).quantity || 1,
      }));
    } else {
      setFormData(prev => ({ ...prev, purchase_request_id: prId }));
    }
  };

  const handleDelete = async (uuid: string) => {
    setActiveMenuId(null);
    if (!window.confirm("Are you sure you want to delete this purchase order?")) return;
    try {
      await deletePurchaseOrder(uuid);
      onShowToast("Purchase order deleted", "success");
    } catch (err: any) {
      onShowToast(`Failed to delete: ${err.message}`, "info");
    }
  };

  const handleUpdateStatus = async (uuid: string, status: string) => {
    setActiveMenuId(null);
    try {
      await updatePurchaseOrder(uuid, { status: status as any });
      onShowToast(`Purchase order status updated to ${status}`, "success");
    } catch (err: any) {
      onShowToast(`Failed to update status: ${err.message}`, "info");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendor_id) {
      onShowToast("Please select a vendor", "info");
      return;
    }
    try {
      const selectedVendor = vendors.find(v => v.uuid === formData.vendor_id || v.id === formData.vendor_id);
      const submitData = { 
        ...formData, 
        vendorName: selectedVendor ? selectedVendor.name : "Unknown Vendor" 
      };

      if (editingOrder && editingOrder.uuid) {
        await updatePurchaseOrder(editingOrder.uuid, submitData);
        onShowToast("Purchase order updated", "success");
      } else {
        await addPurchaseOrder(submitData);
        onShowToast("Purchase order created", "success");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      onShowToast(`Error: ${err.message}`, "info");
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-500" />
            <span>Purchase Orders (PO) Registry</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Legally binding acquisition drafts, dispatched procurement contracts, and delivery arrival manifests.</p>
        </div>
        {permissions?.canManagePurchaseOrders && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Purchase Order</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search PO ID, vendor, or authorized buyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">PO Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-xs text-slate-800 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="All">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Sent">Sent</option>
            <option value="Partially Received">Partially Received</option>
            <option value="Received">Received</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button 
            onClick={refreshPurchaseOrders}
            className="p-2 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer ml-2"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
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
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="border border-white/60 rounded-2xl bg-white/50 backdrop-blur-2xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/60 bg-white/60/25 backdrop-blur-md text-[11px] font-extrabold text-slate-800 uppercase tracking-widest sticky top-0 z-10">
                <th className="py-4 px-5">PO-ID</th>
                <th className="py-4 px-5">Vendor Partner</th>
                <th className="py-4 px-5">Date Authorized</th>
                <th className="py-4 px-5">Expected Delivery</th>
                <th className="py-4 px-5 text-right">Items Count</th>
                <th className="py-4 px-5 text-right">Total Cost</th>
                <th className="py-4 px-5">Authorized Buyer</th>
                <th className="py-4 px-5">Status</th>
                {permissions?.canManagePurchaseOrders && <th className="py-4 px-5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-32 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-12 rounded ml-auto" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-16 rounded ml-auto" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-5 w-16 rounded" /></td>
                    {permissions?.canManagePurchaseOrders && <td className="py-4 px-5"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>}
                  </tr>
                ))
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr 
                    key={o.id}
                    className="hover:bg-white/60/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5 font-extrabold text-slate-950 text-sm">{o.id}</td>
                    <td className="py-4 px-5 font-medium text-slate-700 text-sm">{o.vendorName}</td>
                    <td className="py-4 px-5 font-medium text-slate-500 text-xs">{o.dateCreated}</td>
                    <td className="py-4 px-5 font-bold text-slate-800 text-sm">{o.deliveryDate}</td>
                    <td className="py-4 px-5 text-right font-semibold font-mono text-slate-700 text-sm">
                      {o.itemsCount.toLocaleString()} units
                    </td>
                    <td className="py-4 px-5 text-right font-extrabold font-mono text-slate-900 text-sm">{o.amount}</td>
                    <td className="py-4 px-5 font-medium text-slate-600 text-sm">{o.buyer}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded shadow-sm text-[11px] font-bold tracking-widest uppercase border ${
                        o.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
                          : o.status === "Sent" || o.status === "Partially Received"
                            ? "bg-indigo-500/10 text-indigo-800 border-indigo-500/20"
                            : o.status === "Pending Approval"
                              ? "bg-amber-500/10 text-amber-800 border-amber-500/20"
                              : "bg-slate-500/10 text-slate-700 border-slate-500/20"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    {permissions?.canManagePurchaseOrders && (
                      <td className="py-4 px-5 text-center">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === o.id ? null : o.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenuId === o.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-white/60 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                              <button
                                onClick={() => openEditModal(o)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Edit PO</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(o.uuid!, "Sent")}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Send className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Dispatch PO</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(o.uuid!, "Completed")}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Mark Received</span>
                              </button>
                              <div className="h-px bg-slate-800 my-1" />
                              <button
                                onClick={() => handleDelete(o.uuid!)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete PO</span>
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
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No purchase orders matched your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/60/80 backdrop-blur-md" 
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 280 }}
              className="relative w-full max-w-lg bg-white/50 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-2xl p-6 overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)]"
            >
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/60">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {editingOrder ? `Edit Purchase Order (${editingOrder.id})` : "Create Purchase Order"}
                    </h3>
                  </div>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-semibold uppercase tracking-wider block">Link Purchase Request (Optional)</label>
                    <select 
                      value={formData.purchase_request_id}
                      onChange={e => handlePRChange(e.target.value)}
                      className="w-full bg-white/60 border border-white/60 rounded-xl px-3 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">-- No linked request --</option>
                      {purchaseRequests.map(pr => (
                        <option key={pr.id} value={pr.id}>{pr.id} ({pr.item})</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-semibold uppercase tracking-wider block">Vendor</label>
                    <select 
                      required
                      value={formData.vendor_id}
                      onChange={e => setFormData({ ...formData, vendor_id: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 rounded-xl px-3 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Select a Vendor</option>
                      {vendors.map(v => (
                        <option key={v.id} value={v.uuid || v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Total Amount ($)</label>
                      <input 
                        required
                        type="number"
                        min="0"
                        step="any"
                        value={formData.total_amount}
                        onChange={e => setFormData({ ...formData, total_amount: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Total Items Count</label>
                      <input 
                        required
                        type="number"
                        min="0"
                        step="1"
                        value={formData.itemsCount}
                        onChange={e => setFormData({ ...formData, itemsCount: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Status</label>
                      <select 
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-white/60 border border-white/60 rounded-xl px-3 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Pending Approval">Pending Approval</option>
                        <option value="Sent">Sent</option>
                        <option value="Partially Received">Partially Received</option>
                        <option value="Received">Received</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Promised Delivery Date</label>
                      <input 
                        type="date" 
                        value={formData.deliveryDate}
                        onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })}
                        className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-white/60 text-slate-600 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    {editingOrder ? "Save Changes" : "Create Purchase Order"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
