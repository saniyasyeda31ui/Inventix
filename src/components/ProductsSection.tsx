import React, { useState } from "react";
import {
  Search, Filter, Plus, ChevronDown, MoreVertical, Edit2, Trash2,
  RefreshCw, ChevronLeft, ChevronRight, Check, CheckCircle2, Box, AlertCircle, X
} from "lucide-react";
import { ProductItem } from "../data/dashboardData";
import { HighlightText, SortIndicator, EmptyState } from "./TableUX";
import SkeletonLoader from "./SkeletonLoader";
import { useProducts } from "../hooks/useProducts";
import { useVendors } from "../hooks/useVendors";
import { formatCurrency } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

interface ProductsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info" | "warning" | "error") => void;
  onOpenModal: (modalName: string) => void;
  activeModal?: string | null;
  onCloseModal?: () => void;
}

export default function ProductsSection({ onShowToast, onOpenModal, activeModal, onCloseModal }: ProductsSectionProps) {
  const { permissions } = useAuth();
  const { products, setProducts, loading, error, refreshProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const { vendors } = useVendors();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const showAddModal = isAddModalOpen || activeModal === "addProduct";

  // Form states
  const initialFormState = { name: "", sku: "", category: "Bulk Materials", unitPrice: 0, leadTimeDays: 7, primaryVendor: "", stockStatus: "In Stock" as "In Stock" | "Low Stock" | "Out of Stock" | "Discontinued" };
  const [formData, setFormData] = useState(initialFormState);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price" | "leadTime">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 6;

  // Unique categories list
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const statuses = ["All", "In Stock", "Low Stock", "Out of Stock"];

  const toggleSort = (type: "name" | "price" | "leadTime") => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("asc");
    }
    onShowToast(`Sorted products by ${type} (${sortOrder === "asc" ? "descending" : "ascending"})`, "info");
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      await deleteProduct(id);
      onShowToast(`Deleted ${name} from inventory catalog.`, "success");
    } catch (err: any) {
      onShowToast(`Failed to delete ${name}: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const handleUpdateStatus = async (id: string, nextStatus: any) => {
    try {
      await updateProduct(id, { stockStatus: nextStatus });
      onShowToast(`Updated product status to ${nextStatus}`, "success");
    } catch (err: any) {
      onShowToast(`Failed to update status: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const handleEditClick = (p: ProductItem) => {
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      unitPrice: p.unitPrice,
      leadTimeDays: p.leadTimeDays,
      primaryVendor: p.primaryVendor,
      stockStatus: p.stockStatus
    });
    setEditingProductId(p.id);
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.sku) return onShowToast("Please fill out name and SKU", "error");
    if (!formData.primaryVendor) return onShowToast("Please select a vendor", "error");
    try {
      await addProduct(formData);
      onShowToast(`Successfully registered ${formData.name}!`, "success");
      setIsAddModalOpen(false);
      onCloseModal?.();
      setFormData(initialFormState);
    } catch (err: any) {
      onShowToast(`Failed to add product: ${err.message}`, "error");
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductId) return;
    try {
      await updateProduct(editingProductId, formData);
      onShowToast(`Successfully updated ${formData.name}!`, "success");
      setIsEditModalOpen(false);
      setEditingProductId(null);
      setFormData(initialFormState);
    } catch (err: any) {
      onShowToast(`Failed to update product: ${err.message}`, "error");
    }
  };



  const handleRowClick = (product: ProductItem) => {
    onShowToast(`Selected product: ${product.name} (SKU: ${product.sku}) - Lead time ${product.leadTimeDays} days.`, "info");
  };

  // Filter & Sort logic
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.primaryVendor.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || p.stockStatus === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    let comp = 0;
    if (sortBy === "name") comp = a.name.localeCompare(b.name);
    else if (sortBy === "price") comp = a.unitPrice - b.unitPrice;
    else if (sortBy === "leadTime") comp = a.leadTimeDays - b.leadTimeDays;
    return sortOrder === "asc" ? comp : -comp;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <Box className="w-7 h-7 text-indigo-500" />
            <span>Product Catalog</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Manage global manufactured materials, SKUs, and default sourcing settings.</p>
        </div>
        {permissions?.canManageInventory && (
          <button
            onClick={() => {
              setFormData(initialFormState);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Product</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-2xl flex flex-col md:flex-row gap-4 justify-between items-center">

        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search name, SKU, or supplier..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm font-medium rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors shadow-sm"
          />
        </div>

        {/* Multi-Selectors */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/60 bg-white/60 text-slate-800 hover:bg-white/80 focus:outline-none transition-colors cursor-pointer shadow-sm"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-white/60 bg-white/60 text-slate-800 hover:bg-white/80 focus:outline-none transition-colors cursor-pointer shadow-sm"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
              setSelectedStatus("All");
              setCurrentPage(1);
              refreshProducts();
              onShowToast("Filters reset and data refreshed.", "info");
            }}
            className="p-1.5 rounded-lg border border-white/60 bg-white/60 hover:bg-white/80 text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center group shadow-sm"
            title="Reset Filters & Refresh"
          >
            <RefreshCw className={`w-4 h-4 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
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
              onClick={refreshProducts}
              className="mt-2 w-fit text-xs font-semibold px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Enterprise Products Table */}
      <div className="border border-white/60 rounded-2xl bg-white/50 backdrop-blur-2xl overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/60 bg-white/60/25 backdrop-blur-md text-[11px] font-bold text-slate-600 uppercase tracking-widest sticky top-0 z-10">
                <th className="py-4 px-5">ID / SKU</th>
                <th className="py-4 px-5 cursor-pointer hover:text-slate-900 select-none group" onClick={() => toggleSort("name")}>
                  <div className="flex items-center gap-1.5">Product Name <SortIndicator active={sortBy === "name"} order={sortOrder} /></div>
                </th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5 cursor-pointer hover:text-slate-900 select-none text-right group" onClick={() => toggleSort("price")}>
                  <div className="flex items-center justify-end gap-1.5">Unit Price <SortIndicator active={sortBy === "price"} order={sortOrder} /></div>
                </th>
                <th className="py-4 px-5 cursor-pointer hover:text-slate-900 select-none text-center group" onClick={() => toggleSort("leadTime")}>
                  <div className="flex items-center justify-center gap-1.5">Lead Time <SortIndicator active={sortBy === "leadTime"} order={sortOrder} /></div>
                </th>
                <th className="py-4 px-5">Primary Vendor</th>
                <th className="py-4 px-5">Status</th>
                {permissions?.canManageInventory && <th className="py-4 px-5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="py-4 px-5"><SkeletonLoader className="h-8 w-24 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-32 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-16 rounded ml-auto" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-16 rounded mx-auto" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-28 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-5 w-16 rounded" /></td>
                    {permissions?.canManageInventory && <td className="py-4 px-5"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>}
                  </tr>
                ))
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => handleRowClick(p)}
                    className="hover:bg-white/60/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5">
                      <span className="text-slate-900 font-medium block text-xs">
                        <HighlightText text={p.id} search={search} />
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        <HighlightText text={p.sku} search={search} />
                      </span>
                    </td>
                    <td className="py-4 px-5 font-bold text-slate-950 text-sm">
                      <HighlightText text={p.name} search={search} />
                    </td>
                    <td className="py-4 px-5 text-slate-600 text-sm font-medium">{p.category}</td>
                    <td className="py-4 px-5 text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(p.unitPrice)}
                    </td>
                    <td className="py-4 px-5 text-center font-medium text-slate-700 text-sm">
                      {p.leadTimeDays} days
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-700 text-sm">
                      <HighlightText text={p.primaryVendor} search={search} />
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-md text-[11px] font-semibold tracking-wide border ${p.stockStatus === "In Stock"
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                        : p.stockStatus === "Low Stock"
                          ? "bg-amber-500/10 text-amber-700 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-700 border-rose-500/20"
                        }`}>
                        {p.stockStatus}
                      </span>
                    </td>
                    {permissions?.canManageInventory && (
                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === p.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-white/60 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                              <button
                                onClick={() => handleUpdateStatus(p.id, "In Stock")}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Set In Stock</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(p.id, "Low Stock")}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Check className="w-3.5 h-3.5 text-amber-500" />
                                <span>Set Low Stock</span>
                              </button>
                              <button
                                onClick={() => handleEditClick(p)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Edit Details</span>
                              </button>
                              <div className="h-px bg-slate-800 my-1" />
                              <button
                                onClick={() => handleDelete(p.id, p.name)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Product</span>
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
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <EmptyState
                      icon={Box}
                      title="No matching components found"
                      description={`Your query for "${search || selectedCategory}" didn't return any ERP materials. Broaden your search parameters or check filter conditions.`}
                      actionLabel="Reset All Filters"
                      onAction={() => {
                        setSearch("");
                        setSelectedCategory("All");
                        setSelectedStatus("All");
                        setCurrentPage(1);
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="p-4 border-t border-white/60 bg-white/40 backdrop-blur-md flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500">
            Showing <span className="font-bold text-slate-700">{indexOfFirstItem() + 1}-{Math.min(indexOfLastItem(), filteredProducts.length)}</span> of <span className="font-bold text-slate-700">{filteredProducts.length}</span> entries
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

      {/* Add / Edit Modals */}
      {(showAddModal || isEditModalOpen) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); onCloseModal?.(); }} />
          <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(168,85,247,0.2),inset_0_0_0_1px_rgba(255,255,255,0.6)] border border-white/50 rounded-[32px] p-8 overflow-hidden animate-slideUp">
            <form onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-5">

              <div className="flex items-center justify-between pb-4 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Box className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-[22px] font-extrabold text-slate-900 font-display tracking-tight">
                    {isEditModalOpen ? "Edit Product" : "Add Product"}
                  </h3>
                </div>
                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); onCloseModal?.(); }} className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-2">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Product Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Industrial Steel Valve" className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">SKU</label>
                    <input required type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g. VAL-001" className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Category</label>
                    <input required type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Components" className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Unit Price ($)</label>
                    <input required type="number" min="0" step="any" value={formData.unitPrice} onChange={e => setFormData({ ...formData, unitPrice: Number(e.target.value) })} placeholder="0.00" className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Lead Time (Days)</label>
                    <input required type="number" min="0" value={formData.leadTimeDays} onChange={e => setFormData({ ...formData, leadTimeDays: Number(e.target.value) })} placeholder="14" className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase">Primary Vendor</label>
                  <select
                    required
                    value={formData.primaryVendor}
                    onChange={e => setFormData({ ...formData, primaryVendor: e.target.value })}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  >
                    <option value="" disabled>Select a Vendor</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.uuid}>{v.name}</option>
                    ))}
                  </select>
                  {vendors.length === 0 && (
                    <p className="text-[10px] text-rose-500 font-medium ml-1">You must add a vendor first before creating products.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/60 mt-6">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); onCloseModal?.(); }} className="px-5 py-3.5 rounded-[14px] text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-transparent border border-slate-200 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="relative rounded-[14px] bg-gradient-to-r from-[#9444ff] to-[#bd44ff] text-white font-bold py-3.5 px-6 shadow-[0_8px_20px_rgba(168,85,247,0.4)] focus:outline-none flex items-center justify-center gap-2 group overflow-hidden cursor-pointer">
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 text-[13px]">{isEditModalOpen ? "Save Changes" : "Add Product"}</span>
                  <CheckCircle2 className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );

  function indexOfFirstItem() {
    return (currentPage - 1) * itemsPerPage;
  }
  function indexOfLastItem() {
    return currentPage * itemsPerPage;
  }
}
