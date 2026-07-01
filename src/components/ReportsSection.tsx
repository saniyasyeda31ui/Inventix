import React, { useState } from "react";
import { 
  FileSpreadsheet, Download, RefreshCw, BarChart2, Calendar, FileText, 
  ChevronLeft, ChevronRight, Plus, Eye, CheckCircle2, ShieldAlert
} from "lucide-react";

interface ReportLog {
  id: string;
  title: string;
  format: "XLSX" | "PDF" | "CSV";
  generatedBy: string;
  dateCreated: string;
  fileSize: string;
  category: "Inventory" | "Procurement" | "Audit" | "Tax & Compliance";
}

interface ReportsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
}

export default function ReportsSection({ onShowToast }: ReportsSectionProps) {
  const [logs, setLogs] = useState<ReportLog[]>([
    { id: "REP-2026-101", title: "Mid-Year Inventory Valuation Ledger", format: "XLSX", generatedBy: "Elena Rostova", dateCreated: "2026-06-29 09:12", fileSize: "4.8 MB", category: "Inventory" },
    { id: "REP-2026-102", title: "Q2 Sourcing Spend & Budget Analysis", format: "PDF", generatedBy: "Alexander S.", dateCreated: "2026-06-28 14:45", fileSize: "12.2 MB", category: "Procurement" },
    { id: "REP-2026-103", title: "Global Warehouse Compliance Audit Log", format: "PDF", generatedBy: "Dirk van Dijk", dateCreated: "2026-06-25 11:30", fileSize: "1.4 MB", category: "Audit" },
    { id: "REP-2026-104", title: "SLA Vendor Performance Matrix", format: "CSV", generatedBy: "System Daemon (Predictive AI)", dateCreated: "2026-06-24 23:00", fileSize: "312 KB", category: "Audit" },
    { id: "REP-2026-105", title: "Customs & Duty Tax Reconciliation", format: "XLSX", generatedBy: "Sarah Jenkins", dateCreated: "2026-06-20 16:15", fileSize: "2.1 MB", category: "Tax & Compliance" },
  ]);
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDownload = (title: string, format: string) => {
    onShowToast(`Downloading report: ${title}.${format.toLowerCase()}`, "success");
  };

  const handleCompileReport = (category: string) => {
    setIsCompiling(true);
    onShowToast(`Compiling detailed analytical metrics for: ${category}...`, "info");
    setTimeout(() => {
      setIsCompiling(false);
      const newId = `REP-2026-${100 + logs.length + 1}`;
      const newRep: ReportLog = {
        id: newId,
        title: `Dynamic ${category} Analytics Ledger`,
        format: "XLSX",
        generatedBy: "Alexander S.",
        dateCreated: "2026-06-30 10:10",
        fileSize: "1.2 MB",
        category: category as any
      };
      setLogs([newRep, ...logs]);
      onShowToast(`Successfully generated ${newId}: ${newRep.title}`, "success");
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
            <span>Analytical Reports Hub</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Compile comprehensive financial ledgers, audit trail metrics, and vendor shipment compliance sheets.</p>
        </div>
      </div>

      {/* Compile Reports Section */}
      <div className="p-5 rounded-2xl border border-slate-900 bg-[#040815] space-y-4">
        <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
          Instant Report Compiler
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => handleCompileReport("Inventory")}
            disabled={isCompiling}
            className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-indigo-600/5 hover:border-indigo-500/20 text-left transition-all space-y-2 cursor-pointer disabled:opacity-50"
          >
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-200">Inventory Valuation</h3>
            <p className="text-[10px] text-slate-500">Calculate total facility counts, bin capacities, and safety buffers.</p>
          </button>

          <button
            onClick={() => handleCompileReport("Procurement")}
            disabled={isCompiling}
            className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-indigo-600/5 hover:border-indigo-500/20 text-left transition-all space-y-2 cursor-pointer disabled:opacity-50"
          >
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-200">Spend & Cost Analysis</h3>
            <p className="text-[10px] text-slate-500">Analyze monthly expenditures, cost savings, and supplier margins.</p>
          </button>

          <button
            onClick={() => handleCompileReport("Audit")}
            disabled={isCompiling}
            className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-indigo-600/5 hover:border-indigo-500/20 text-left transition-all space-y-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldAlert className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-200">Vendor SLA Audits</h3>
            <p className="text-[10px] text-slate-500">Compare on-time shipping ratios and supplier compliance scores.</p>
          </button>

          <button
            onClick={() => handleCompileReport("Tax & Compliance")}
            disabled={isCompiling}
            className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-indigo-600/5 hover:border-indigo-500/20 text-left transition-all space-y-2 cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-bold text-slate-200">Customs & Duty ledgers</h3>
            <p className="text-[10px] text-slate-500">Reconcile shipping duties, import taxes, and logistics costs.</p>
          </button>
        </div>
      </div>

      {/* Reports Table Log */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="p-4 bg-slate-950/20 border-b border-slate-900 flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
            Generated Document Logs
          </h2>
          <span className="text-[10px] text-indigo-400 font-mono">Encrypted ISO Storage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/20 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Document ID</th>
                <th className="py-3 px-4">Report Description</th>
                <th className="py-3 px-4">File Format</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Generated By</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Size</th>
                <th className="py-3 px-4 text-center">Export</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr 
                  key={log.id}
                  className="border-b border-slate-900/50 hover:bg-slate-950/20 transition-all text-xs"
                >
                  <td className="py-3.5 px-4 font-mono text-slate-400">{log.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{log.title}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      log.format === "XLSX" ? "text-emerald-400 bg-emerald-500/5" : "text-indigo-400 bg-indigo-500/5"
                    }`}>
                      {log.format}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{log.category}</td>
                  <td className="py-3.5 px-4 text-slate-300">{log.generatedBy}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{log.dateCreated}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400">{log.fileSize}</td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleDownload(log.title, log.format)}
                      className="p-1.5 rounded-lg border border-slate-900 bg-slate-950/40 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-400 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
