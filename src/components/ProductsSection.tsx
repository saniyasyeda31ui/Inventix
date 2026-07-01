import React, { useState } from "react";
import { 
  Search, Filter, Plus, ChevronDown, MoreVertical, Edit2, Trash2, 
  RefreshCw, ChevronLeft, ChevronRight, Check, CheckCircle2, Box
} from "lucide-react";
import { ProductItem, initialProducts } from "../data/dashboardData";
import { HighlightText, SortIndicator, EmptyState } from "./TableUX";

interface ProductsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
  onOpenModal: (modalName: string) => void;
}

export default function ProductsSection({ onShowToast, onOpenModal }: ProductsSectionProps) {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts);
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

  const handleDelete = (id: string, name: string) => {
    setProducts(products.filter(p => p.id !== id));
    onShowToast(`Deleted ${name} from inventory catalog.`, "success");
    setActiveMenuId(null);
  };

  const handleUpdateStatus = (id: string, nextStatus: any) => {
    setProducts(products.map(p => p.id === id ? { ...p, stockStatus: nextStatus } : p));
    onShowToast(`Updated product status to ${nextStatus}`, "success");
    setActiveMenuId(null);
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
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Box className="w-5 h-5 text-indigo-400" />
            <span>Product Catalog</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage global manufactured materials, SKUs, and default sourcing settings.</p>
        </div>
        <button
          onClick={() => onOpenModal("addProduct")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register Product</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl border border-slate-900 bg-[#040815] flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search name, SKU, or supplier..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-900 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Multi-Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Stock Status</span>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
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
              onShowToast("Filters reset successfully.", "info");
            }}
            className="p-1.5 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900/60 text-slate-400 hover:text-white text-xs"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Enterprise Products Table */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/25 text-[10px] font-mono text-slate-500 uppercase tracking-wider sticky top-0 backdrop-blur-md">
                <th className="py-3 px-4">ID / SKU</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white select-none" onClick={() => toggleSort("name")}>
                  Product Name <SortIndicator active={sortBy === "name"} order={sortOrder} />
                </th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white select-none text-right" onClick={() => toggleSort("price")}>
                  Unit Price <SortIndicator active={sortBy === "price"} order={sortOrder} />
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-white select-none text-center" onClick={() => toggleSort("leadTime")}>
                  Lead Time <SortIndicator active={sortBy === "leadTime"} order={sortOrder} />
                </th>
                <th className="py-3 px-4">Primary Sourcing Vendor</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((p) => (
                  <tr 
                    key={p.id}
                    onClick={() => handleRowClick(p)}
                    className="border-b border-slate-900/40 hover:bg-slate-950/30 transition-all cursor-pointer text-xs"
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-slate-300 font-semibold block">
                        <HighlightText text={p.id} search={search} />
                      </span>
                      <span className="text-[9px] text-slate-500 block">
                        <HighlightText text={p.sku} search={search} />
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <HighlightText text={p.name} search={search} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{p.category}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-200">
                      ${p.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                      {p.leadTimeDays} days
                    </td>
                    <td className="py-3.5 px-4 text-indigo-400/90 font-medium">
                      <HighlightText text={p.primaryVendor} search={search} />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase hover-glow-subtle ${
                        p.stockStatus === "In Stock" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                          : p.stockStatus === "Low Stock"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                      }`}>
                        {p.stockStatus}
                      </span>
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
                            <button
                              onClick={() => handleUpdateStatus(p.id, "In Stock")}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Set In Stock</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(p.id, "Low Stock")}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5 text-amber-500" />
                              <span>Set Low Stock</span>
                            </button>
                            <div className="h-px bg-slate-900 my-1" />
                            <button
                              onClick={() => handleDelete(p.id, p.name)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Product</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
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
        <div className="p-4 border-t border-slate-900 bg-slate-950/20 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            Showing {indexOfFirstItem() + 1}-{Math.min(indexOfLastItem(), filteredProducts.length)} of {filteredProducts.length} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-semibold text-slate-300 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );

  function indexOfFirstItem() {
    return (currentPage - 1) * itemsPerPage;
  }
  function indexOfLastItem() {
    return currentPage * itemsPerPage;
  }
}
