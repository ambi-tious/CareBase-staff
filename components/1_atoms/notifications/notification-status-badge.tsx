import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { NotificationStatus } from '@/types/notification';
import { notificationStatusOptions } from '@/types/notification';

interface NotificationStatusBadgeProps {
  status: NotificationStatus;
  className?: string;
}

export const NotificationStatusBadge: React.FC<NotificationStatusBadgeProps> = ({ status, className = '' }) => {
  const statusConfig = notificationStatusOptions.find((option) => option.value === status);

  if (!statusConfig) {
    return null;
  }

  return (
    <Badge className={`${statusConfig.color} ${className}`} variant="outline">
      {statusConfig.label}
    </Badge>
  );
};