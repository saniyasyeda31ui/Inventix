import React from 'react';
import { motion } from 'motion/react';

export type IconWrapperVariant = 'default' | 'gradient' | 'glass' | 'status' | 'animated' | 'metric';
export type IconStatus = 'success' | 'warning' | 'error' | 'info';

export interface IconWrapperProps {
  icon: React.ElementType;
  variant?: IconWrapperVariant;
  status?: IconStatus;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  iconClassName?: string;
}

export function IconWrapper({
  icon: Icon,
  variant = 'default',
  status = 'info',
  size = 'md',
  className = '',
  iconClassName = '',
}: IconWrapperProps) {
  const sizes = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-2.5',
    xl: 'w-16 h-16 p-3.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const statusColors = {
    success: 'bg-success-bg text-success',
    warning: 'bg-warning-bg text-warning',
    error: 'bg-error-bg text-error',
    info: 'bg-brand-50 text-brand-600',
  };

  const variants = {
    default: 'bg-surface-subtle text-text-secondary rounded-full',
    gradient: 'bg-gradient-to-br from-brand-500 to-brand-700 text-white rounded-full shadow-md shadow-brand-500/20',
    glass: 'glass-light text-text-primary rounded-full',
    status: `${statusColors[status]} rounded-full`,
    animated: 'bg-brand-50 text-brand-600 rounded-full hover:bg-brand-100 transition-colors',
    metric: 'bg-surface border border-border text-text-primary rounded-xl shadow-xs',
  };

  const containerClasses = `flex items-center justify-center shrink-0 ${sizes[size]} ${variants[variant]} ${className}`;
  const svgClasses = `${iconSizes[size]} ${iconClassName}`;

  if (variant === 'animated') {
    return (
      <motion.div 
        className={containerClasses}
        whileHover={{ scale: 1.05, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className={svgClasses} />
      </motion.div>
    );
  }

  return (
    <div className={containerClasses}>
      <Icon className={svgClasses} />
    </div>
  );
}
