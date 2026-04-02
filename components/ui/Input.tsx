'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium uppercase tracking-widest text-chalk-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-sm border bg-ink-muted px-3 text-sm text-chalk placeholder:text-chalk-muted/50',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/60',
            error
              ? 'border-crimson/60 focus:ring-crimson/30'
              : 'border-ink-border hover:border-ink-border/80',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-crimson">{error}</p>}
        {hint && !error && (
          <p className="text-xs text-chalk-muted/60">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
