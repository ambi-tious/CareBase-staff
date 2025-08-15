/**
 * Error Alert Molecule
 *
 * Specialized alert component for displaying authentication errors
 */

import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import type React from 'react';

export interface ErrorAlertProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  type = 'error',
  message,
  className,
  dismissible = false,
  onDismiss,
}) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-red-200 bg-red-50';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getTextStyles = () => {
    switch (type) {
      case 'success':
        return 'text-green-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-red-700';
    }
  };

  return (
    <Alert className={cn(getAlertStyles(), 'relative', className)}>
      {getIcon()}
      <AlertDescription className={cn(getTextStyles(), 'pr-8')}>{message}</AlertDescription>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className={cn(
            'absolute right-2 top-2 p-1 rounded-full hover:bg-black/10 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2'
          )}
          aria-label="アラートを閉じる"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Alert>
  );
};
