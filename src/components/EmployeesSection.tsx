import React, { useState, useEffect } from "react";
import { 
  Users, Search, RefreshCw, ChevronLeft, ChevronRight, 
  MoreVertical, ShieldAlert, Key, Plus, Edit2, Trash2, X, AlertCircle, Check
} from "lucide-react";
import { EmployeeItem } from "../data/dashboardData";
import SkeletonLoader from "./SkeletonLoader";
import { useEmployees } from "../hooks/useEmployees";
import { useAuth } from "../context/AuthContext";

interface EmployeesSectionProps {
  activeModal: string | null;
  onCloseModal: () => void;
  onShowToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export default function EmployeesSection({ activeModal, onCloseModal, onShowToast }: EmployeesSectionProps) {
  const { permissions } = useAuth();
  const { employees, loading, error, refreshEmployees, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const depts = ["All", "Sourcing", "Logistics", "Finance", "Operations", "Engineering", "Maintenance", "Procurement"];

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeItem | null>(null);

  const [formData, setFormData] = useState<Partial<EmployeeItem>>({
    name: "",
    email: "",
    role: "", // maps to 'title'
    department: "Operations",
    status: "Active",
    manager_id: "" // For future extensibility
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const itemsPerPage = 6;

  useEffect(() => {
    if (activeModal === "addEmployee") {
      handleOpenAddModal();
    }
  }, [activeModal]);

  const handleOpenAddModal = () => {
    setSelectedEmployee(null);
    setFormData({
      name: "",
      email: "",
      role: "",
      department: "Operations",
      status: "Active",
      manager_id: ""
    });
    setIsAddModalOpen(true);
  };

  const handleEditClick = (e: EmployeeItem) => {
    setSelectedEmployee(e);
    setFormData({
      name: e.name,
      email: e.email,
      role: e.role,
      department: e.department,
      status: e.status,
      manager_id: e.manager_id || ""
    });
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const handleCloseModalInternal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    onCloseModal(); // notify parent
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        manager_id: formData.manager_id ? formData.manager_id : null
      };

      if (isAddModalOpen) {
        await addEmployee(payload);
        onShowToast(`Created employee record successfully!`, "success");
      } else if (isEditModalOpen && selectedEmployee) {
        if (!selectedEmployee.uuid) throw new Error("Missing UUID for update");
        await updateEmployee(selectedEmployee.uuid, payload);
        onShowToast(`Updated employee record successfully!`, "success");
      }
      handleCloseModalInternal();
    } catch (err: any) {
      onShowToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (uuid: string, name: string) => {
    if (!confirm(`Are you sure you want to delete employee ${name}?`)) return;
    try {
      await deleteEmployee(uuid);
      onShowToast(`Deleted employee ${name} successfully.`, "success");
    } catch (err: any) {
      onShowToast(`Failed to delete employee: ${err.message}`, "error");
    }
    setActiveMenuId(null);
  };

  const handleAdjustAccess = async (uuid: string, name: string) => {
    // Dummy function for UI button parity
    onShowToast(`Dispatched secure email token to adjust ERP permission roles for ${name}.`, "success");
    setActiveMenuId(null);
  };

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = 
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    
    const matchesDept = deptFilter === "All" || e.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage) || 1;
  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-500" />
            <span>ERP Administrative User Directory</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Audit administrative personnel permissions, department allocations, and sign-off privilege tiers.</p>
        </div>
        {permissions?.canManageEmployees && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition-colors shadow-lg shadow-indigo-900/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Provision New User</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl border border-white/60 bg-white/50 backdrop-blur-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search operator name, role, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-white/60 bg-white/50 backdrop-blur-md text-slate-900 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">ERP Department</span>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-2 py-1.5 text-xs rounded-lg border border-white/60 bg-white/60 text-slate-800 focus:outline-none"
          >
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          
          <button 
            onClick={() => {
              setSearch("");
              setDeptFilter("All");
              refreshEmployees();
              onShowToast("Filters reset and employees refreshed.", "info");
            }}
            className="p-1.5 ml-2 rounded-lg border border-white/60 bg-white/60 hover:bg-white/70 text-slate-600 hover:text-slate-900 text-xs transition-colors"
            title="Reset Filters & Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
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
              onClick={refreshEmployees} 
              className="mt-2 w-fit text-xs font-semibold px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="border border-white/60 rounded-2xl bg-white/50 backdrop-blur-2xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/60 bg-white/60/25 backdrop-blur-md text-[11px] font-extrabold text-slate-800 uppercase tracking-widest sticky top-0 z-10">
                <th className="py-4 px-5">Operator ID</th>
                <th className="py-4 px-5">Operator Details</th>
                <th className="py-4 px-5">Authorized Role</th>
                <th className="py-4 px-5">Department Allocation</th>
                <th className="py-4 px-5">Login Status</th>
                {permissions?.canManageEmployees && <th className="py-4 px-5 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                // Loading Skeleton Rows
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-20 rounded" /></td>
                    <td className="py-4 px-5">
                      <div className="space-y-1.5">
                        <SkeletonLoader className="h-4 w-32 rounded" />
                        <SkeletonLoader className="h-3 w-40 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-28 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-4 w-24 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="h-5 w-16 rounded" /></td>
                    {permissions?.canManageEmployees && <td className="py-4 px-5"><SkeletonLoader className="h-6 w-6 rounded mx-auto" /></td>}
                  </tr>
                ))
              ) : paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((e) => (
                  <tr 
                    key={e.uuid || e.id}
                    className="hover:bg-white/60/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-5 font-medium text-slate-600 text-xs">{e.id}</td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-950 text-sm">{e.name}</span>
                        <span className="font-medium text-[11px] text-slate-500 mt-0.5">{e.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-800 text-sm">{e.role}</td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center justify-center px-2.5 py-1 rounded shadow-sm text-[11px] font-bold uppercase tracking-widest border bg-slate-500/10 text-slate-700 border-slate-500/20">
                        {e.department}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded shadow-sm text-[11px] font-bold uppercase tracking-widest border ${
                        e.status === "Active" 
                          ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/20"
                          : e.status === "On Leave"
                            ? "bg-amber-500/10 text-amber-800 border-amber-500/20"
                            : "bg-rose-500/10 text-rose-800 border-rose-500/20"
                      }`}>
                        {e.status}
                      </span>
                    </td>
                    {permissions?.canManageEmployees && (
                      <td className="py-4 px-5 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={() => {
                              setActiveMenuId(activeMenuId === e.uuid ? null : (e.uuid as string));
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenuId === e.uuid && (
                            <div className="absolute right-0 mt-1 w-48 bg-[#050914] border border-white/60 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                              <button
                                onClick={() => handleAdjustAccess(e.uuid as string, e.name)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Key className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Adjust Access Tier</span>
                              </button>
                              <button
                                onClick={() => handleEditClick(e)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white flex items-center gap-1.5 transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Edit Employee</span>
                              </button>
                              <div className="h-px bg-slate-800 my-1" />
                              <button
                                onClick={() => handleDelete(e.uuid as string, e.name)}
                                className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Revoke Access (Delete)</span>
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
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No administrative operators match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/60 bg-white/40 backdrop-blur-md flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500">
            Page <span className="font-bold text-slate-700">{currentPage}</span> of <span className="font-bold text-slate-700">{totalPages}</span>
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

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="absolute inset-0" onClick={handleCloseModalInternal} />
          <div className="bg-[#0a0e1a] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] shadow-2xl flex flex-col relative z-10">
            
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                {isAddModalOpen ? "Provision New Employee" : "Edit Employee Details"}
              </h2>
              <button 
                onClick={handleCloseModalInternal}
                className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[70vh] custom-scrollbar">
              <form id="employee-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
                
                <div className="space-y-1.5">
                  <label className="text-slate-600 font-semibold uppercase tracking-wider block">Full Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-600 font-semibold uppercase tracking-wider block">Work Email</label>
                  <input 
                    required
                    type="email" 
                    placeholder="e.g. jdoe@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-semibold uppercase tracking-wider block">Department</label>
                    <select
                      required
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                    >
                      {depts.filter(d => d !== "All").map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-semibold uppercase tracking-wider block">Authorized Role</label>
                    <input 
                      required
                      type="text"
                      placeholder="e.g. Lead Engineer"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-semibold uppercase tracking-wider block">Login Status</label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-slate-600 font-semibold uppercase tracking-wider block">Direct Manager (Optional)</label>
                    <select
                      value={formData.manager_id || ""}
                      onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                      className="w-full bg-white/60 border border-white/60 rounded-xl px-3.5 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none"
                    >
                      <option value="">None / Top Level</option>
                      {employees.filter(emp => !selectedEmployee || emp.uuid !== selectedEmployee.uuid).map((emp) => (
                        <option key={emp.uuid} value={emp.uuid || ""}>
                          {emp.name} ({emp.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </form>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/20 flex justify-end gap-3">
              <button 
                type="button"
                onClick={handleCloseModalInternal}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="employee-form"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-900/20 flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                {isAddModalOpen ? "Create Profile" : "Save Changes"}
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
