import React from "react";

interface SkeletonLoaderProps {
  tab?: string;
  count?: number;
  height?: string;
  className?: string;
}

export default function SkeletonLoader({ tab, className }: SkeletonLoaderProps) {
  // Determine loader type based on selected tab
  if (tab === "Overview") {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Welcome Block Skeleton */}
        <div className="p-6 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl h-28 flex flex-col justify-between" />

        {/* KPI Grid */}
        <div className="space-y-3">
          <div className="h-3 w-32 bg-slate-800 rounded mb-2" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 h-28 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl space-y-3">
                <div className="h-2 w-12 bg-slate-800 rounded" />
                <div className="h-6 w-24 bg-slate-800 rounded" />
                <div className="h-2 w-16 bg-slate-800 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Skeleton */}
        <div className="space-y-3">
          <div className="h-3 w-32 bg-slate-800 rounded mb-2" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 h-24 rounded-xl border border-white/60 bg-white/30 backdrop-blur-xl" />
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="p-5 h-64 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl space-y-4" />
          <div className="p-5 h-64 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl space-y-4" />
        </div>
      </div>
    );
  }

  if (tab === "AI Insights") {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header */}
        <div className="h-10 w-80 bg-slate-800 rounded" />

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 h-24 rounded-2xl border border-white/60 bg-white/50 backdrop-blur-xl" />
          ))}
        </div>

        {/* Large dual layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-96 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl" />
          <div className="h-96 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-xl" />
        </div>
      </div>
    );
  }

  // Default layout for standard tables and forms
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-800 rounded" />
          <div className="h-3 w-72 bg-slate-800 rounded" />
        </div>
        <div className="h-9 w-28 bg-slate-800 rounded-xl" />
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl border border-white/60 bg-white/40 backdrop-blur-xl h-16 flex items-center justify-between" />

      {/* Main Table Block */}
      <div className="border border-white/60 rounded-2xl bg-white/30 backdrop-blur-xl overflow-hidden shadow-[0_15px_30px_-10px_rgba(0,0,0,0.05)]">
        {/* Table Header Row */}
        <div className="h-11 bg-white/40 backdrop-blur-md border-b border-white/60 flex items-center px-4 justify-between">
          <div className="h-3.5 w-16 bg-slate-800 rounded" />
          <div className="h-3.5 w-36 bg-slate-800 rounded" />
          <div className="h-3.5 w-24 bg-slate-800 rounded" />
          <div className="h-3.5 w-20 bg-slate-800 rounded" />
          <div className="h-3.5 w-12 bg-slate-800 rounded" />
        </div>

        {/* Rows */}
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/40">
              <div className="h-3 w-16 bg-slate-800 rounded" />
              <div className="h-3 w-40 bg-slate-800 rounded" />
              <div className="h-3 w-20 bg-slate-800 rounded" />
              <div className="h-3 w-28 bg-slate-800 rounded" />
              <div className="h-3 w-10 bg-slate-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
