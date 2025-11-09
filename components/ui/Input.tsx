import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-secondary-900">
            {label}
          </label>
        )}
        <input
          className={cn(
            'block w-full h-11 rounded-lg border border-secondary-300 px-3 py-2 text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 bg-white',
            error && 'border-error-500 focus:ring-error-500',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary-50',
            className
          )}
          ref={ref}
          {...props}
        />
        {helperText && !error && (
          <p className="text-sm text-secondary-600">{helperText}</p>
        )}
        {error && (
          <p className="text-sm text-error-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
