import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, Check } from 'lucide-react';

export type ButtonVariant = 'primary' | 'gradient' | 'secondary' | 'ghost' | 'outline' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isSuccess?: boolean;
  magnetic?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isSuccess = false,
  magnetic = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [rippleStyle, setRippleStyle] = useState<React.CSSProperties>({});
  const [isRippling, setIsRippling] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !buttonRef.current || disabled) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    
    // Ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    setRippleStyle({
      width: size,
      height: size,
      top: y,
      left: x,
    });
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 600);

    onClick?.(e);
  };

  const baseStyles = 'relative inline-flex items-center justify-center font-medium overflow-hidden transition-all transition-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm hover:shadow-md focus:ring-brand-500',
    gradient: 'bg-gradient-to-r from-brand-500 to-brand-700 text-white hover:from-brand-600 hover:to-brand-800 shadow-md hover:shadow-lg hover:shadow-brand-500/30 focus:ring-brand-500 border border-transparent hover:border-white/20',
    secondary: 'bg-surface-subtle text-text-primary hover:bg-border-subtle shadow-xs hover:shadow-sm focus:ring-brand-500',
    ghost: 'bg-transparent text-text-secondary hover:bg-brand-50 hover:text-brand-700 focus:ring-brand-500',
    outline: 'bg-transparent text-text-primary border border-border hover:border-brand-300 hover:bg-brand-50 focus:ring-brand-500',
    danger: 'bg-error text-white hover:bg-red-600 shadow-sm hover:shadow-md focus:ring-error',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 rounded-sm',
    md: 'text-sm px-4 py-2 rounded-md',
    lg: 'text-base px-6 py-3 rounded-lg',
    icon: 'p-2 rounded-md',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <motion.button
      ref={buttonRef}
      className={classes}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: magnetic ? position.x * 0.1 : 0, y: magnetic ? position.y * 0.1 : 0 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={disabled || isLoading || isSuccess}
      {...props}
    >
      {/* Ripple Element */}
      {isRippling && (
        <span 
          className="absolute bg-white/30 rounded-full animate-[ripple_600ms_linear] pointer-events-none"
          style={rippleStyle}
        />
      )}

      {/* Content */}
      <div className={`flex items-center justify-center gap-2 transition-opacity transition-fast ${isLoading || isSuccess ? 'opacity-0' : 'opacity-100'}`}>
        {leftIcon}
        {children}
        {rightIcon}
      </div>

      {/* Loading / Success Overlays */}
      {(isLoading || isSuccess) && (
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <Check className="w-5 h-5" />
            </motion.div>
          )}
        </div>
      )}
    </motion.button>
  );
}
