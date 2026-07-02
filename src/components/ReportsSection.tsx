import React, { useState } from "react";
import { 
  FileSpreadsheet, Download, RefreshCw, BarChart2, Calendar, FileText, 
  ChevronLeft, ChevronRight, Plus, Eye, CheckCircle2, ShieldAlert, AlertCircle
} from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";
import { useReports, ReportLog } from "../hooks/useReports";

interface ReportsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
}

export default function ReportsSection({ onShowToast }: ReportsSectionProps) {
  const { reports: logs, setReports: setLogs, loading, error, refreshReports, generateReport } = useReports();
  const [isCompiling, setIsCompiling] = useState(false);

  const handleDownload = (title: string, format: string) => {
    onShowToast(`Downloading report: ${title}.${format.toLowerCase()}`, "success");
  };

  const handleCompileReport = async (category: string) => {
    setIsCompiling(true);
    onShowToast(`Compiling detailed analytical metrics for: ${category}...`, "info");
    
    try {
      await generateReport(category);
      onShowToast(`Successfully generated new ${category} report.`, "success");
    } catch (err: any) {
      onShowToast(err.message || "Failed to generate report.", "error");
    } finally {
      setIsCompiling(false);
    }
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

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-400 animate-slideIn">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-rose-300">Data Fetch Error</span>
            <span className="leading-relaxed mt-1 text-xs">{error}</span>
            <button 
              onClick={refreshReports} 
              className="mt-2 w-fit text-xs font-semibold px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Reports Table Log */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="p-4 bg-slate-950/20 border-b border-slate-900 flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
            Generated Document Logs
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-indigo-400 font-mono hidden sm:inline-block">Encrypted ISO Storage</span>
            <button 
              onClick={() => {
                refreshReports();
                onShowToast("Reports log refreshed successfully.", "info");
              }}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900/60 text-slate-400 hover:text-white text-xs transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
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
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-slate-900/40">
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-48 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-12 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-28 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-28 rounded" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-16 rounded ml-auto" /></td>
                    <td className="py-4 px-4"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>
                  </tr>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
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
              ))) : (
                <tr>
                  <td colSpan={8} className="py-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-900/50 flex items-center justify-center border border-slate-800">
                        <FileText className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="text-slate-300 font-bold text-sm">No Reports Found</h3>
                        <p className="text-slate-500 text-xs mt-1 max-w-xs mx-auto">
                          There are currently no reports saved in the database. Use the instant report compiler above to generate one.
                        </p>
                      </div>
                    </div>
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
