import React, { useState } from "react";
import { 
  FileText, Search, Filter, Plus, Printer, Mail, MoreVertical, 
  Trash2, RefreshCw, Eye, Send, CheckCircle2
} from "lucide-react";
import { PurchaseOrder, initialPurchaseOrders } from "../data/dashboardData";

interface PurchaseOrdersSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
  onOpenModal: (modalName: string) => void;
}

export default function PurchaseOrdersSection({ onShowToast, onOpenModal }: PurchaseOrdersSectionProps) {
  const [orders, setOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    onShowToast(`Purchase order ${id} is now ${newStatus}`, "success");
    setActiveMenuId(null);
  };

  const handleDispatchOrder = (id: string, vendor: string) => {
    onShowToast(`Formally dispatched Purchase Order ${id} to ${vendor} via secure electronic EDI connection.`, "success");
    setOrders(orders.map(o => o.id === id ? { ...o, status: "Sent" } : o));
    setActiveMenuId(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Purchase Orders (PO) Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Legally binding acquisition drafts, dispatched procurement contracts, and delivery arrival manifests.</p>
        </div>
        <button
          onClick={() => onOpenModal("createPO")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Purchase Order</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-slate-900 bg-[#040815] flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search PO ID, vendor, or authorized buyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-900 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">PO Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
          >
            <option value="All">All Purchase Orders</option>
            <option value="Draft">Draft</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Sent">Sent (Awaiting Delivery)</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/20 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">PO-ID</th>
                <th className="py-3 px-4">Vendor Partner</th>
                <th className="py-3 px-4">Date Authorized</th>
                <th className="py-3 px-4">Expected Delivery</th>
                <th className="py-3 px-4 text-right">Items Count</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4">Authorized Buyer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr 
                    key={o.id}
                    className="border-b border-slate-900/50 hover:bg-slate-950/20 transition-all text-xs"
                  >
                    <td className="py-3.5 px-4 font-mono text-indigo-400 font-semibold">{o.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{o.vendorName}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{o.dateCreated}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{o.deliveryDate}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300 font-medium">
                      {o.itemsCount.toLocaleString()} units
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">{o.amount}</td>
                    <td className="py-3.5 px-4 text-slate-400">{o.buyer}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        o.status === "Completed" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                          : o.status === "Sent"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                            : o.status === "Pending Approval"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                              : "bg-slate-500/10 text-slate-400 border border-slate-500/10"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === o.id ? null : o.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeMenuId === o.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-slate-900 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                            <button
                              onClick={() => handleDispatchOrder(o.id, o.vendorName)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Dispatch PO</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(o.id, "Completed")}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Mark Received</span>
                            </button>
                            <div className="h-px bg-slate-900 my-1" />
                            <button
                              onClick={() => {
                                onShowToast(`Generated printer-friendly PDF copy of PO ${o.id}`, "success");
                                setActiveMenuId(null);
                              }}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-400 hover:bg-slate-900 flex items-center gap-1.5"
                            >
                              <Printer className="w-3.5 h-3.5 text-slate-400" />
                              <span>Print PO Document</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
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

    </div>
  );
}
