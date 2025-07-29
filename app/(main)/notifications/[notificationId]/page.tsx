'use client';

import { getNotificationById } from '@/mocks/notification-data';
import { NotificationTypeBadge } from '@/components/1_atoms/notifications/notification-type-badge';
import { NotificationPriorityBadge } from '@/components/1_atoms/notifications/notification-priority-badge';
import { NotificationStatusBadge } from '@/components/1_atoms/notifications/notification-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Notification } from '@/types/notification';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArrowLeft, Bell, Calendar, User, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

export default function NotificationDetailPage({
  params,
}: {
  params: Promise<{ notificationId: string }>;
}) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load notification data
  React.useEffect(() => {
    const loadNotification = async () => {
      const resolvedParams = await params;
      const foundNotification = getNotificationById(resolvedParams.notificationId);
      setNotification(foundNotification || null);
      setIsLoading(false);
    };

    loadNotification();
  }, [params]);

  const handleNotificationUpdate = (updatedNotification: Notification) => {
    setNotification(updatedNotification);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  if (!notification) {
    return <div className="p-6 text-center text-red-500">お知らせが見つかりません。</div>;
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" asChild>
            <Link href="/notifications">
              <ArrowLeft className="h-4 w-4 mr-2" />
              お知らせ一覧に戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">お知らせ詳細</h1>
          </div>
        </div>
      </div>

      {/* Detail Card */}
      <Card className="max-w-4xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl text-carebase-text-primary">
                {notification.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>ID: {notification.id}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(notification.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                asChild
                className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
              >
                <Link href={notification.navigationUrl}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  詳細画面へ
                </Link>
              </Button>
              <NotificationTypeBadge type={notification.type} />
              <NotificationPriorityBadge priority={notification.priority} />
              <NotificationStatusBadge status={notification.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Creator Info */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <span className="text-sm font-medium">作成者: </span>
              <span className="text-sm">{notification.createdByName}</span>
            </div>
          </div>

          {/* Related Resident Info */}
          {notification.relatedResidentName && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">関連利用者: </span>
              <Link
                href={`/residents/${notification.relatedResidentId}`}
                className="text-sm text-carebase-blue hover:underline"
              >
                {notification.relatedResidentName}
              </Link>
            </div>
          )}

          {/* Schedule Info for contact_schedule type */}
          {notification.type === 'contact_schedule' && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-sm font-medium text-yellow-800">実施予定: </span>
              <span className="text-sm text-yellow-700">
                {(() => {
                  const schedule =
                    notification as import('@/types/notification').ContactScheduleNotification;
                  const dueDate = format(new Date(schedule.dueDate), 'yyyy年MM月dd日', {
                    locale: ja,
                  });
                  if (schedule.startTime) {
                    return `${dueDate} ${schedule.startTime}${schedule.endTime ? ` - ${schedule.endTime}` : ''}`;
                  }
                  return dueDate;
                })()}
              </span>
            </div>
          )}

          {/* Schedule Info for handover type */}
          {notification.type === 'handover' &&
            (() => {
              const handover = notification as import('@/types/notification').HandoverNotification;
              return (
                (handover.scheduledDate || handover.scheduledTime) && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-sm font-medium text-yellow-800">実施予定: </span>
                    <span className="text-sm text-yellow-700">
                      {handover.scheduledDate &&
                        format(new Date(handover.scheduledDate), 'yyyy年MM月dd日', {
                          locale: ja,
                        })}
                      {handover.scheduledTime && ` ${handover.scheduledTime}`}
                    </span>
                  </div>
                )
              );
            })()}

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-carebase-text-primary">内容</h3>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {notification.content}
              </p>
            </div>
          </div>

          {/* Tags for contact_schedule type */}
          {notification.type === 'contact_schedule' &&
            (() => {
              const schedule =
                notification as import('@/types/notification').ContactScheduleNotification;
              return (
                schedule.tags &&
                schedule.tags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-carebase-text-primary">タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {schedule.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              );
            })()}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-sm">
              <span className="font-medium text-gray-500">作成日時:</span>
              <div className="mt-1">{formatDateTime(notification.createdAt)}</div>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-500">更新日時:</span>
              <div className="mt-1">{formatDateTime(notification.updatedAt)}</div>
            </div>
            {notification.readAt && (
              <div className="text-sm">
                <span className="font-medium text-gray-500">既読日時:</span>
                <div className="mt-1">{formatDateTime(notification.readAt)}</div>
              </div>
            )}
            {notification.completedAt && (
              <div className="text-sm">
                <span className="font-medium text-gray-500">対応完了日時:</span>
                <div className="mt-1">{formatDateTime(notification.completedAt)}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
