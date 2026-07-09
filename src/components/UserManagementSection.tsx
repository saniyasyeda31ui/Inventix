import React, { useState } from 'react';
import { ShieldAlert, Search, RefreshCw, UserPlus, MoreVertical, Edit2, Key, XCircle, CheckCircle, Trash2, X, Shield, CheckCircle2 } from 'lucide-react';
import { useAdminUsers, AdminUser } from '../hooks/useAdminUsers';
import { AppRole } from '../lib/rbac';
import SkeletonLoader from './SkeletonLoader';

interface UserManagementSectionProps {
  onShowToast: (msg: string, type?: "success" | "info" | "error") => void;
}

export default function UserManagementSection({ onShowToast }: UserManagementSectionProps) {
  const { users, loading, error, refreshUsers, provisionUser, updateRole, toggleStatus, deleteUser, resetPassword } = useAdminUsers();
  const [search, setSearch] = useState("");
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Operations",
    title: "",
    role: "viewer" as AppRole,
    status: "Active"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await provisionUser({
        full_name: formData.name,
        email: formData.email,
        department: formData.department,
        title: formData.title,
        role: formData.role,
        status: formData.status,
        redirectTo: window.location.origin + '/accept-invitation'
      });
      onShowToast("User provisioned successfully! An invite email has been sent.", "success");
      setIsProvisionModalOpen(false);
      setFormData({ name: "", email: "", department: "Operations", title: "", role: "viewer", status: "Active" });
    } catch (err: any) {
      onShowToast(err.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeRole = async (u: AdminUser, newRole: AppRole) => {
    try {
      await updateRole(u.employee_uuid, u.id, newRole);
      onShowToast(`Role updated to ${newRole}`, "success");
      setActiveMenuId(null);
    } catch (err: any) {
      onShowToast(err.message, "error");
    }
  };

  const handleToggleStatus = async (u: AdminUser) => {
    const newStatus = u.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await toggleStatus(u.employee_uuid, newStatus);
      onShowToast(`User status updated to ${newStatus}`, "success");
      setActiveMenuId(null);
    } catch (err: any) {
      onShowToast(err.message, "error");
    }
  };

  const handleDelete = async (u: AdminUser) => {
    if (confirm(`Are you sure you want to delete ${u.name}? This action cannot be undone.`)) {
      try {
        await deleteUser(u.employee_uuid, u.id);
        onShowToast("User deleted successfully.", "success");
        setActiveMenuId(null);
      } catch (err: any) {
        onShowToast(err.message, "error");
      }
    }
  };

  const handleResetPassword = async (u: AdminUser) => {
    try {
      await resetPassword(u.email);
      onShowToast("Password reset email sent.", "success");
      setActiveMenuId(null);
    } catch (err: any) {
      onShowToast(err.message, "error");
    }
  };

  if (error) {
    return (
      <div className="p-8 text-center border border-red-900/50 rounded-2xl bg-red-900/10">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-400 mb-2">Error Loading Users</h3>
        <p className="text-sm text-slate-600">{error}</p>
        <button onClick={refreshUsers} className="mt-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <Shield className="w-7 h-7 text-indigo-500" />
            <span>User Management</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Enterprise user provisioning and access control.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/60 border border-white/60 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>
          
          <button 
            onClick={refreshUsers}
            className="p-2 bg-white/60 border border-white/60 text-slate-600 hover:text-slate-900 hover:bg-white/70 rounded-xl transition-colors shrink-0"
            title="Refresh list"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsProvisionModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      {/* Users Table */}
      <div className="border border-white/60 rounded-2xl bg-white/50 backdrop-blur-2xl overflow-hidden shadow-xl shadow-slate-900/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/60 bg-white/60/25 backdrop-blur-md text-[11px] font-extrabold text-slate-800 uppercase tracking-widest sticky top-0 z-10">
                <th className="py-4 px-5">Employee</th>
                <th className="py-4 px-5">Department</th>
                <th className="py-4 px-5">App Role</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Created</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/40">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="py-4 px-5"><SkeletonLoader className="w-full h-5 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="w-full h-5 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="w-full h-5 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="w-full h-5 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="w-full h-5 rounded" /></td>
                    <td className="py-4 px-5"><SkeletonLoader className="w-full h-5 rounded" /></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-5 text-center text-slate-500">
                    <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                    <p>No users found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.employee_uuid} className="hover:bg-white/60/40 transition-colors cursor-pointer group">
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-950 text-sm">{user.name}</span>
                        <span className="font-medium text-[11px] text-slate-500 mt-0.5">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 text-sm">{user.department}</span>
                        <span className="font-medium text-[11px] text-slate-500 mt-0.5">{user.title}</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded shadow-sm text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20 bg-indigo-500/10 text-indigo-800">
                        {user.appRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded shadow-sm text-[10px] font-bold uppercase tracking-widest border ${
                        user.status === 'Active' 
                          ? 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-800 border-rose-500/20'
                      }`}>
                        {user.status === 'Active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 font-medium text-slate-600 text-xs">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-right relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === user.employee_uuid ? null : user.employee_uuid)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-white/80 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeMenuId === user.employee_uuid && (
                        <div className="absolute right-6 top-10 w-48 bg-[#050914] border border-white/60 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
                          <button onClick={() => handleChangeRole(user, 'admin')} className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-colors">
                            Change Role: Admin
                          </button>
                          <button onClick={() => handleChangeRole(user, 'procurement_manager')} className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-colors">
                            Change Role: Procurement
                          </button>
                          <button onClick={() => handleChangeRole(user, 'viewer')} className="w-full text-left px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-colors">
                            Change Role: Viewer
                          </button>
                          <div className="h-px bg-slate-800 my-1" />
                          <button onClick={() => handleResetPassword(user)} className="w-full flex items-center px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-colors">
                            <Key className="w-3.5 h-3.5 mr-2 text-indigo-400" /> Reset Password
                          </button>
                          <button onClick={() => handleToggleStatus(user)} className="w-full flex items-center px-3 py-1.5 text-[11px] rounded-lg text-slate-300 hover:bg-indigo-600/20 hover:text-white transition-colors">
                            {user.status === 'Active' ? <XCircle className="w-3.5 h-3.5 mr-2 text-rose-400" /> : <CheckCircle className="w-3.5 h-3.5 mr-2 text-emerald-400" />}
                            {user.status === 'Active' ? 'Disable Account' : 'Enable Account'}
                          </button>
                          <div className="h-px bg-slate-800 my-1" />
                          <button onClick={() => handleDelete(user)} className="w-full flex items-center px-3 py-1.5 text-[11px] rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete User
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Modal */}
      {isProvisionModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setIsProvisionModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-3xl shadow-[0_40px_100px_-20px_rgba(168,85,247,0.2),inset_0_0_0_1px_rgba(255,255,255,0.6)] border border-white/50 rounded-[32px] p-8 overflow-hidden animate-slideUp">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <UserPlus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-[22px] font-extrabold text-slate-900 font-display tracking-tight">
                  Add User
                </h3>
              </div>
              <button 
                onClick={() => setIsProvisionModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleProvision} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Full Name</label>
                  <input 
                    required type="text" placeholder="e.g. Jane Doe"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Work Email</label>
                  <input 
                    required type="email" placeholder="e.g. jane.doe@acme.com"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Department</label>
                  <select 
                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  >
                    <option value="Sourcing">Sourcing</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Procurement">Procurement</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Job Title</label>
                  <input 
                    required type="text" placeholder="e.g. Senior Buyer"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Application Role</label>
                  <select 
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as AppRole})}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  >
                    <option value="admin">Admin</option>
                    <option value="procurement_manager">Procurement Manager</option>
                    <option value="inventory_manager">Inventory Manager</option>
                    <option value="warehouse_manager">Warehouse Manager</option>
                    <option value="finance_manager">Finance Manager</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-[11.5px] font-bold text-slate-800 ml-1 tracking-wide uppercase block mb-1.5">Status</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-white/90 backdrop-blur-xl border-[2px] border-white focus:border-indigo-300 rounded-[14px] py-3 px-4 text-[13px] font-bold text-slate-900 placeholder-slate-400 shadow-[0_0_15px_rgba(255,255,255,1),0_4px_10px_rgba(0,0,0,0.03)] focus:outline-none transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Disabled / Suspended</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200/60 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-5 py-3.5 rounded-[14px] text-[13px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors bg-transparent border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="relative rounded-[14px] bg-gradient-to-r from-[#9444ff] to-[#bd44ff] text-white font-bold py-3.5 px-6 shadow-[0_8px_20px_rgba(168,85,247,0.4)] focus:outline-none flex items-center justify-center gap-2 group overflow-hidden cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                  <span className="relative z-10 text-[13px]">
                    {isSubmitting ? 'Provisioning...' : 'Add User'}
                  </span>
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin relative z-10" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
