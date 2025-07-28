import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { IndividualPointStatus } from '@/types/individual-point';
import { statusOptions } from '@/types/individual-point';

interface StatusBadgeProps {
  status: IndividualPointStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = statusOptions.find((option) => option.value === status);

  if (!statusConfig) {
    return null;
  }

  return (
    <Badge className={`${statusConfig.color} ${className}`} variant="outline">
      {statusConfig.label}
    </Badge>
  );
};