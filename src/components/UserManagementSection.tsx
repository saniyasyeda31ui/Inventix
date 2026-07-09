import React, { useState } from 'react';
import { ShieldAlert, Search, RefreshCw, UserPlus, MoreVertical, Edit2, Key, XCircle, CheckCircle, Trash2, X } from 'lucide-react';
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
          <h2 className="text-2xl font-bold text-slate-900 mb-1">User Management</h2>
          <p className="text-sm text-slate-600">Enterprise user provisioning and access control.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700/50 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          
          <button 
            onClick={refreshUsers}
            className="p-2 bg-slate-900/50 border border-slate-700/50 text-slate-600 hover:text-slate-900 rounded-xl transition-colors shrink-0"
            title="Refresh list"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setIsProvisionModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Provision New User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80">
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">App Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="w-full h-5 bg-slate-800 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="w-full h-5 bg-slate-800 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="w-full h-5 bg-slate-800 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="w-full h-5 bg-slate-800 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="w-full h-5 bg-slate-800 rounded animate-pulse"></div></td>
                    <td className="px-6 py-4"><div className="w-full h-5 bg-slate-800 rounded animate-pulse"></div></td>
                  </tr>
                ))
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-600">
                    <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-slate-600" />
                    <p>No users found matching your search.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.employee_uuid} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                        <span className="text-xs text-slate-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-800">{user.department}</span>
                        <span className="text-xs text-slate-500">{user.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 capitalize">
                        {user.appRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {user.status === 'Active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === user.employee_uuid ? null : user.employee_uuid)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeMenuId === user.employee_uuid && (
                        <div className="absolute right-6 top-10 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-10 py-1 overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)]">
                          <button onClick={() => handleChangeRole(user, 'admin')} className="w-full text-left px-4 py-2 text-sm text-slate-800 hover:bg-slate-800 hover:text-slate-900 transition-colors">
                            Change Role: Admin
                          </button>
                          <button onClick={() => handleChangeRole(user, 'procurement_manager')} className="w-full text-left px-4 py-2 text-sm text-slate-800 hover:bg-slate-800 hover:text-slate-900 transition-colors">
                            Change Role: Procurement
                          </button>
                          <button onClick={() => handleChangeRole(user, 'viewer')} className="w-full text-left px-4 py-2 text-sm text-slate-800 hover:bg-slate-800 hover:text-slate-900 transition-colors">
                            Change Role: Viewer
                          </button>
                          <div className="h-px bg-slate-800 my-1" />
                          <button onClick={() => handleResetPassword(user)} className="w-full flex items-center px-4 py-2 text-sm text-slate-800 hover:bg-slate-800 hover:text-slate-900 transition-colors">
                            <Key className="w-4 h-4 mr-2" /> Reset Password
                          </button>
                          <button onClick={() => handleToggleStatus(user)} className="w-full flex items-center px-4 py-2 text-sm text-slate-800 hover:bg-slate-800 hover:text-slate-900 transition-colors">
                            {user.status === 'Active' ? <XCircle className="w-4 h-4 mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                            {user.status === 'Active' ? 'Disable Account' : 'Enable Account'}
                          </button>
                          <div className="h-px bg-slate-800 my-1" />
                          <button onClick={() => handleDelete(user)} className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete User
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                Provision New User
              </h3>
              <button 
                onClick={() => setIsProvisionModalOpen(false)}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleProvision} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
                  <input 
                    required type="text"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Work Email</label>
                  <input 
                    required type="email"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
                  <select 
                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Sourcing">Sourcing</option>
                    <option value="Logistics">Logistics</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Procurement">Procurement</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Job Title</label>
                  <input 
                    required type="text" placeholder="e.g. Senior Buyer"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-slate-600 mb-1">Application Role</label>
                  <select 
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as AppRole})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
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
                  <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Disabled / Suspended</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-800 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsProvisionModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-800 hover:text-slate-900 bg-transparent hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Provisioning...</>
                  ) : (
                    'Create User'
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
