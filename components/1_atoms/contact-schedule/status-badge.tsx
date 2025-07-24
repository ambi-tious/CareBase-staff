import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ContactScheduleStatus } from '@/types/contact-schedule';
import { statusOptions } from '@/types/contact-schedule';

interface StatusBadgeProps {
  status: ContactScheduleStatus;
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
