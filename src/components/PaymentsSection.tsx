import React, { useState, useEffect } from "react";
import { 
  CreditCard, Search, RefreshCw, ChevronLeft, ChevronRight, 
  MoreVertical, ShieldCheck, AlertCircle, Plus, Edit2, Trash2, X, Check, CheckCircle2
} from "lucide-react";
import { PaymentItem } from "../data/dashboardData";
import SkeletonLoader from "./SkeletonLoader";
import { usePayments } from "../hooks/usePayments";
import { usePurchaseOrders } from "../hooks/usePurchaseOrders";
import { useAuth } from "../context/AuthContext";

interface PaymentsSectionProps {
  activeModal: string | null;
  onCloseModal: () => void;
  onShowToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export default function PaymentsSection({ activeModal, onCloseModal, onShowToast }: PaymentsSectionProps) {
  const { permissions } = useAuth();
  const { payments, loading, error, refreshPayments, addPayment, updatePayment, deletePayment } = usePayments();
  const { purchaseOrders, refreshPurchaseOrders } = usePurchaseOrders();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingUuid, setEditingUuid] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<PaymentItem>>({
    purchase_order_id: "",
    amount_paid: 0,
    dueDate: new Date().toISOString().split("T")[0],
    method: "Wire Transfer",
    status: "Pending"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 5;

  useEffect(() => {
    if (activeModal === "createPayment") {
      handleOpenAddModal();
    }
  }, [activeModal]);

  const handleOpenAddModal = () => {
    setModalMode("add");
    setEditingUuid(null);
    setFormData({
      purchase_order_id: "",
      amount_paid: 0,
      dueDate: new Date().toISOString().split("T")[0],
      method: "Wire Transfer",
      status: "Pending"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: PaymentItem) => {
    setModalMode("edit");
    setEditingUuid(p.uuid || null);
    setFormData({
      purchase_order_id: p.purchase_order_id || "",
      amount_paid: p.amount_paid || 0,
      dueDate: p.dueDate || new Date().toISOString().split("T")[0],
      method: p.method,
      status: p.status
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleCloseModalInternal = () => {
    setIsModalOpen(false);
    onCloseModal(); // notify parent
  };

  const handlePurchaseOrderSelect = (poUuid: string) => {
    const po = purchaseOrders.find(p => p.uuid === poUuid || p.id === poUuid);
    if (po) {
      setFormData(prev => ({
        ...prev,
        purchase_order_id: poUuid,
        purchase_order_number: po.id, // Display only
        vendorName: po.vendorName,
        amount_paid: typeof po.amount === 'string' ? parseFloat(po.amount.replace(/[^0-9.-]+/g,"")) : (po.amount || 0),
        dueDate: po.deliveryDate || prev.dueDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        purchase_order_id: poUuid
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (modalMode === "add") {
        await addPayment(formData);
        onShowToast(`Created payment record successfully!`, "success");
      } else {
        if (!editingUuid) throw new Error("Missing UUID for update");
        await updatePayment(editingUuid, formData);
        onShowToast(`Updated payment record successfully!`, "success");
      }
      handleCloseModalInternal();
    } catch (err: any) {
      onShowToast(`Failed to ${modalMode} payment: ${err.message}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (uuid: string, invoiceId: string) => {
    if (!confirm(`Are you sure you want to delete payment ${invoiceId}?`)) return;
    try {
      await deletePayment(uuid);
      onShowToast(`Deleted payment ${invoiceId} successfully.`, "success");
    } catch (err: any) {
      onShowToast(`Failed to delete payment: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const handleProcessPayment = async (uuid: string, vendor: string, amount: string) => {
    try {
      await updatePayment(uuid, { status: "Paid" });
      onShowToast(`Dispatched secure bank instruction to clear ${amount} invoice to ${vendor}.`, "success");
    } catch (err: any) {
      onShowToast(`Failed to authorize payment: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.invoiceId.toLowerCase().includes(search.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage) || 1;
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-indigo-500" />
            <span>Sourcing Billing & Payments Ledger</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Settle outstanding raw material acquisition bills, wire transfers, and tax reconciliation records.</p>
        </div>
        {permissions?.canManagePayments && (
          <button 
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-900/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Payment</span>
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
            placeholder="Search payment ID, invoice, or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Settlement status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-white/60 bg-white/60 text-slate-800 focus:outline-none"
          >
            <option value="All">All Transactions</option>
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending Authorized</option>
            <option value="Overdue">Overdue</option>
          </select>
          
          <button 
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              refreshPayments();
              refreshPurchaseOrders();
              onShowToast("Filters reset and payments refreshed.", "info");
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
              onClick={refreshPayments} 
              className="mt-2 w-fit text-xs font-semibold px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="border border-white/60 rounded-2xl bg-white/50 backdrop-blur-2xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/60 bg-white/60/25 backdrop-blur-md text-[11px] font-extrabold text-slate-800 uppercase tracking-widest sticky top-0 z-10">
                <th className="py-4 px-5">Invoice Reference</th>
                <th className="py-4 px-5">PO Reference</th>
                <th className="py-4 px-5">Vendor Partner</th>
                <th className="py-4 px-5 text-right">Acquisition Total</th>
                <th className="py-4 px-5">Due Date</th>
                <th className="py-4 px-5">Settle Method</th>
                <th className="py-4 px-5">Settlement Status</th>
                {permissions?.canManagePayments && <th className="py-4 px-5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-32 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-20 rounded ml-auto" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-5 w-16 rounded" /></td>
                    {permissions?.canManagePayments && <td className="py-4 px-5"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>}
                  </tr>
                ))
              ) : paginatedPayments.length > 0 ? (
                paginatedPayments.map((p) => (
                  <tr 
                    key={p.uuid || p.id}
                    className="hover:bg-white/60/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5 font-extrabold text-slate-950 text-sm">{p.invoiceId}</td>
                    <td className="py-4 px-5 font-medium text-slate-500 text-xs">{p.purchase_order_number}</td>
                    <td className="py-4 px-5 font-semibold text-slate-800 text-sm">{p.vendorName}</td>
                    <td className="py-4 px-5 text-right font-extrabold font-mono text-slate-900 text-sm">{p.amount}</td>
                    <td className="py-4 px-5 font-medium text-slate-600 text-xs">{p.dueDate}</td>
                    <td className="py-4 px-5 font-medium text-slate-600 text-sm">{p.method}</td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded shadow-sm text-[11px] font-bold tracking-widest uppercase border ${
                        p.status === "Paid" 
                          ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
                          : p.status === "Processing"
                            ? "bg-indigo-500/10 text-indigo-800 border-indigo-500/20"
                            : p.status === "Pending"
                              ? "bg-amber-500/10 text-amber-800 border-amber-500/20"
                              : p.status === "Unpaid"
                              ? "bg-slate-500/10 text-slate-700 border-slate-500/20"
                              : "bg-rose-500/10 text-rose-800 border-rose-500/20"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    {permissions?.canManagePayments && (
                      <td className="py-4 px-5 text-center">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenuId === p.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-white/60 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                              {p.status !== "Paid" && p.uuid && (
                                <button
                                  onClick={() => handleProcessPayment(p.uuid as string, p.vendorName, p.amount)}
                                  className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-emerald-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                                >
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  <span>Authorize Payment</span>
                                </button>
                              )}
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Edit Payment</span>
                              </button>
                              {p.uuid && (
                                <button
                                  onClick={() => handleDelete(p.uuid as string, p.invoiceId)}
                                  className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              )}
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
                    No payment logs match your filters.
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={handleCloseModalInternal} />
          <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(168,85,247,0.2),inset_0_0_0_1px_rgba(255,255,255,0.6)] border border-white/50 rounded-[32px] p-8 overflow-hidden animate-slideUp">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[22px] font-extrabold text-slate-900 font-display tracking-tight">
                  {modalMode === "add" ? "Record Payment" : "Edit Payment"}
                </h3>
              </div>
              <button 
                onClick={handleCloseModalInternal}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
              
              <div className="flex flex-col gap-1.5">
                <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Linked Purchase Order</label>
                <select
                  required
                  value={formData.purchase_order_id}
                  onChange={(e) => handlePurchaseOrderSelect(e.target.value)}
                  className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                >
                  <option value="" disabled>Select a Purchase Order...</option>
                  {purchaseOrders.map((po) => (
                    <option key={po.uuid || po.id} value={po.uuid || po.id}>
                      {po.id} - {po.vendorName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Vendor</label>
                <input 
                  type="text" 
                  readOnly 
                  value={formData.vendorName || "Auto-populated"} 
                  className="w-full bg-slate-100 border border-slate-200 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-500 focus:outline-none cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Amount Paid ($)</label>
                  <input 
                    required
                    type="number"
                    min="0"
                    step="any"
                    value={formData.amount_paid}
                    onChange={e => setFormData({ ...formData, amount_paid: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Due Date</label>
                  <input 
                    required
                    type="date"
                    value={formData.dueDate}
                    onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Payment Method</label>
                  <select
                    required
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value as any })}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  >
                    <option value="ACH">ACH</option>
                    <option value="ACH Transfer">ACH Transfer</option>
                    <option value="Wire">Wire</option>
                    <option value="Wire Transfer">Wire Transfer</option>
                    <option value="Check">Check</option>
                    <option value="Credit Card">Credit Card</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Status</label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Disputed">Disputed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-200/60 mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModalInternal}
                  className="px-5 py-3.5 rounded-[14px] text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-transparent border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="payment-form"
                  disabled={isSubmitting}
                  className="relative rounded-[14px] bg-gradient-to-r from-[#9444ff] to-[#bd44ff] text-white font-bold py-3.5 px-6 shadow-[0_8px_20px_rgba(168,85,247,0.4)] focus:outline-none flex items-center justify-center gap-2 group overflow-hidden cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 text-[13px]">
                    {modalMode === "add" ? "Record Payment" : "Save Changes"}
                  </span>
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin relative z-10" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
            </form>
            
          </div>
        </div>
      )}

    </div>
  );
}
