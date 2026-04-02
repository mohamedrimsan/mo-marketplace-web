'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses = {
  primary:
    'bg-gold text-ink font-semibold hover:bg-gold-light active:bg-gold-dark disabled:bg-gold/40 disabled:text-ink/40',
  secondary:
    'bg-ink-muted text-chalk border border-ink-border hover:bg-ink-soft hover:border-gold/30 disabled:opacity-40',
  ghost:
    'text-chalk-muted hover:bg-ink-muted hover:text-chalk disabled:opacity-40',
  danger:
    'bg-crimson/10 text-crimson border border-crimson/30 hover:bg-crimson/20 disabled:opacity-40',
  outline:
    'border border-gold/40 text-gold hover:bg-gold/10 disabled:opacity-40',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink select-none cursor-pointer',
          variantClasses[variant],
          sizeClasses[size],
          (disabled || isLoading) && 'cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
