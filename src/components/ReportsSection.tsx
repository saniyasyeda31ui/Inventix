import React, { useState, useMemo } from "react";
import { 
  FileSpreadsheet, Download, RefreshCw, AlertCircle, Search, Filter
} from "lucide-react";
import SkeletonLoader from "./SkeletonLoader";
import { useReports, ReportConfig } from "../hooks/useReports";

interface ReportsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export default function ReportsSection({ onShowToast }: ReportsSectionProps) {
  const [category, setCategory] = useState("Inventory");
  const [dateRange, setDateRange] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");

  const config: ReportConfig = useMemo(() => ({
    category,
    dateRange,
    searchQuery
  }), [category, dateRange, searchQuery]);

  const { 
    savedReports, 
    loadingHistory, 
    reportData, 
    loadingReport, 
    error, 
    refreshHistory,
    refreshLiveReport,
    recordExport
  } = useReports(config);

  const categories = ["Inventory", "Purchase", "Vendor", "Payment", "Employee"];
  const dateRanges = ["All Time", "Last 30 Days", "Last 90 Days", "Year to Date"];

  const handleExportCSV = async () => {
    if (!reportData || reportData.length === 0) {
      onShowToast("No data to export.", "error");
      return;
    }

    try {
      // 1. Generate CSV content
      const headers = Object.keys(reportData[0]);
      const csvRows = [];
      csvRows.push(headers.join(',')); // Header row

      for (const row of reportData) {
        const values = headers.map(header => {
          let val = row[header];
          if (typeof val === 'object' && val !== null) {
            val = JSON.stringify(val); // simplistic serialization for nested objects
          }
          const escaped = ('' + (val || '')).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      
      // 2. Trigger Download
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `${category}_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // 3. Size Calculation
      const sizeKB = (blob.size / 1024).toFixed(2);
      const sizeStr = `${sizeKB} KB`;

      // 4. Log to Supabase
      const title = `${category} Export - ${dateRange}`;
      await recordExport(category, title, "CSV", sizeStr);

      onShowToast(`Successfully exported ${category} report.`, "success");
    } catch (err) {
      console.error(err);
      onShowToast("Failed to export CSV.", "error");
    }
  };

  // Dynamic Column rendering based on category
  const renderRow = (row: any, index: number) => {
    return (
      <tr key={index} className="border-b border-slate-900/50 hover:bg-slate-950/20 transition-all text-xs text-slate-300">
        {Object.entries(row).map(([key, val]: [string, any], idx) => {
          let displayVal = val;
          if (typeof val === 'object' && val !== null) {
            // Flatten simple objects (like {name: 'xyz'})
            displayVal = Object.values(val).join(' - ');
          }
          return (
            <td key={idx} className="py-3.5 px-4 whitespace-nowrap">
              {displayVal || '-'}
            </td>
          );
        })}
      </tr>
    );
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
          <p className="text-xs text-slate-500 mt-1">Generate live reports from real-time database queries and export directly to CSV.</p>
        </div>
      </div>

      {/* Report Controls */}
      <div className="p-4 rounded-2xl border border-slate-900 bg-[#040815] grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Report Category</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-colors"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Date Range</label>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-indigo-500/50 transition-colors"
          >
            {dateRanges.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Global Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${category} records...`}
              className="w-full bg-slate-950 border border-slate-800 text-sm text-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500/50 transition-colors placeholder:text-slate-600"
            />
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-sm text-rose-400 animate-slideIn">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold text-rose-300">Data Fetch Error</span>
            <span className="leading-relaxed mt-1 text-xs">{error}</span>
          </div>
        </div>
      )}

      {/* Live Report Data Table */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="p-4 bg-slate-950/20 border-b border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
            {category} Live Data <span className="text-indigo-400">({reportData?.length || 0} Records)</span>
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={refreshLiveReport}
              className="p-1.5 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900/60 text-slate-400 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingReport ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={handleExportCSV}
              disabled={loadingReport || reportData.length === 0}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-950/90 backdrop-blur z-10 shadow-sm">
              <tr className="border-b border-slate-900 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                {reportData && reportData.length > 0 ? (
                  Object.keys(reportData[0]).map(key => (
                    <th key={key} className="py-3 px-4">{key.replace(/_/g, ' ')}</th>
                  ))
                ) : (
                  <th className="py-3 px-4">No Data Available</th>
                )}
              </tr>
            </thead>
            <tbody>
              {loadingReport ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-slate-900/40">
                    <td className="py-4 px-4"><SkeletonLoader className="h-4 w-full rounded" /></td>
                  </tr>
                ))
              ) : reportData.length > 0 ? (
                reportData.map((row, idx) => renderRow(row, idx))
              ) : (
                <tr>
                  <td colSpan={10} className="py-12">
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-slate-900/50 flex items-center justify-center border border-slate-800">
                        <Filter className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-200">No records found</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-sm">
                          Try adjusting your date range or search query.
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

      {/* Reports Table Log */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="p-4 bg-slate-950/20 border-b border-slate-900 flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
            Generated Reports History
          </h2>
          <button 
            onClick={refreshHistory}
            className="p-1.5 rounded-lg border border-slate-900 bg-slate-950 hover:bg-slate-900/60 text-slate-400 hover:text-white text-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
          </button>
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
              </tr>
            </thead>
            <tbody>
              {loadingHistory ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={`skeleton-${i}`} className="border-b border-slate-900/40">
                    <td colSpan={7} className="py-4 px-4"><SkeletonLoader className="h-4 w-full rounded" /></td>
                  </tr>
                ))
              ) : savedReports.length > 0 ? (
                savedReports.map((log) => (
                <tr 
                  key={log.id}
                  className="border-b border-slate-900/50 hover:bg-slate-950/20 transition-all text-xs"
                >
                  <td className="py-3.5 px-4 font-mono text-slate-400">{log.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">{log.title}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                      log.format === "CSV" ? "text-emerald-400 bg-emerald-500/5" : "text-indigo-400 bg-indigo-500/5"
                    }`}>
                      {log.format}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{log.category}</td>
                  <td className="py-3.5 px-4 text-slate-300">{log.generatedBy}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{log.dateCreated}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400">{log.fileSize}</td>
                </tr>
              ))) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                    No generated reports in history.
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
