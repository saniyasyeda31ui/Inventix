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
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-indigo-500" />
            <span>System Configuration & Preferences</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Configure global purchase order approval rules, safety stock notifications, and administrator authorization settings.</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Sourcing Rules */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-[32px] border border-white/80 bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_30px_80px_-20px_rgba(99,102,241,0.06),inset_0_1px_1px_rgba(255,255,255,1)] relative overflow-hidden space-y-6 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-bl-full -z-10 group-hover:from-indigo-500/20 transition-all duration-1000 blur-3xl pointer-events-none" />
          
          <h2 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-widest border-b border-white/60/60 pb-4 relative z-10">
            Procurement & Inventory Rules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs relative z-10">
            
            <div className="space-y-2">
              <label className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block mb-1">Primary Reporting Currency</label>
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
              <label className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block mb-1">Default Low-Stock Safety Threshold</label>
              <input
                type="number"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/60 bg-white/60 text-slate-800 focus:outline-none focus:border-indigo-500/50 font-mono"
              />
              <span className="text-[10px] text-slate-500 block">Trigger warning alert when physical quantity falls below this limit.</span>
            </div>

            <div className="space-y-2">
              <label className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider block mb-1">Autonomous PO Approval Limit</label>
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
          <div className="space-y-4 pt-4 border-t border-white/60/60 relative z-10">
            <h3 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
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
                  <span className="font-extrabold text-slate-950 block">SLA Critical Stock Warning Emails</span>
                  <p className="text-[10px] text-slate-500 font-medium">Dispatch direct alert notifications to site managers immediately on threshold violations.</p>
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
                  <span className="font-extrabold text-slate-950 block">Autonomous Slack Channel Sourcing Logs</span>
                  <p className="text-[10px] text-slate-500 font-medium">Relay all critical reorder triggers and contract changes directly to procurement slack channel.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Security & Access logs info */}
        <div className="p-6 md:p-8 rounded-[32px] border border-white/80 bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_30px_80px_-20px_rgba(99,102,241,0.06),inset_0_1px_1px_rgba(255,255,255,1)] relative overflow-hidden flex flex-col justify-between space-y-6 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/5 to-transparent rounded-bl-full -z-10 group-hover:from-indigo-500/20 transition-all duration-1000 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-400/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="space-y-5 relative z-10">
            <h2 className="text-[11px] font-extrabold text-slate-800 uppercase tracking-widest border-b border-white/60/60 pb-4">
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
                  <span className="font-extrabold text-slate-950 block">Mandate 2-Factor Authentication</span>
                  <p className="text-[10px] text-slate-500 font-medium">Require mobile OTP signoff for all POs greater than $50,000.</p>
                </div>
              </label>

              <div className="p-4 rounded-2xl bg-indigo-950/5 border border-indigo-500/10 text-slate-600 space-y-1.5 leading-relaxed">
                <span className="font-extrabold text-indigo-700 block">Security Audit trail:</span>
                <p className="text-[10px] font-medium text-slate-500">Your current connection is authenticated with full admin access keys. All inventory movements log your IP securely.</p>
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
