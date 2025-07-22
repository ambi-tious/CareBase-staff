import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { HandoverStatus } from '@/types/handover';
import { statusOptions } from '@/types/handover';

interface StatusBadgeProps {
  status: HandoverStatus;
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
