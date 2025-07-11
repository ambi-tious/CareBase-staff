/**
 * Input Field Atom
 *
 * Reusable input field component with validation support
 */

import type React from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isRequired?: boolean;
  variant?: 'default' | 'error' | 'success';
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, isRequired = false, variant = 'default', className, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const getVariantStyles = () => {
      switch (variant) {
        case 'error':
          return 'border-red-300 focus:ring-red-500 focus:border-red-500';
        case 'success':
          return 'border-green-300 focus:ring-green-500 focus:border-green-500';
        default:
          return 'border-gray-300 focus:ring-carebase-blue focus:border-carebase-blue';
      }
    };

    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-3 py-2 border rounded-md transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            'placeholder:text-gray-400',
            getVariantStyles(),
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-600 mt-1" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
