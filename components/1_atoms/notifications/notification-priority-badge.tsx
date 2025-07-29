import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { NotificationPriority } from '@/types/notification';
import { notificationPriorityOptions } from '@/types/notification';

interface NotificationPriorityBadgeProps {
  priority: NotificationPriority;
  className?: string;
}

export const NotificationPriorityBadge: React.FC<NotificationPriorityBadgeProps> = ({
  priority,
  className = '',
}) => {
  const priorityConfig = notificationPriorityOptions.find((option) => option.value === priority);

  if (!priorityConfig) {
    return null;
  }

  return (
    <Badge className={`${priorityConfig.color} ${className}`} variant="outline">
      {priorityConfig.label}
    </Badge>
  );
};
