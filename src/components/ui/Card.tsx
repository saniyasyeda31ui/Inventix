import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export type CardVariant = 
  | 'solid' 
  | 'glass' 
  | 'gradient' 
  | 'kpi' 
  | 'analytics' 
  | 'chart' 
  | 'interactive' 
  | 'hero' 
  | 'feature' 
  | 'floating';

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: CardVariant;
  children: React.ReactNode;
  animated?: boolean;
  delay?: number;
}

export function Card({
  className = '',
  variant = 'solid',
  children,
  animated = false,
  delay = 0,
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl overflow-hidden transition-all transition-medium transition-smooth';

  const variants = {
    solid: 'bg-surface border border-border shadow-sm',
    glass: 'glass-medium',
    gradient: 'bg-gradient-to-br from-surface to-brand-50 border border-brand-100 shadow-sm',
    kpi: 'bg-surface border border-border shadow-sm hover:shadow-md hover:-translate-y-1',
    analytics: 'bg-surface border border-border shadow-sm',
    chart: 'bg-surface border border-border shadow-sm p-4',
    interactive: 'bg-surface border border-border cursor-pointer hover:border-brand-300 hover:shadow-md hover:ring-2 hover:ring-brand-100',
    hero: 'bg-brand-900 text-white shadow-xl relative overflow-hidden',
    feature: 'bg-brand-50 border border-brand-100 shadow-sm',
    floating: 'bg-surface shadow-floating border border-border/50 animate-float-blob',
  };

  const Component = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }
  } : {};

  // For framer-motion compatibility when not animated
  const finalProps = animated ? { ...props, ...animationProps } : props as any;

  return (
    <Component
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...finalProps}
    >
      {children}
    </Component>
  );
}
