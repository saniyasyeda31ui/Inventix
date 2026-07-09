import React, { useState } from "react";
import { 
  Building2, MapPin, Award, CheckCircle, CreditCard, Shield, Sliders
} from "lucide-react";

interface CompanySectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
}

export default function CompanySection({ onShowToast }: CompanySectionProps) {
  const [profile, setProfile] = useState({
    name: "Acme Industrial Sourcing Hub",
    legalName: "Acme Sourcing Partners LLC",
    taxId: "TX-99824-A90",
    dunsNumber: "23-991-8274",
    hqAddress: "100 Industrial Pkwy, Suite 400, Chicago, IL 60611",
    subscriptionPlan: "Enterprise Gold ERP Package",
    billingCycle: "Annual (Next renewal Jan 15, 2027)",
    paymentMethod: "Corporate Wire Transfer •••• 9811",
    dataRegion: "US Central (Iowa) - Multi-Zone Replication"
  });

  const handleTriggerReSync = () => {
    onShowToast("Dispatched organizational metadata sync across 5 global hubs.", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <span>Corporate Entity Profile</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage legal registration details, multi-country entity structures, tax parameters, and enterprise licensing.</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Entity Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/60/60 pb-4">
            <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">
              Organizational Metadata
            </h2>
            <button 
              onClick={handleTriggerReSync}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              Trigger Entity Sync
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            
            <div className="space-y-1">
              <span className="text-slate-500 font-mono">Organization Name</span>
              <span className="text-slate-900 font-semibold block">{profile.name}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-mono">Legal Registered Name</span>
              <span className="text-slate-900 font-semibold block">{profile.legalName}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-mono">Tax / EIN ID Number</span>
              <span className="text-slate-900 font-semibold block font-mono">{profile.taxId}</span>
            </div>

            <div className="space-y-1">
              <span className="text-slate-500 font-mono">DUNS Corporate Rating Code</span>
              <span className="text-slate-900 font-semibold block font-mono">{profile.dunsNumber}</span>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-slate-500 font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                <span>Global Headquarters Address</span>
              </span>
              <span className="text-slate-900 font-semibold block">{profile.hqAddress}</span>
            </div>

          </div>
        </div>

        {/* Subscription & Cloud Security */}
        <div className="p-6 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest border-b border-white/60/60 pb-4">
              Licensing & Security
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300">Enterprise Gold Plan</span>
                  <span className="text-[9px] font-bold text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded uppercase">Active</span>
                </div>
                <p className="text-[10px] text-slate-600">Licensed up to 150 administrative users. Full database replication active.</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-mono text-[10px] block">Cloud Host Region</span>
                <span className="text-slate-800 block font-semibold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  {profile.dataRegion}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-mono text-[10px] block">Corporate Billing Cycle</span>
                <span className="text-slate-800 block font-semibold">{profile.billingCycle}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/60/60 text-[10px] text-slate-600 font-mono">
            Security Status: Compliance SOC-2 Type II Certified
          </div>
        </div>

      </div>

    </div>
  );
}
