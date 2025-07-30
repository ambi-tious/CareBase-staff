import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { CarePlanStatus } from '@/types/care-plan';
import { statusOptions } from '@/types/care-plan';

interface StatusBadgeProps {
  status: CarePlanStatus;
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