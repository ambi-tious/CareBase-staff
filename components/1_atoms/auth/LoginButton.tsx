/**
 * Login Button Atom
 * 
 * Specialized button component for login functionality
 */

import type React from 'react';
import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoginButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
}

export const LoginButton = forwardRef<HTMLButtonElement, LoginButtonProps>(
  ({ 
    isLoading = false,
    variant = 'default',
    size = 'md',
    fullWidth = true,
    loadingText = 'ログイン中...',
    children = 'ログイン',
    className,
    disabled,
    ...props 
  }, ref) => {
    const getSizeStyles = () => {
      switch (size) {
        case 'sm':
          return 'h-8 px-3 text-sm';
        case 'lg':
          return 'h-12 px-6 text-lg';
        default:
          return 'h-10 px-4 text-base';
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case 'outline':
          return 'border border-carebase-blue text-carebase-blue bg-white hover:bg-carebase-blue hover:text-white';
        case 'ghost':
          return 'text-carebase-blue bg-transparent hover:bg-carebase-blue/10';
        default:
          return 'bg-carebase-blue text-white hover:bg-carebase-blue-dark';
      }
    };

    return (
      <Button
        ref={ref}
        type="submit"
        disabled={isLoading || disabled}
        className={cn(
          'font-medium transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-carebase-blue focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          fullWidth && 'w-full',
          getSizeStyles(),
          getVariantStyles(),
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {loadingText}
          </>
        ) : (
          children
        )}
      </Button>
    );
  }
);

LoginButton.displayName = 'LoginButton';