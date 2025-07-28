'use client';

import { NotificationList } from '@/components/3_organisms/notifications/notification-list';
import { notificationData } from '@/mocks/notification-data';
import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(notificationData);

  const handleStatusUpdate = (notificationId: string, status: 'read' | 'completed') => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              status,
              readAt: status === 'read' ? new Date().toISOString() : notification.readAt,
              completedAt: status === 'completed' ? new Date().toISOString() : notification.completedAt,
              updatedAt: new Date().toISOString(),
            }
          : notification
      )
    );
  };

  return <NotificationList notifications={notifications} onStatusUpdate={handleStatusUpdate} />;
}