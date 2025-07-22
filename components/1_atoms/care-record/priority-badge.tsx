import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { CareRecordPriority } from '@/types/care-record';
import { priorityOptions } from '@/types/care-record';

interface PriorityBadgeProps {
  priority: CareRecordPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const priorityConfig = priorityOptions.find((option) => option.value === priority);

  if (!priorityConfig) {
    return null;
  }

  return (
    <Badge className={`${priorityConfig.color} ${className}`} variant="outline">
      {priorityConfig.label}
    </Badge>
  );
};