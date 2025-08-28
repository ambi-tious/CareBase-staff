import { Badge } from '@/components/ui/badge';
import type React from 'react';

interface ResidentStatusBadgeProps {
  status: '入所前' | '入所中' | '退所';
  className?: string;
}

export const ResidentStatusBadge: React.FC<ResidentStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const getStatusStyles = () => {
    switch (status) {
      case '入所前':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case '入所中':
        return 'bg-green-100 text-green-700 border-green-200';
      case '退所':
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Badge className={`${getStatusStyles()} ${className}`} variant="outline">
      {status}
    </Badge>
  );
};
