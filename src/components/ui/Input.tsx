import React, { useState } from 'react';
import { Eye, EyeOff, Search, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type InputVariant = 'default' | 'success' | 'warning' | 'error';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  variant?: InputVariant;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  isSearch?: boolean;
  showPasswordStrength?: boolean;
}

export function Input({
  className = '',
  label,
  variant = 'default',
  leftIcon,
  rightIcon,
  helperText,
  isSearch = false,
  showPasswordStrength = false,
  type = 'text',
  value,
  onChange,
  required,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const currentType = isPassword && showPassword ? 'text' : type;
  
  // Checking if there is value to float the label
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const isFloating = isFocused || hasValue || props.placeholder;

  // Variants styling
  const variantStyles = {
    default: 'border-border focus:border-brand-500 focus:ring-brand-500/20 text-text-primary',
    success: 'border-success focus:border-success focus:ring-success/20 text-text-primary',
    warning: 'border-warning focus:border-warning focus:ring-warning/20 text-text-primary',
    error: 'border-error focus:border-error focus:ring-error/20 text-text-primary',
  };

  const statusIcons = {
    default: null,
    success: <CheckCircle className="w-5 h-5 text-success" />,
    warning: <AlertCircle className="w-5 h-5 text-warning" />,
    error: <XCircle className="w-5 h-5 text-error" />
  };

  // Password strength logic (simple demo)
  const getPasswordStrength = () => {
    const val = String(value || '');
    if (val.length === 0) return 0;
    if (val.length < 6) return 1;
    if (val.length < 10) return 2;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) return 4;
    return 3;
  };

  const strength = getPasswordStrength();
  const strengthColors = ['bg-border', 'bg-error', 'bg-warning', 'bg-brand-400', 'bg-success'];
  const currentStrengthColor = strengthColors[strength];

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative group">
        {/* Left Icon */}
        {(leftIcon || isSearch) && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors transition-fast group-focus-within:text-brand-500 z-10">
            {isSearch ? <Search className="w-5 h-5" /> : leftIcon}
          </div>
        )}

        {/* Input Field */}
        <input
          type={currentType}
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          className={`
            w-full bg-surface-subtle border rounded-lg px-4 pt-6 pb-2
            outline-none transition-all transition-medium transition-smooth
            focus:bg-surface focus:shadow-glow focus:ring-4
            ${leftIcon || isSearch ? 'pl-11' : ''}
            ${rightIcon || isPassword || variant !== 'default' ? 'pr-11' : ''}
            ${variantStyles[variant]}
          `}
          {...props}
        />

        {/* Floating Label */}
        <label
          className={`
            absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none
            transition-all transition-medium transition-smooth origin-left
            ${leftIcon || isSearch ? 'left-11' : ''}
            ${isFloating 
              ? '-translate-y-[20px] scale-75 text-text-secondary font-medium' 
              : 'text-text-tertiary'}
            ${isFocused ? 'text-brand-600' : ''}
            ${variant === 'error' ? 'text-error' : ''}
          `}
        >
          {label} {required && <span className="text-error">*</span>}
        </label>

        {/* Right Actions / Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {variant !== 'default' && statusIcons[variant]}
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-tertiary hover:text-text-primary transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {rightIcon && !isPassword && (
            <div className="text-text-tertiary">
              {rightIcon}
            </div>
          )}
        </div>
      </div>

      {/* Password Strength Indicator */}
      {isPassword && showPasswordStrength && (
        <div className="mt-2">
          <div className="flex gap-1 h-1.5">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`flex-1 rounded-full transition-colors transition-medium ${
                  strength >= level ? currentStrengthColor : 'bg-border-subtle'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-text-secondary mt-1 text-right">
            {strength === 0 && 'Enter password'}
            {strength === 1 && 'Weak'}
            {strength === 2 && 'Fair'}
            {strength === 3 && 'Good'}
            {strength === 4 && 'Strong'}
          </p>
        </div>
      )}

      {/* Helper Text */}
      <AnimatePresence>
        {helperText && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-sm mt-1.5 ${variant === 'error' ? 'text-error' : variant === 'warning' ? 'text-warning' : variant === 'success' ? 'text-success' : 'text-text-secondary'}`}
          >
            {helperText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
