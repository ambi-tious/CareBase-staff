'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Notification } from '@/types/notification';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Bell, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead?: (notificationId: string) => void;
  className?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  className = '',
}) => {
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd HH:mm', { locale: ja });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.status === 'unread' && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  // 最新の5件のみ表示
  const recentNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`relative hover:bg-carebase-blue-light tablet:h-12 tablet:w-12 min-h-touch-target min-w-touch-target ${className}`}
          aria-label={`お知らせ ${unreadCount > 0 ? `${unreadCount}件の未読` : ''}`}
        >
          <Bell className="h-6 w-6 text-carebase-blue tablet:h-7 tablet:w-7" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-red-500 text-white border-2 border-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 tablet:w-96">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            お知らせ
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-100 text-red-700 border-red-200">
              {unreadCount}件未読
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">お知らせはありません</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            {recentNotifications.map((notification) => (
              <DropdownMenuItem key={notification.id} className="p-0">
                <Link
                  href={notification.navigationUrl}
                  className="w-full p-3 block hover:bg-gray-50 transition-colors"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="space-y-2">
                    {/* ヘッダー */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Badge
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                          variant="outline"
                        >
                          {notification.priority === 'high'
                            ? '高'
                            : notification.priority === 'medium'
                              ? '中'
                              : '低'}
                        </Badge>
                        {notification.status === 'unread' && (
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>

                    {/* タイトル */}
                    <h4
                      className={`text-sm font-medium line-clamp-2 ${
                        notification.status === 'unread'
                          ? 'text-gray-900'
                          : 'text-gray-600'
                      }`}
                    >
                      {notification.title}
                    </h4>

                    {/* 内容プレビュー */}
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {notification.content}
                    </p>

                    {/* 作成者・対象者 */}
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{notification.createdByName}</span>
                      </div>
                      {notification.relatedResidentName && (
                        <span>対象: {notification.relatedResidentName}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="p-0">
          <Link
            href="/notifications"
            className="w-full p-3 text-center text-sm text-carebase-blue hover:bg-carebase-blue-light transition-colors"
          >
            すべてのお知らせを見る
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};