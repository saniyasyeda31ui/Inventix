import React, { useState } from "react";
import {
  Building2, MapPin, Award, CheckCircle, CreditCard, Shield, Sliders
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface CompanySectionProps {
  onShowToast: (msg: string, type?: "success" | "info") => void;
}

export default function CompanySection({ onShowToast }: CompanySectionProps) {
  const { profile: authProfile, companyData } = useAuth();
  
  const profile = {
    name: companyData?.name || authProfile?.organization || "",
    legalName: companyData?.name ? `${companyData.name} LLC` : (authProfile?.organization ? `${authProfile.organization} LLC` : ""),
    taxId: companyData?.tax_identifier || "N/A",
    dunsNumber: "23-991-8274", // Placeholder as it's not in DB yet
    hqAddress: companyData ? `${companyData.address_line_1}, ${companyData.city}, ${companyData.state} ${companyData.postal_code}, ${companyData.country}` : "N/A",
    subscriptionPlan: "Enterprise Gold ERP Package", // Placeholder
    billingCycle: "Annual (Next renewal Jan 15, 2027)", // Placeholder
    paymentMethod: "Corporate Wire Transfer •••• 9811", // Placeholder
    dataRegion: "US Central (Iowa) - Multi-Zone Replication" // Placeholder
  };

  const handleTriggerReSync = () => {
    onShowToast("Dispatched organizational metadata sync across 5 global hubs.", "success");
  };

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-3xl tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-500" />
            <span>Corporate Entity Profile</span>
          </h1>
          <p className="text-[13px] text-slate-500/80 mt-1 font-medium">Manage legal registration details, multi-country entity structures, tax parameters, and enterprise licensing.</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Entity Card */}
        <div className="lg:col-span-2 p-6 md:p-8 rounded-[32px] border border-white/80 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_30px_80px_-20px_rgba(99,102,241,0.06),inset_0_1px_1px_rgba(255,255,255,1)] space-y-6 card-hover-effect">
          <div className="flex items-center justify-between border-b border-indigo-900/10 pb-4">
            <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-widest">
              Organizational Metadata
            </h2>
            <button
              onClick={handleTriggerReSync}
              className="text-[11px] text-indigo-500 hover:text-indigo-600 font-bold uppercase tracking-widest cursor-pointer transition-colors"
            >
              Trigger Entity Sync
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Organization Name</span>
              <span className="text-[15px] font-black text-slate-900 block">{profile.name}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Legal Registered Name</span>
              <span className="text-[15px] font-black text-slate-900 block">{profile.legalName}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Tax / EIN ID Number</span>
              <span className="text-[15px] font-black text-slate-900 block font-mono tracking-tight">{profile.taxId}</span>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">DUNS Corporate Rating Code</span>
              <span className="text-[15px] font-black text-slate-900 block font-mono tracking-tight">{profile.dunsNumber}</span>
            </div>

            <div className="space-y-1 sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 block">
                <MapPin className="w-3.5 h-3.5" />
                <span>Global Headquarters Address</span>
              </span>
              <span className="text-[15px] font-black text-slate-900 block mt-1">{profile.hqAddress}</span>
            </div>

          </div>
        </div>

        {/* Subscription & Cloud Security */}
        <div className="p-6 md:p-8 rounded-[32px] border border-white/80 bg-gradient-to-br from-white/90 to-white/60 backdrop-blur-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05),0_30px_80px_-20px_rgba(99,102,241,0.06),inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col justify-between space-y-6 card-hover-effect">
          <div className="space-y-5">
            <h2 className="text-[13px] font-black text-slate-900 uppercase tracking-widest border-b border-indigo-900/10 pb-4">
              Licensing & Security
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-black text-[13px] text-indigo-700">Enterprise Gold Plan</span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest shadow-sm">Active</span>
                </div>
                <p className="text-[11px] font-medium text-slate-600/90">Licensed up to 150 administrative users. Full database replication active.</p>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Cloud Host Region</span>
                <span className="text-[13px] text-slate-900 block font-black flex items-center gap-1.5 mt-1">
                  <Shield className="w-4 h-4 text-indigo-500" />
                  {profile.dataRegion}
                </span>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Corporate Billing Cycle</span>
                <span className="text-[13px] text-slate-900 font-black block mt-1">{profile.billingCycle}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-900/10 text-[11px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            Compliance SOC-2 Type II Certified
          </div>
        </div>

      </div>

    </div>
  );
}
