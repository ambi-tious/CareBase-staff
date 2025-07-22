import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { HandoverPriority } from '@/types/handover';
import { priorityOptions } from '@/types/handover';

interface PriorityBadgeProps {
  priority: HandoverPriority;
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
