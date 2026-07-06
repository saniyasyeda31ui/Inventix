import React, { useState } from "react";
import { Search, Plus, MoreVertical, Edit2, Trash2, 
  RefreshCw, ChevronLeft, ChevronRight, Box, AlertCircle, X, Info, FileText, Package, Truck, Activity
} from "lucide-react";
import { ProductItem } from "../data/dashboardData";
import { HighlightText, SortIndicator, EmptyState } from "./TableUX";
import SkeletonLoader from "./SkeletonLoader";
import { useProducts } from "../hooks/useProducts";
import { useVendors } from "../hooks/useVendors";
import { useWarehouses } from "../hooks/useWarehouses";
import { formatCurrency } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

interface ProductsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info" | "warning" | "error") => void;
  onOpenModal: (modalName: string) => void;
  activeModal?: string | null;
  onCloseModal?: () => void;
}

function getStockStatus(p: ProductItem) {
  if (p.currentStock === 0) return "Out of Stock";
  if (p.currentStock <= p.reorderLevel) return "Low Stock";
  return "In Stock";
}

export default function ProductsSection({ onShowToast, activeModal, onCloseModal }: ProductsSectionProps) {
  const { permissions } = useAuth();
  const { products, loading, error, refreshProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  const { vendors } = useVendors();
  const { warehouses } = useWarehouses();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  
  const showAddModal = isAddModalOpen || activeModal === "addProduct";

  // Form states
  const initialFormState = { 
    name: "", sku: "", category: "Bulk Materials", description: "", unit: "pcs", 
    unitPrice: 0, leadTimeDays: 7, vendorId: "", 
    initialStock: 0, reorderLevel: 50, safetyStock: 20, warehouseId: "", notes: ""
  };
  const [formData, setFormData] = useState(initialFormState);
  
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "price" | "leadTime">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 8;

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const statuses = ["All", "In Stock", "Low Stock", "Out of Stock"];

  const toggleSort = (type: "name" | "price" | "leadTime") => {
    if (sortBy === type) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("asc");
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      onShowToast(`Deleted ${productToDelete.product_name} from inventory catalog.`, "success");
    } catch (err: any) {
      onShowToast(`Failed to delete ${productToDelete.product_name}: ${err.message}`, "error");
    }
    setProductToDelete(null);
  };

  const handleEditClick = (p: ProductItem) => {
    setFormData({
      product_name: p.product_name,
      sku: p.sku || "",
      category: p.category,
      description: p.description || "",
      unit: p.unit,
      unitPrice: p.unitPrice,
      leadTimeDays: p.leadTimeDays,
      vendorId: p.vendorId,
      initialStock: p.currentStock, // just for viewing in edit, we won't submit initial stock on edit
      reorderLevel: p.reorderLevel,
      safetyStock: p.safetyStock,
      warehouseId: "", // can't edit initial warehouse once created easily from here
      notes: p.notes || ""
    });
    setEditingProductId(p.id);
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.product_name || !formData.category || !formData.unit || !formData.vendorId) {
      return onShowToast("Please fill out all required fields", "error");
    }
    try {
      await addProduct(
        {
          product_name: formData.product_name,
          sku: formData.sku,
          category: formData.category,
          description: formData.description,
          unit: formData.unit,
          unitPrice: formData.unitPrice,
          leadTimeDays: formData.leadTimeDays,
          vendorId: formData.vendorId,
          reorderLevel: formData.reorderLevel,
          safetyStock: formData.safetyStock,
          notes: formData.notes
        },
        formData.initialStock,
        formData.warehouseId
      );
      onShowToast(`Successfully registered ${formData.product_name}!`, "success");
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
      await updateProduct(editingProductId, {
        product_name: formData.product_name,
        sku: formData.sku,
        category: formData.category,
        description: formData.description,
        unit: formData.unit,
        unitPrice: formData.unitPrice,
        leadTimeDays: formData.leadTimeDays,
        vendorId: formData.vendorId,
        reorderLevel: formData.reorderLevel,
        safetyStock: formData.safetyStock,
        notes: formData.notes
      });
      onShowToast(`Successfully updated ${formData.product_name}!`, "success");
      setIsEditModalOpen(false);
      setEditingProductId(null);
      setFormData(initialFormState);
    } catch (err: any) {
      onShowToast(`Failed to update product: ${err.message}`, "error");
    }
  };

  // Filter & Sort logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.product_id?.toLowerCase().includes(search.toLowerCase()) ||
      p.product_name?.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      p.primaryVendor?.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || getStockStatus(p) === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  }).sort((a, b) => {
    let comp = 0;
    if (sortBy === "name") comp = a.product_name.localeCompare(b.product_name);
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
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Box className="w-5 h-5 text-indigo-400" />
            <span>Product Catalog</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage global manufactured materials, SKUs, and default sourcing settings.</p>
        </div>
        {permissions?.canManageInventory && (
          <button
            onClick={() => {
              setFormData({ ...initialFormState, vendorId: vendors[0]?.uuid || "", warehouseId: warehouses[0]?.uuid || "" });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Register Product</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl border border-slate-900 bg-[#040815] flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search ID, Name, SKU, Vendor..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-900 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button 
            onClick={() => {
              setSearch(""); setSelectedCategory("All"); setSelectedStatus("All"); setCurrentPage(1); refreshProducts();
              onShowToast("Filters reset and data refreshed.", "info");
            }}
            className="p-1.5 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900/60 text-slate-400 hover:text-white text-xs transition-colors"
            title="Reset Filters & Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

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
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/25 text-[10px] font-mono text-slate-500 uppercase tracking-wider sticky top-0 backdrop-blur-md">
                <th className="py-3 px-4">Product ID</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white select-none" onClick={() => toggleSort("name")}>
                  Product Name <SortIndicator active={sortBy === "name"} order={sortOrder} />
                </th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Current Stock</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white select-none text-right" onClick={() => toggleSort("price")}>
                  Unit Price <SortIndicator active={sortBy === "price"} order={sortOrder} />
                </th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white select-none text-center" onClick={() => toggleSort("leadTime")}>
                  Lead Time <SortIndicator active={sortBy === "leadTime"} order={sortOrder} />
                </th>
                <th className="py-3 px-4">Primary Vendor</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-slate-900/40">
                    <td className="py-4 px-4"><SkeletonLoader className="h-6 w-20 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-32 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-12 rounded ml-auto" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-16 rounded ml-auto" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-5 w-16 rounded mx-auto" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-16 rounded mx-auto" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-28 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>
                  </tr>
                ))
              ) : paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => {
                  const status = getStockStatus(p);
                  return (
                    <tr 
                      key={p.id}
                      onClick={() => setViewingProduct(p)}
                      className="border-b border-slate-900/40 hover:bg-slate-950/30 transition-all cursor-pointer text-xs"
                    >
                      <td className="py-3.5 px-4 font-mono">
                        <span className="text-indigo-400/90 font-bold block">
                          <HighlightText text={p.product_id} search={search} />
                        </span>
                        {p.sku && (
                          <span className="text-[9px] text-slate-500 block">
                            SKU: <HighlightText text={p.sku} search={search} />
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        <HighlightText text={p.product_name} search={search} />
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{p.category}</td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-200">
                        {p.currentStock.toLocaleString()} <span className="text-slate-500 text-[10px]">{p.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-200">
                        {formatCurrency(p.unitPrice)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase hover-glow-subtle ${
                          status === "In Stock" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" :
                          status === "Low Stock" ? "bg-amber-500/10 text-amber-400 border border-amber-500/10" :
                          "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {p.leadTimeDays} Days
                      </td>
                      <td className="py-3.5 px-4 text-slate-300 font-medium">
                        <HighlightText text={p.primaryVendor} search={search} />
                      </td>
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                            className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenuId === p.id && (
                            <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-slate-900 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                              <button onClick={() => { setViewingProduct(p); setActiveMenuId(null); }} className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5">
                                <Info className="w-3.5 h-3.5 text-indigo-400" /> <span>View Details</span>
                              </button>
                              {permissions?.canManageInventory && (
                                <>
                                  <button onClick={() => handleEditClick(p)} className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5">
                                    <Edit2 className="w-3.5 h-3.5 text-indigo-400" /> <span>Edit Product</span>
                                  </button>
                                  <div className="h-px bg-slate-900 my-1" />
                                  <button onClick={() => { setProductToDelete(p); setActiveMenuId(null); }} className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5">
                                    <Trash2 className="w-3.5 h-3.5" /> <span>Delete Product</span>
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <EmptyState 
                      icon={Box}
                      title="No matching components found"
                      description={`Your query for "${search || selectedCategory}" didn't return any ERP materials. Broaden your search parameters or check filter conditions.`}
                      actionLabel="Reset All Filters"
                      onAction={() => {
                        setSearch(""); setSelectedCategory("All"); setSelectedStatus("All"); setCurrentPage(1);
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-900 bg-slate-950/20 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-300 px-2">Page {currentPage} of {totalPages}</span>
            <button onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Register / Edit Product Modal */}
      {(showAddModal || isEditModalOpen) && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); onCloseModal?.(); }} />
          <div className="relative w-full max-w-2xl bg-[#050914] border border-slate-900 rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh] animate-slideUp">
            
            <div className="flex items-center justify-between p-5 border-b border-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Box className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{isEditModalOpen ? "Edit Product Details" : "Register Product SKU"}</h3>
                  <p className="text-[10px] text-slate-500">
                    {isEditModalOpen ? `Editing ${formData.product_name}` : "Product ID will be automatically generated."}
                  </p>
                </div>
              </div>
              <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); onCloseModal?.(); }} className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              <form id="productForm" onSubmit={isEditModalOpen ? handleEditSubmit : handleAddSubmit} className="space-y-6">
                
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Product Name *</label>
                      <input required type="text" value={formData.product_name || ""} onChange={e => setFormData({ ...formData, product_name: e.target.value })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">SKU (Optional)</label>
                      <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Category *</label>
                      <input required type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Unit of Measure *</label>
                      <input required type="text" placeholder="e.g. pcs, kg, m" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Description</label>
                      <textarea rows={2} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none resize-none" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-900" />

                {/* Inventory */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Package className="w-3.5 h-3.5" /> Inventory Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!isEditModalOpen && (
                      <>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Initial Stock *</label>
                          <input required type="number" min="0" value={formData.initialStock} onChange={e => setFormData({ ...formData, initialStock: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Warehouse *</label>
                          <select required value={formData.warehouseId} onChange={e => setFormData({ ...formData, warehouseId: e.target.value })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none">
                            {warehouses.map(w => <option key={w.uuid} value={w.uuid}>{w.name}</option>)}
                          </select>
                        </div>
                      </>
                    )}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Reorder Level *</label>
                      <input required type="number" min="0" value={formData.reorderLevel} onChange={e => setFormData({ ...formData, reorderLevel: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Safety Stock *</label>
                      <input required type="number" min="0" value={formData.safetyStock} onChange={e => setFormData({ ...formData, safetyStock: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-900" />

                {/* Procurement */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-3.5 h-3.5" /> Procurement
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Primary Vendor *</label>
                      <select required value={formData.vendorId} onChange={e => setFormData({ ...formData, vendorId: e.target.value })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none">
                        {vendors.map(v => <option key={v.uuid} value={v.uuid}>{v.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Unit Price ($) *</label>
                      <input required type="number" min="0" step="any" value={formData.unitPrice} onChange={e => setFormData({ ...formData, unitPrice: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Lead Time (Days) *</label>
                      <input required type="number" min="0" value={formData.leadTimeDays} onChange={e => setFormData({ ...formData, leadTimeDays: Number(e.target.value) })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Additional Notes</label>
                      <input type="text" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-slate-950/50 border border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none" />
                    </div>
                  </div>
                </div>

              </form>
            </div>
            
            <div className="p-4 border-t border-slate-900 bg-slate-950/40 flex items-center justify-end gap-3 rounded-b-2xl">
              <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); onCloseModal?.(); }} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
              <button type="submit" form="productForm" className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer">
                {isEditModalOpen ? "Save Changes" : "Register Product"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Details Drawer */}
      {viewingProduct && (
        <div className="fixed inset-0 z-[120] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setViewingProduct(null)} />
          <div className="relative w-full max-w-md bg-[#050914] border-l border-slate-900 h-full shadow-2xl flex flex-col animate-slideInRight">
            <div className="flex items-center justify-between p-6 border-b border-slate-900">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Box className="w-5 h-5 text-indigo-400" /> {viewingProduct.product_name}
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                    {viewingProduct.product_id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    getStockStatus(viewingProduct) === "In Stock" ? "bg-emerald-500/10 text-emerald-400" :
                    getStockStatus(viewingProduct) === "Low Stock" ? "bg-amber-500/10 text-amber-400" :
                    "bg-rose-500/10 text-rose-400"
                  }`}>
                    {getStockStatus(viewingProduct)}
                  </span>
                </div>
              </div>
              <button onClick={() => setViewingProduct(null)} className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-slate-800">
              
              <div className="space-y-3">
                <h3 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
                  <FileText className="w-3.5 h-3.5" /> Basic Information
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><span className="block text-slate-500 mb-1">Category</span><span className="text-slate-200 font-medium">{viewingProduct.category}</span></div>
                  <div><span className="block text-slate-500 mb-1">SKU</span><span className="text-slate-200 font-mono">{viewingProduct.sku || 'N/A'}</span></div>
                  <div><span className="block text-slate-500 mb-1">Unit of Measure</span><span className="text-slate-200 font-medium">{viewingProduct.unit}</span></div>
                  <div className="col-span-2"><span className="block text-slate-500 mb-1">Description</span><span className="text-slate-200 leading-relaxed">{viewingProduct.description || 'No description provided.'}</span></div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Package className="w-3.5 h-3.5" /> Inventory
                </h3>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                    <span className="block text-slate-500 mb-1 text-[10px] uppercase">Current</span>
                    <span className="text-white font-mono font-bold text-lg">{viewingProduct.currentStock.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                    <span className="block text-slate-500 mb-1 text-[10px] uppercase">Safety</span>
                    <span className="text-slate-300 font-mono font-bold text-lg">{viewingProduct.safetyStock.toLocaleString()}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
                    <span className="block text-slate-500 mb-1 text-[10px] uppercase">Reorder</span>
                    <span className="text-slate-300 font-mono font-bold text-lg">{viewingProduct.reorderLevel.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Truck className="w-3.5 h-3.5" /> Procurement
                </h3>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div><span className="block text-slate-500 mb-1">Primary Vendor</span><span className="text-indigo-400 font-medium">{viewingProduct.primaryVendor}</span></div>
                  <div><span className="block text-slate-500 mb-1">Unit Price</span><span className="text-slate-200 font-mono font-medium">{formatCurrency(viewingProduct.unitPrice)}</span></div>
                  <div><span className="block text-slate-500 mb-1">Lead Time</span><span className="text-slate-200 font-medium">{viewingProduct.leadTimeDays} Days</span></div>
                  <div className="col-span-2"><span className="block text-slate-500 mb-1">Notes</span><span className="text-slate-200">{viewingProduct.notes || 'None'}</span></div>
                </div>
              </div>

              <div className="space-y-3 opacity-60 pointer-events-none">
                <h3 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Activity className="w-3.5 h-3.5" /> Analytics (Placeholder)
                </h3>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-900 text-center">
                  <span className="text-xs text-slate-500">Purchase history and trends will appear here.</span>
                </div>
              </div>
              
            </div>
            {permissions?.canManageInventory && (
              <div className="p-4 border-t border-slate-900 bg-slate-950 flex gap-3">
                <button onClick={() => { handleEditClick(viewingProduct); setViewingProduct(null); }} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors">Edit Product</button>
                <button onClick={() => { setProductToDelete(viewingProduct); setViewingProduct(null); }} className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setProductToDelete(null)} />
          <div className="relative w-full max-w-sm bg-[#050914] border border-rose-500/30 rounded-2xl p-6 shadow-2xl z-10 animate-slideUp text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Product?</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to delete <span className="font-bold text-slate-200">{productToDelete.product_name}</span>? This action will remove it from the catalog and cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setProductToDelete(null)} className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
