import React from "react";
import { HelpCircle, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

interface HighlightTextProps {
  text: string;
  search: string;
}

export function HighlightText({ text, search }: HighlightTextProps) {
  if (!search) return <>{text}</>;
  const parts = text.split(new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === search.toLowerCase() ? (
          <mark key={i} className="bg-indigo-500/30 text-indigo-200 font-semibold px-0.5 rounded border border-indigo-500/20">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

interface EmptyStateProps {
  icon?: any;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon = HelpCircle, 
  title, 
  description, 
  actionLabel, 
  onAction 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-slate-900 bg-[#040815]/60 rounded-2xl my-4 space-y-4 max-w-xl mx-auto glow-card">
      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-lg shadow-indigo-500/5 animate-pulse">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-slate-400">{title}</h3>
        <p className="text-xs text-slate-500 max-w-md leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-lg hover:shadow-indigo-500/20 cursor-pointer active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

interface SortIndicatorProps {
  active: boolean;
  order: "asc" | "desc";
}

export function SortIndicator({ active, order }: SortIndicatorProps) {
  if (!active) {
    return <ChevronsUpDown className="inline-block w-3.5 h-3.5 text-slate-600 ml-1.5 align-middle opacity-50 hover:opacity-100 transition-opacity" />;
  }
  return order === "asc" ? (
    <ChevronUp className="inline-block w-3.5 h-3.5 text-indigo-400 ml-1.5 align-middle" />
  ) : (
    <ChevronDown className="inline-block w-3.5 h-3.5 text-indigo-400 ml-1.5 align-middle" />
  );
}
