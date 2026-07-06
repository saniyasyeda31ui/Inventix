import React from 'react';
import { motion } from 'motion/react';
import { Card } from './Card';
import { IconWrapper } from './IconWrapper';

export function HeroBadge({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-brand-200 text-brand-700 text-sm font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer ${className}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
      </span>
      {children}
    </motion.div>
  );
}

export function FloatingKPI({ 
  title, 
  value, 
  trend, 
  icon: Icon,
  className = '',
  delay = 0 
}: { 
  title: string; 
  value: string | number; 
  trend?: string; 
  icon: React.ElementType;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute ${className}`}
    >
      <Card variant="floating" className="p-4 flex items-center gap-4">
        <IconWrapper icon={Icon} variant="gradient" size="lg" />
        <div>
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-2xl font-bold text-text-primary">{value}</h4>
            {trend && <span className="text-success text-xs font-medium">{trend}</span>}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function GradientText({ children, className = '', as: Component = 'span' }: { children: React.ReactNode, className?: string, as?: any }) {
  return (
    <Component className={`bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 ${className}`}>
      {children}
    </Component>
  );
}

export function BackgroundOrb({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute rounded-full blur-[80px] opacity-20 animate-float-blob pointer-events-none ${className}`} />
  );
}

export function GlowRing({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute rounded-full border border-brand-500/30 opacity-50 pointer-events-none ${className}`}>
      <div className="absolute inset-0 rounded-full bg-brand-500/5 blur-xl" />
    </div>
  );
}

export function AnimatedMesh({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 mesh-gradient opacity-30 pointer-events-none mix-blend-overlay ${className}`} />
  );
}
