import React, { useState } from "react";
import { 
  ShoppingBag, Search, Filter, Plus, FileSpreadsheet, ThumbsUp, 
  ThumbsDown, ChevronLeft, ChevronRight, RefreshCw, MoreVertical, Send
} from "lucide-react";
import { PurchaseRequest, initialPurchaseRequests } from "../data/dashboardData";

interface PurchaseRequestsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
  onOpenModal: (modalName: string) => void;
}

export default function PurchaseRequestsSection({ onShowToast, onOpenModal }: PurchaseRequestsSectionProps) {
  const [requests, setRequests] = useState<PurchaseRequest[]>(initialPurchaseRequests);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 5;

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: "Approved" } : r));
    onShowToast(`Approved Purchase Request ${id}`, "success");
    setActiveMenuId(null);
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: "Rejected" } : r));
    onShowToast(`Rejected Purchase Request ${id}`, "success");
    setActiveMenuId(null);
  };

  const handleSendRFP = (id: string, supplier: string) => {
    onShowToast(`Sent Request for Proposal (RFP) to ${supplier} for request ${id}`, "success");
    setActiveMenuId(null);
  };

  // Filters
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

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <span>Purchase Requests Registry</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review internal acquisition requests, department requisitions, and priority-level authorizations.</p>
        </div>
        <button
          onClick={() => onOpenModal("createRequest")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Acquisition Request</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-slate-900 bg-[#040815] flex flex-col xl:flex-row gap-4 justify-between items-center">
        
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
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-900 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Multi-Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Priority</span>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Approval State</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <button 
            onClick={() => {
              setSearch("");
              setPriorityFilter("All");
              setStatusFilter("All");
              setCurrentPage(1);
              onShowToast("Filters reset successfully.", "info");
            }}
            className="p-1.5 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900/60 text-slate-400 hover:text-white text-xs ml-auto"
            title="Reset Filters"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/20 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Requested Item</th>
                <th className="py-3 px-4">Requester / Dept</th>
                <th className="py-3 px-4">Intended Vendor</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.length > 0 ? (
                paginatedRequests.map((r) => (
                  <tr 
                    key={r.id}
                    className="border-b border-slate-900/50 hover:bg-slate-950/20 transition-all text-xs"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">{r.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{r.item}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-300 block">{r.requestedBy}</span>
                      <span className="text-[10px] text-slate-500 block">{r.department}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{r.supplier}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-200">{r.amount}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        r.priority === "Critical" 
                          ? "bg-rose-500/10 text-rose-500 border border-rose-500/10"
                          : r.priority === "High"
                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                            : r.priority === "Medium"
                              ? "bg-indigo-500/10 text-indigo-500 border border-indigo-500/10"
                              : "bg-slate-500/10 text-slate-400 border border-slate-500/10"
                      }`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        r.status === "Approved" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                          : r.status === "Pending"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === r.id ? null : r.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeMenuId === r.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-slate-900 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                            <button
                              onClick={() => handleApprove(r.id)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <ThumbsUp className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Approve Request</span>
                            </button>
                            <button
                              onClick={() => handleReject(r.id)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
                              <span>Reject Request</span>
                            </button>
                            <div className="h-px bg-slate-900 my-1" />
                            <button
                              onClick={() => handleSendRFP(r.id, r.supplier)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <Send className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Send Supplier RFP</span>
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
                    No acquisition requests matched your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/20 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-500">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
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
}
