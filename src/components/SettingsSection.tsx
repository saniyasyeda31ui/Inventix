import React, { useState } from "react";
import { 
  Sliders, Save, Shield, Eye, RefreshCw, Bell, Globe, 
  HelpCircle, Settings, SlidersHorizontal
} from "lucide-react";

interface SettingsSectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
}

export default function SettingsSection({ onShowToast }: SettingsSectionProps) {
  const [currency, setCurrency] = useState("USD");
  const [alertThreshold, setAlertThreshold] = useState("5000");
  const [autoApproveLimit, setAutoApproveLimit] = useState("10000");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySlack, setNotifySlack] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast("Sourcing configuration saved and synchronized to local storage.", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <span>System Configuration & Preferences</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Configure global purchase order approval rules, safety stock notifications, and administrator authorization settings.</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Sourcing Rules */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl space-y-6">
          <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-white/60/60 pb-4">
            Procurement & Inventory Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            
            <div className="space-y-2">
              <label className="text-slate-600 font-mono block">Primary Reporting Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/60 bg-white/60 text-slate-800 focus:outline-none focus:border-indigo-500/50"
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="SGD">SGD (S$) - Singapore Dollar</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 font-mono block">Default Low-Stock Safety Threshold</label>
              <input
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/60 bg-white/60 text-slate-800 focus:outline-none focus:border-indigo-500/50 font-mono"
              />
              <span className="text-[10px] text-slate-500 block">Trigger warning alert when physical quantity falls below this limit.</span>
            </div>

            <div className="space-y-2">
              <label className="text-slate-600 font-mono block">Autonomous PO Approval Limit</label>
              <input
                type="number"
                value={autoApproveLimit}
                onChange={(e) => setAutoApproveLimit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/60 bg-white/60 text-slate-800 focus:outline-none focus:border-indigo-500/50 font-mono"
              />
              <span className="text-[10px] text-slate-500 block">Purchase orders under this amount are approved automatically.</span>
            </div>

          </div>

          {/* Notifications toggles */}
          <div className="space-y-4 pt-4 border-t border-white/60/60">
            <h3 className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400" />
              <span>Sourcing Notification Matrix</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="mt-1 rounded border-white/60 bg-white/60 text-indigo-600 focus:ring-0"
                />
                <div className="space-y-0.5">
                  <span className="text-slate-900 font-semibold block">SLA Critical Stock Warning Emails</span>
                  <p className="text-[10px] text-slate-500">Dispatch direct alert notifications to site managers immediately on threshold violations.</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={notifySlack}
                  onChange={(e) => setNotifySlack(e.target.checked)}
                  className="mt-1 rounded border-white/60 bg-white/60 text-indigo-600 focus:ring-0"
                />
                <div className="space-y-0.5">
                  <span className="text-slate-900 font-semibold block">Autonomous Slack Channel Sourcing Logs</span>
                  <p className="text-[10px] text-slate-500">Relay all critical reorder triggers and contract changes directly to procurement slack channel.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Security & Access logs info */}
        <div className="p-6 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-white/60/60 pb-4">
              Security & Identity Tiers
            </h2>

            <div className="space-y-3.5 text-xs">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={twoFactor}
                  onChange={(e) => setTwoFactor(e.target.checked)}
                  className="mt-1 rounded border-white/60 bg-white/60 text-indigo-600 focus:ring-0"
                />
                <div className="space-y-0.5">
                  <span className="text-slate-900 font-semibold block">Mandate 2-Factor Authentication</span>
                  <p className="text-[10px] text-slate-500">Require mobile OTP signoff for all POs greater than $50,000.</p>
                </div>
              </label>

              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/10 text-slate-600 space-y-1.5 leading-relaxed">
                <span className="font-bold text-indigo-300 block">Security Audit trail:</span>
                <p className="text-[10px]">Your current connection is authenticated with full admin access keys. All inventory movements log your IP securely.</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Sourcing Rules</span>
          </button>
        </div>

      </form>

    </div>
  );
}
