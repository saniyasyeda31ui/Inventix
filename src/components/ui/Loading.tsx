import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface-subtle animate-pulse rounded-md ${className}`} />
  );
}

export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-surface-subtle rounded-md ${className}`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}

export function PulseLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      <motion.div className="w-2 h-2 bg-brand-500 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
      <motion.div className="w-2 h-2 bg-brand-500 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
      <motion.div className="w-2 h-2 bg-brand-500 rounded-full" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
    </div>
  );
}

export function Spinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg', className?: string }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return <Loader2 className={`animate-spin text-brand-600 ${sizes[size]} ${className}`} />;
}

export function Progress({ value, max = 100, className = '' }: { value: number, max?: number, className?: string }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`h-2 w-full bg-surface-subtle rounded-full overflow-hidden ${className}`}>
      <motion.div 
        className="h-full bg-brand-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[400px] flex items-center justify-center w-full">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-text-secondary text-sm font-medium animate-pulse">Loading experience...</p>
      </div>
    </div>
  );
}
