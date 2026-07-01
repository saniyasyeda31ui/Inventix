import React, { useState } from "react";
import { 
  Users, Search, Filter, Plus, ShieldAlert, Key, Trash2, 
  MoreVertical, Check, RefreshCw
} from "lucide-react";
import { EmployeeItem, initialEmployees } from "../data/dashboardData";

interface EmployeesSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
  onOpenModal: (modalName: string) => void;
}

export default function EmployeesSection({ onShowToast, onOpenModal }: EmployeesSectionProps) {
  const [employees, setEmployees] = useState<EmployeeItem[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const depts = ["All", "Procurement", "Operations", "Logistics", "Finance"];

  const handleUpdateStatus = (id: string, name: string, status: any) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, status } : e));
    onShowToast(`Updated user status for ${name} to ${status}`, "success");
    setActiveMenuId(null);
  };

  const handleAdjustAccess = (name: string) => {
    onShowToast(`Dispatched secure email token to adjust ERP permission roles for ${name}.`, "success");
    setActiveMenuId(null);
  };

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = deptFilter === "All" || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            <span>ERP Administrative User Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Audit administrative personnel permissions, department allocations, and sign-off privilege tiers.</p>
        </div>
        <button
          onClick={() => onOpenModal("addEmployee")}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-slate-900 bg-[#040815] flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search operator name, role, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-900 bg-slate-950/50 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">ERP Department</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-slate-900 bg-slate-950 text-slate-300 focus:outline-none"
          >
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="border border-slate-900 rounded-2xl bg-[#040815] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-950/20 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Operator ID</th>
                <th className="py-3 px-4">Operator Details</th>
                <th className="py-3 px-4">Authorized Role</th>
                <th className="py-3 px-4">Department Allocation</th>
                <th className="py-3 px-4">Login Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((e) => (
                  <tr 
                    key={e.id}
                    className="border-b border-slate-900/50 hover:bg-slate-950/20 transition-all text-xs"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-semibold">{e.id}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-200 block font-semibold">{e.name}</span>
                      <span className="text-[10px] text-slate-500 block">{e.email}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-medium">{e.role}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{e.department}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        e.status === "Active" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === e.id ? null : e.id)}
                          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {activeMenuId === e.id && (
                          <div className="absolute right-0 mt-1 w-44 bg-[#050914] border border-slate-900 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                            <button
                              onClick={() => handleAdjustAccess(e.name)}
                              className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/10 hover:text-white flex items-center gap-1.5"
                            >
                              <Key className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Edit Permissions</span>
                            </button>
                            <div className="h-px bg-slate-900 my-1" />
                            {e.status === "Active" ? (
                              <button
                                onClick={() => handleUpdateStatus(e.id, e.name, "Suspended")}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-amber-400 hover:bg-amber-500/10 flex items-center gap-1.5"
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                                <span>Suspend Operator</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(e.id, e.name, "Active")}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Activate Operator</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No operator records matched your search filters.
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
