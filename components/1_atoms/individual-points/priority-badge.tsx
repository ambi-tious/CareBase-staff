import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { IndividualPointPriority } from '@/types/individual-point';
import { priorityOptions } from '@/types/individual-point';

interface PriorityBadgeProps {
  priority: IndividualPointPriority;
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
