import React, { useState, useEffect } from "react";
import { 
  Save, Shield, Bell, Globe, 
  Settings, Building2, Package, Users,
  CheckCircle, AlertTriangle, Clock
} from "lucide-react";
import { useAuth, CompanySettings } from "../context/AuthContext";

interface SettingsSectionProps {
  onShowToast: (msg: string, type?: "success" | "error" | "info" | "warning") => void;
}

export default function SettingsSection({ onShowToast }: SettingsSectionProps) {
  const { companySettings, updateSettings } = useAuth();
  
  const [activeTab, setActiveTab] = useState("Company Preferences");
  const [localSettings, setLocalSettings] = useState<CompanySettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize local settings when companySettings loads
  useEffect(() => {
    if (companySettings && !localSettings) {
      setLocalSettings(JSON.parse(JSON.stringify(companySettings))); // deep copy
    }
  }, [companySettings]);

  // Check for unsaved changes deeply
  useEffect(() => {
    if (companySettings && localSettings) {
      const isChanged = JSON.stringify(companySettings) !== JSON.stringify(localSettings);
      setHasUnsavedChanges(isChanged);
    }
  }, [localSettings, companySettings]);

  const handleSave = async () => {
    if (!localSettings) return;
    setIsSaving(true);
    
    // Validation
    if (localSettings.procurement.approvalLimit < 0 || localSettings.inventory.lowStockThreshold < 0) {
      onShowToast("Numeric values cannot be negative.", "error");
      setIsSaving(false);
      return;
    }

    const { error } = await updateSettings(localSettings);
    
    setIsSaving(false);
    if (error) {
      onShowToast("Failed to save configuration. " + error.message, "error");
    } else {
      onShowToast("Enterprise settings synchronized securely.", "success");
      setLastSaved(new Date());
      // Re-copy from context to clear unsaved state (handled by useEffect)
    }
  };

  const updateSection = (section: keyof CompanySettings, key: string, value: any) => {
    if (!localSettings) return;
    setLocalSettings({
      ...localSettings,
      [section]: {
        ...(localSettings[section] as any),
        [key]: value
      }
    });
  };

  if (!localSettings) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4 animate-pulse">
        <div className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center">
          <Settings className="w-6 h-6 text-indigo-400 animate-spin" />
        </div>
        <p className="text-sm font-medium text-slate-500">Loading Enterprise Configuration...</p>
      </div>
    );
  }

  const tabs = [
    { id: "Company Preferences", icon: Building2 },
    { id: "Procurement", icon: Settings },
    { id: "Inventory", icon: Package },
    { id: "Notifications", icon: Bell },
    { id: "Security", icon: Shield },
    { id: "Users & Permissions", icon: Users },
    { id: "System Preferences", icon: Globe },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/50 p-6 rounded-[24px] border border-white/60 shadow-sm backdrop-blur-xl">
        <div>
          <h1 className="font-display font-black text-2xl tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-indigo-600" />
            <span>Administration Center</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium max-w-xl">Configure global enterprise rules, security policies, and workspace preferences. Changes here affect the entire organization.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {lastSaved && !hasUnsavedChanges && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          )}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Unsaved changes</span>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || isSaving}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm ${
              hasUnsavedChanges 
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white cursor-pointer' 
                : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
            }`}
          >
            {isSaving ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'Saving...' : 'Save Configuration'}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Vertical Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-1 p-2 bg-white/60 border border-white/80 rounded-[24px] shadow-sm backdrop-blur-xl sticky top-6">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  isActive 
                    ? 'bg-white shadow-[0_4px_12px_rgba(0,0,0,0.03)] text-indigo-700 border border-indigo-100/50' 
                    : 'text-slate-600 hover:bg-white/40 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.id}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="flex-1 w-full p-8 rounded-[32px] border border-white/80 bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/5 via-purple-500/5 to-transparent rounded-bl-full -z-10 blur-3xl pointer-events-none" />

          {/* COMPANY PREFERENCES */}
          {activeTab === "Company Preferences" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/60 pb-4 mb-6">
                <h2 className="text-lg font-black text-slate-800">Company Preferences</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Manage organizational identity and localization settings.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Industry Sector</label>
                  <select 
                    value={localSettings.company.industry} 
                    onChange={e => updateSection('company', 'industry', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Primary Currency</label>
                  <select 
                    value={localSettings.company.currency} 
                    onChange={e => updateSection('company', 'currency', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="INR">INR (₹) - Indian Rupee</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Time Zone</label>
                  <select 
                    value={localSettings.company.timezone} 
                    onChange={e => updateSection('company', 'timezone', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="PST">Pacific Time (US & Canada)</option>
                    <option value="EST">Eastern Time (US & Canada)</option>
                    <option value="IST">Indian Standard Time</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Date Format</label>
                  <select 
                    value={localSettings.company.dateFormat} 
                    onChange={e => updateSection('company', 'dateFormat', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY (US Standard)</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY (EU Standard)</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD (ISO 8601)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* PROCUREMENT */}
          {activeTab === "Procurement" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/60 pb-4 mb-6">
                <h2 className="text-lg font-black text-slate-800">Procurement & Sourcing</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Set authorization limits and default behaviors for Purchase Orders.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Manager Approval Limit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-slate-400 font-medium text-sm">$</span>
                    <input 
                      type="number" 
                      value={localSettings.procurement.approvalLimit} 
                      onChange={e => updateSection('procurement', 'approvalLimit', parseInt(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Maximum PO amount a manager can approve without Admin intervention.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Auto-Approval Threshold</label>
                  <div className="relative">
                    <span className="absolute left-4 top-2.5 text-slate-400 font-medium text-sm">$</span>
                    <input 
                      type="number" 
                      value={localSettings.procurement.autoApproveThreshold} 
                      onChange={e => updateSection('procurement', 'autoApproveThreshold', parseInt(e.target.value))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Purchase orders under this amount are approved automatically.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Default Lead Time (Days)</label>
                  <input 
                    type="number" 
                    value={localSettings.procurement.defaultLeadTime} 
                    onChange={e => updateSection('procurement', 'defaultLeadTime', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY */}
          {activeTab === "Inventory" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/60 pb-4 mb-6">
                <h2 className="text-lg font-black text-slate-800">Inventory Management</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure stock valuation methods and threshold triggers.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Global Low-Stock Threshold</label>
                  <input 
                    type="number" 
                    value={localSettings.inventory.lowStockThreshold} 
                    onChange={e => updateSection('inventory', 'lowStockThreshold', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="text-[10px] text-slate-500">Alert triggers when SKU quantity falls below this value.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Inventory Valuation Method</label>
                  <select 
                    value={localSettings.inventory.valuationMethod} 
                    onChange={e => updateSection('inventory', 'valuationMethod', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="FIFO">FIFO (First-In, First-Out)</option>
                    <option value="LIFO">LIFO (Last-In, First-Out)</option>
                    <option value="WAC">Weighted Average Cost</option>
                  </select>
                </div>

                <div className="space-y-4 pt-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${localSettings.inventory.autoReorder ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${localSettings.inventory.autoReorder ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={localSettings.inventory.autoReorder}
                      onChange={e => updateSection('inventory', 'autoReorder', e.target.checked)}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">Automatic Reordering</span>
                      <span className="text-[10px] text-slate-500">Generate draft PRs when stock drops below threshold.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === "Notifications" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/60 pb-4 mb-6">
                <h2 className="text-lg font-black text-slate-800">Notification Matrix</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Control which events dispatch alerts across the organization.</p>
              </div>
              
              <div className="space-y-5 max-w-lg">
                {[
                  { key: 'emailEnabled', label: 'Global Email Notifications', desc: 'Allow the system to dispatch external emails to employees.' },
                  { key: 'purchaseAlerts', label: 'Purchase Approval Alerts', desc: 'Notify managers when a Purchase Order exceeds auto-approval limits.' },
                  { key: 'inventoryAlerts', label: 'Critical Inventory Warnings', desc: 'Dispatch alerts for SLA-critical stock shortages.' },
                  { key: 'paymentReminders', label: 'Vendor Payment Reminders', desc: 'Send automated reminders for upcoming net-30 vendor invoices.' },
                ].map(setting => (
                  <label key={setting.key} className="flex items-start gap-4 cursor-pointer p-4 rounded-xl border border-white/50 bg-white/30 hover:bg-white/50 transition-colors">
                    <div className={`mt-0.5 w-10 h-5 shrink-0 rounded-full flex items-center px-1 transition-colors ${(localSettings.notifications as any)[setting.key] ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${(localSettings.notifications as any)[setting.key] ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={(localSettings.notifications as any)[setting.key]}
                      onChange={e => updateSection('notifications', setting.key, e.target.checked)}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">{setting.label}</span>
                      <span className="text-xs text-slate-500 font-medium">{setting.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === "Security" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/60 pb-4 mb-6">
                <h2 className="text-lg font-black text-slate-800">Security & Identity</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Enforce strict access controls and session policies.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-white/50 bg-white/30 hover:bg-white/50 transition-colors">
                    <div className={`w-10 h-5 shrink-0 rounded-full flex items-center px-1 transition-colors ${localSettings.security.twoFactor ? 'bg-rose-500' : 'bg-slate-300'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${localSettings.security.twoFactor ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={localSettings.security.twoFactor}
                      onChange={e => updateSection('security', 'twoFactor', e.target.checked)}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">Require 2FA for Critical Actions</span>
                      <span className="text-[10px] text-slate-500">Mandate OTP signoff for POs &gt; $50k.</span>
                    </div>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Session Timeout (Minutes)</label>
                  <input 
                    type="number" 
                    value={localSettings.security.sessionTimeout} 
                    onChange={e => updateSection('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <p className="text-[10px] text-slate-500">Idle users will be automatically logged out after this duration.</p>
                </div>
              </div>
              
              <div className="mt-8 p-4 rounded-2xl bg-indigo-950/5 border border-indigo-500/10 text-slate-600">
                <div className="flex gap-2 items-start">
                  <Shield className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <span className="font-extrabold text-indigo-900 block text-sm">Enterprise Security Audit</span>
                    <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">This workspace is protected by Supabase Row Level Security. All modifications to settings and inventory balances are strictly verified against your Admin JWT cryptographic signature.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USERS & PERMISSIONS */}
          {activeTab === "Users & Permissions" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/60 pb-4 mb-6">
                <h2 className="text-lg font-black text-slate-800">Users & Roles</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Configure default behaviors for new employees joining the organization.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Default Role for New Users</label>
                  <select 
                    value={localSettings.users.defaultRole} 
                    onChange={e => updateSection('users', 'defaultRole', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="viewer">Viewer (Read-only)</option>
                    <option value="warehouse_manager">Warehouse Manager</option>
                    <option value="inventory_manager">Inventory Manager</option>
                    <option value="procurement_manager">Procurement Manager</option>
                  </select>
                  <p className="text-[10px] text-slate-500">Users invited via magic link will be assigned this role by default.</p>
                </div>
              </div>
            </div>
          )}

          {/* SYSTEM PREFERENCES */}
          {activeTab === "System Preferences" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-200/60 pb-4 mb-6">
                <h2 className="text-lg font-black text-slate-800">System Defaults</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Interface configuration and styling rules.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Application Language</label>
                  <select 
                    value={localSettings.system.language} 
                    onChange={e => updateSection('system', 'language', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="en">English (US)</option>
                    <option value="en-gb">English (UK)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">Default Workspace Theme</label>
                  <select 
                    value={localSettings.system.theme} 
                    onChange={e => updateSection('system', 'theme', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/60 bg-white/60 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="light">Premium Light (Recommended)</option>
                    <option value="dark">Charcoal Dark Mode</option>
                    <option value="system">Sync with System Settings</option>
                  </select>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
