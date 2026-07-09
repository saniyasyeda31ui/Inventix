import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, Search, Filter, Plus, FileSpreadsheet, ThumbsUp, 
  ThumbsDown, ChevronLeft, ChevronRight, RefreshCw, MoreVertical, Send, AlertCircle, Edit2, Trash2, X
} from "lucide-react";
import { PurchaseRequest } from "../data/dashboardData";
import SkeletonLoader from "./SkeletonLoader";
import { usePurchaseRequests } from "../hooks/usePurchaseRequests";
import { useProducts } from "../hooks/useProducts";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface PurchaseRequestsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
  onOpenModal: (modalName: string) => void;
  activeModal?: string | null;
  onCloseModal?: () => void;
}

export default function PurchaseRequestsSection({ onShowToast, onOpenModal, activeModal, onCloseModal }: PurchaseRequestsSectionProps) {
  const { permissions } = useAuth();
  const { purchaseRequests: requests, loading, error, refreshPurchaseRequests, addPurchaseRequest, updatePurchaseRequest, deletePurchaseRequest } = usePurchaseRequests();
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Modal State handling
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<PurchaseRequest | null>(null);

  useEffect(() => {
    if (activeModal === "createRequest") {
      setIsModalOpen(true);
      setEditingRequest(null);
      setFormData({
        product_id: "",
        item: "",
        quantity: 1,
        estimated_cost: 0,
        department: "Operations",
        supplier: "Global Plastics Corp",
        priority: "Medium",
        expectedDelivery: new Date().toISOString().split('T')[0]
      });
      if (onCloseModal) onCloseModal();
    }
  }, [activeModal, onCloseModal]);

  const [formData, setFormData] = useState<Partial<PurchaseRequest>>({
    product_id: "",
    item: "",
    quantity: 1,
    estimated_cost: 0,
    department: "Operations",
    supplier: "Global Plastics Corp",
    priority: "Medium",
    expectedDelivery: new Date().toISOString().split('T')[0]
  });

  const openAddModal = () => {
    setFormData({
      product_id: "",
      item: "",
      quantity: 1,
      estimated_cost: 0,
      department: "Operations",
      supplier: "Global Plastics Corp",
      priority: "Medium",
      expectedDelivery: new Date().toISOString().split('T')[0]
    });
    setEditingRequest(null);
    setIsModalOpen(true);
  };

  const openEditModal = (req: PurchaseRequest) => {
    setFormData({
      product_id: req.product_id || "",
      item: req.item || "",
      quantity: req.quantity || 1,
      estimated_cost: req.estimated_cost || 0,
      department: req.department || "Operations",
      supplier: req.supplier || "Global Plastics Corp",
      priority: req.priority as any || "Medium",
      expectedDelivery: req.expectedDelivery || ""
    });
    setEditingRequest(req);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = async (id: string) => {
    setActiveMenuId(null);
    if (!window.confirm("Are you sure you want to delete this purchase request?")) return;
    try {
      await deletePurchaseRequest(id);
      onShowToast("Purchase request deleted", "success");
    } catch (err: any) {
      onShowToast(`Failed to delete: ${err.message}`, "info");
    }
  };

  const handleApprove = async (id: string) => {
    setActiveMenuId(null);
    try {
      await updatePurchaseRequest(id, { status: "Approved" });
      onShowToast(`Approved Purchase Request ${id}`, "success");
    } catch (err: any) {
      onShowToast(`Failed to approve: ${err.message}`, "info");
    }
  };

  const handleReject = async (id: string) => {
    setActiveMenuId(null);
    try {
      await updatePurchaseRequest(id, { status: "Rejected" });
      onShowToast(`Rejected Purchase Request ${id}`, "success");
    } catch (err: any) {
      onShowToast(`Failed to reject: ${err.message}`, "info");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_id) {
      onShowToast("Please select a product", "info");
      return;
    }
    try {
      const selectedProduct = products.find(p => p.id === formData.product_id);
      const submitData = { ...formData, item: selectedProduct ? selectedProduct.name : formData.item };

      if (editingRequest) {
        await updatePurchaseRequest(editingRequest.id, submitData);
        onShowToast("Purchase request updated", "success");
      } else {
        await addPurchaseRequest(submitData);
        onShowToast("Purchase request created", "success");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      onShowToast(`Error: ${err.message}`, "info");
    }
  };

  const itemsPerPage = 5;

  const filteredRequests = requests.filter(r => {
    const matchesSearch = 
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.requestedBy.toLowerCase().includes(search.toLowerCase()) ||
      r.item.toLowerCase().includes(search.toLowerCase()) ||
      r.supplier.toLowerCase().includes(search.toLowerCase());

    const matchesPriority = priorityFilter === "All" || r.priority === priorityFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / itemsPerPage));
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-indigo-500" />
            <span>Purchase Requests Registry</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Review internal acquisition requests, department requisitions, and priority-level authorizations.</p>
        </div>
        {permissions?.canManagePurchaseRequests && (
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Acquisition Request</span>
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
            placeholder="Search request ID, requester, or material..."
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
            <Filter className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-xs text-slate-800 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-xs text-slate-800 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button 
            onClick={refreshPurchaseRequests} 
            className="p-2 rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Main Table View */}
      <div className="border border-white/60 rounded-2xl bg-white/50 backdrop-blur-2xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/60 bg-white/60/25 backdrop-blur-md text-[11px] font-extrabold text-slate-800 uppercase tracking-widest sticky top-0 z-10">
                <th className="py-4 px-5">Request ID</th>
                <th className="py-4 px-5">Requested Item</th>
                <th className="py-4 px-5">Requester / Dept</th>
                <th className="py-4 px-5">Intended Vendor</th>
                <th className="py-4 px-5 text-right">Amount</th>
                <th className="py-4 px-5 text-center">Priority</th>
                <th className="py-4 px-5">Status</th>
                {permissions?.canManagePurchaseRequests && <th className="py-4 px-5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-32 rounded" /></td>
                    <td className="py-4 px-5">
                      <div className="space-y-1.5">
                        <SkeletonLoader className="h-3 w-28 rounded" />
                        <SkeletonLoader className="h-2 w-20 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-28 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-16 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-5 w-16 rounded mx-auto" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-5 w-16 rounded" /></td>
                    {permissions?.canManagePurchaseRequests && <td className="py-4 px-5"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>}
                  </tr>
                ))
              ) : paginatedRequests.length > 0 ? (
                paginatedRequests.map((r) => (
                  <tr 
                    key={r.id}
                    className="hover:bg-white/60/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5 font-extrabold text-slate-950 text-sm">{r.id}</td>
                    <td className="py-4 px-5 font-semibold text-slate-800 text-sm">{r.item} <span className="text-slate-500 font-medium ml-1">x{r.quantity || 1}</span></td>
                    <td className="py-4 px-5">
                      <span className="text-slate-800 font-medium text-sm block">{r.requestedBy}</span>
                      <span className="text-[11px] text-slate-500 font-medium block mt-0.5">{r.department}</span>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-600 text-sm">{r.supplier}</td>
                    <td className="py-4 px-5 text-right font-extrabold font-mono text-slate-900 text-sm">{r.amount}</td>
                    <td className="py-4 px-5 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded shadow-sm text-[11px] font-bold tracking-widest uppercase border ${
                        r.priority === "Critical" 
                          ? "bg-rose-500/10 text-rose-800 border-rose-500/20"
                          : r.priority === "High"
                            ? "bg-amber-500/10 text-amber-800 border-amber-500/20"
                            : r.priority === "Medium"
                              ? "bg-indigo-500/10 text-indigo-800 border-indigo-500/20"
                              : "bg-slate-500/10 text-slate-700 border-slate-500/20"
                      }`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded shadow-sm text-[11px] font-bold tracking-widest uppercase border ${
                        r.status === "Approved" 
                          ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
                          : r.status === "Pending"
                            ? "bg-amber-500/10 text-amber-800 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-800 border-rose-500/20"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    {permissions?.canManagePurchaseRequests && (
                      <td className="py-4 px-5 text-center">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === r.id ? null : r.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenuId === r.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-white/60 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                              <button
                                onClick={() => openEditModal(r)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Edit Request</span>
                              </button>
                              <button
                                onClick={() => handleApprove(r.id)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Approve Request</span>
                              </button>
                              <button
                                onClick={() => handleReject(r.id)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <ThumbsDown className="w-3.5 h-3.5 text-amber-500" />
                                <span>Reject Request</span>
                              </button>
                              <div className="h-px bg-slate-800 my-1" />
                              <button
                                onClick={() => handleDelete(r.id)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Request</span>
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
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No acquisition requests matched your criteria.
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

      {/* CRUD Modal for Purchase Requests */}
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
                    <ShoppingBag className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {editingRequest ? "Edit Purchase Request" : "Create Purchase Request"}
                    </h3>
                  </div>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-semibold uppercase tracking-wider block">Requested Product</label>
                    <select 
                      required
                      value={formData.product_id}
                      onChange={e => setFormData({ ...formData, product_id: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 rounded-xl px-3 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">Select a Product</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Quantity</label>
                      <input 
                        required
                        type="number"
                        min="1"
                        value={formData.quantity}
                        onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                        className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Estimated Cost ($)</label>
                      <input 
                        required
                        type="number"
                        min="0"
                        step="any"
                        value={formData.estimated_cost}
                        onChange={e => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Target Supplier</label>
                      <select 
                        value={formData.supplier}
                        onChange={e => setFormData({ ...formData, supplier: e.target.value })}
                        className="w-full bg-white/60 border border-white/60 rounded-xl px-3 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Global Plastics Corp">Global Plastics Corp</option>
                        <option value="Intel Sourcing">Intel Sourcing</option>
                        <option value="SteelWorks Ltd">SteelWorks Ltd</option>
                        <option value="Belgrave Chemicals">Belgrave Chemicals</option>
                        <option value="Valves & Fittings Inc">Valves & Fittings Inc</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Requisition Priority</label>
                      <select 
                        value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full bg-white/60 border border-white/60 rounded-xl px-3 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Department Name</label>
                      <select 
                        value={formData.department}
                        onChange={e => setFormData({ ...formData, department: e.target.value })}
                        className="w-full bg-white/60 border border-white/60 rounded-xl px-3 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="Procurement">Procurement</option>
                        <option value="Operations">Operations</option>
                        <option value="Engineering">Engineering</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Logistics">Logistics</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-600 font-semibold uppercase tracking-wider block">Expected Delivery Target</label>
                      <input 
                        type="date" 
                        value={formData.expectedDelivery}
                        onChange={e => setFormData({ ...formData, expectedDelivery: e.target.value })}
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
                    {editingRequest ? "Save Changes" : "File Purchase Request"}
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
