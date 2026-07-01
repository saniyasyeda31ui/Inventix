import React, { useState } from "react";
import { 
  CreditCard, Search, Filter, RefreshCw, ChevronLeft, ChevronRight, 
  MoreVertical, Check, ArrowUpRight, ShieldCheck, MailWarning
} from "lucide-react";
import { PaymentItem, initialPayments } from "../data/dashboardData";

interface PaymentsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
}

export default function PaymentsSection({ onShowToast }: PaymentsSectionProps) {
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const itemsPerPage = 5;

  const handleProcessPayment = (id: string, vendor: string, amount: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: "Paid" } : p));
    onShowToast(`Dispatched secure bank instruction to clear ${amount} invoice to ${vendor}.`, "success");
    setActiveMenuId(null);
  };

  const handleSendReminder = (vendor: string) => {
    onShowToast(`Sent billing synchronization request to ${vendor}.`, "success");
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
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-400" />
            <span>Sourcing Billing & Payments Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Settle outstanding raw material acquisition bills, wire transfers, and tax reconciliation records.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-slate-900 bg-[#040815] flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search payment ID, invoice, or vendor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-900 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Settlement status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
          >
            <option value="All">All Transactions</option>
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending Authorized</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/20 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Payment Reference</th>
                <th className="py-3 px-4">Invoice Reference</th>
                <th className="py-3 px-4">Vendor Partner</th>
                <th className="py-3 px-4 text-right">Acquisition Total</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Settle Method</th>
                <th className="py-3 px-4">Settlement Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.length > 0 ? (
                paginatedPayments.map((p) => (
                  <tr 
                    key={p.id}
                    className="border-b border-slate-900/50 hover:bg-slate-950/20 transition-all text-xs"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">{p.id}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{p.invoiceId}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{p.vendorName}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">{p.amount}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{p.dueDate}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{p.method}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        p.status === "Paid" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                          : p.status === "Processing"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/10"
                            : p.status === "Pending"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeMenuId === p.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-slate-900 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                            {p.status !== "Paid" && (
                              <button
                                onClick={() => handleProcessPayment(p.id, p.vendorName, p.amount)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Authorize Payment</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleSendReminder(p.vendorName)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Sync Billing info</span>
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
                    No payment logs match your filters.
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
