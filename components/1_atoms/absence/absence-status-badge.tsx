import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { AbsenceStatus } from '@/types/absence';
import { absenceStatusOptions } from '@/types/absence';

interface AbsenceStatusBadgeProps {
  status: AbsenceStatus;
  className?: string;
}

export const AbsenceStatusBadge: React.FC<AbsenceStatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const statusConfig = absenceStatusOptions.find((option) => option.value === status);

  if (!statusConfig) {
    return null;
  }

  return (
    <Badge className={`${statusConfig.color} ${className}`} variant="outline">
      {statusConfig.label}
    </Badge>
  );
};