'use client';

import { NotificationPriorityBadge } from '@/components/1_atoms/notifications/notification-priority-badge';
import { NotificationStatusBadge } from '@/components/1_atoms/notifications/notification-status-badge';
import { NotificationTypeBadge } from '@/components/1_atoms/notifications/notification-type-badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import type { Notification } from '@/types/notification';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Eye, User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface NotificationTableRowProps {
  notification: Notification;
  onStatusUpdate?: (notificationId: string, status: 'read' | 'completed') => void;
}

export const NotificationTableRow: React.FC<NotificationTableRowProps> = ({
  notification,
  onStatusUpdate,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd HH:mm', { locale: ja });
  };

  const handleMarkAsRead = () => {
    if (notification.status === 'unread' && onStatusUpdate) {
      onStatusUpdate(notification.id, 'read');
    }
  };

  const getScheduleInfo = () => {
    if (notification.type === 'contact_schedule') {
      const schedule = notification as import('@/types/notification').ContactScheduleNotification;
      const dueDate = format(new Date(schedule.dueDate), 'MM/dd', { locale: ja });
      if (schedule.startTime) {
        return `${dueDate} ${schedule.startTime}`;
      }
      return dueDate;
    }
    return null;
  };

  return (
    <TableRow className={notification.status === 'unread' ? 'bg-blue-50' : ''}>
      <TableCell className="font-mono text-sm">{notification.id}</TableCell>
      <TableCell className="text-sm">{formatDate(notification.createdAt)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="text-sm">{notification.createdByName}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <NotificationTypeBadge type={notification.type} />
          </div>
          <Link
            href={notification.navigationUrl}
            className="text-sm font-medium text-carebase-blue hover:underline"
            onClick={handleMarkAsRead}
          >
            {notification.title}
          </Link>
          {notification.relatedResidentName && (
            <div className="text-xs text-gray-500">対象: {notification.relatedResidentName}</div>
          )}
          {getScheduleInfo() && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              予定: {getScheduleInfo()}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <NotificationPriorityBadge priority={notification.priority} />
      </TableCell>
      <TableCell>
        <NotificationStatusBadge status={notification.status} />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={notification.navigationUrl} onClick={handleMarkAsRead}>
              <Eye className="h-3 w-3 mr-1" />
              詳細
            </Link>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
