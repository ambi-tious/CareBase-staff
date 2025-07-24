import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { ContactSchedulePriority } from '@/types/contact-schedule';
import { priorityOptions } from '@/types/contact-schedule';

interface PriorityBadgeProps {
  priority: ContactSchedulePriority;
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