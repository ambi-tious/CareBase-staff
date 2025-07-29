'use client';

import { notificationData } from '@/mocks/notification-data';
import type { Notification } from '@/types/notification';
import { useCallback, useEffect, useState } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // 通知データを読み込み
  useEffect(() => {
    // 実際のアプリケーションではAPIから取得
    // ここではモックデータを使用
    const sortedNotifications = [...notificationData].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setNotifications(sortedNotifications);

    // 未読数を計算
    const unread = sortedNotifications.filter((notification) => notification.status === 'unread');
    setUnreadCount(unread.length);
  }, []);

  // 通知を既読にマーク
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              status: 'read' as const,
              readAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : notification
      )
    );

    // 未読数を更新
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  // 全て既読にマーク
  const markAllAsRead = useCallback(() => {
    const now = new Date().toISOString();
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.status === 'unread'
          ? {
              ...notification,
              status: 'read' as const,
              readAt: now,
              updatedAt: now,
            }
          : notification
      )
    );
    setUnreadCount(0);
  }, []);

  // 新しい通知を追加
  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (notification.status === 'unread') {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
  };
};
