import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { CareRecordStatus } from '@/types/care-record';
import { statusOptions } from '@/types/care-record';

interface StatusBadgeProps {
  status: CareRecordStatus;
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
