import type React from 'react';
import { Badge } from '@/components/ui/badge';

interface ResidentStatusBadgeProps {
  status: '入居中' | '退所済' | '待機中';
  className?: string;
}

export const ResidentStatusBadge: React.FC<ResidentStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case '入居中':
        return 'bg-green-100 text-green-700 border-green-200';
      case '退所済':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case '待機中':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Badge className={`${getStatusStyles()} ${className}`} variant="outline">
      {status}
    </Badge>
  );
};
