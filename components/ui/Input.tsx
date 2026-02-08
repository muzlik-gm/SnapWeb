import React, { useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-secondary-900"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            'block w-full h-11 rounded-lg border border-secondary-300 px-3 py-2 text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-colors duration-200 bg-white',
            error && 'border-error-500 focus:ring-error-500',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary-50',
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={cn(
            error ? errorId : undefined,
            helperText && !error ? helperId : undefined
          ) || undefined}
          {...props}
        />
        {helperText && !error && (
          <p id={helperId} className="text-sm text-secondary-600">{helperText}</p>
        )}
        {error && (
          <p id={errorId} className="text-sm text-error-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
