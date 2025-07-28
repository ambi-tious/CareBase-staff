import type React from 'react';
import { Badge } from '@/components/ui/badge';
import type { NotificationType } from '@/types/notification';
import { notificationTypeOptions } from '@/types/notification';
import { getLucideIcon } from '@/lib/lucide-icon-registry';

interface NotificationTypeBadgeProps {
  type: NotificationType;
  className?: string;
}

export const NotificationTypeBadge: React.FC<NotificationTypeBadgeProps> = ({ type, className = '' }) => {
  const typeConfig = notificationTypeOptions.find((option) => option.value === type);

  if (!typeConfig) {
    return null;
  }

  const Icon = getLucideIcon(typeConfig.icon);

  return (
    <Badge
      className={`${typeConfig.color} ${className} flex items-center gap-1`}
      variant="outline"
    >
      <Icon className="h-3 w-3" />
      {typeConfig.label}
    </Badge>
  );
};