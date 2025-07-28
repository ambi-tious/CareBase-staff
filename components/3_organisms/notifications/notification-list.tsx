'use client';

import { NotificationFilters } from '@/components/2_molecules/notifications/notification-filters';
import { NotificationSearchBar } from '@/components/2_molecules/notifications/notification-search-bar';
import { NotificationTableRow } from '@/components/2_molecules/notifications/notification-table-row';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Notification, NotificationType, NotificationPriority, NotificationStatus } from '@/types/notification';
import { Bell, Settings } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useMemo, useState } from 'react';

interface NotificationListProps {
  notifications: Notification[];
  onStatusUpdate?: (notificationId: string, status: 'read' | 'completed') => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onStatusUpdate 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<NotificationType | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<NotificationPriority | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<NotificationStatus | undefined>('unread');

  // Filter and search notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.createdByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.relatedResidentName?.toLowerCase().includes(searchQuery.toLowerCase());

      // Type filter
      const matchesType = !selectedType || notification.type === selectedType;

      // Priority filter
      const matchesPriority = !selectedPriority || notification.priority === selectedPriority;

      // Status filter
      const matchesStatus = !selectedStatus || notification.status === selectedStatus;

      return matchesSearch && matchesType && matchesPriority && matchesStatus;
    });
  }, [notifications, searchQuery, selectedType, selectedPriority, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType(undefined);
    setSelectedPriority(undefined);
    setSelectedStatus('unread');
  };

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;
  const totalCount = notifications.length;

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">お知らせ一覧</h1>
            {selectedStatus === 'unread' && unreadCount > 0 && (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>総件数: {totalCount}件</span>
            <span className={unreadCount > 0 ? 'text-red-600 font-semibold' : ''}>
              未読: {unreadCount}件
            </span>
            <span>表示中: {filteredNotifications.length}件</span>
            {selectedStatus === 'unread' && (
              <span className="text-blue-600 font-medium">（未読のみ表示中）</span>
            )}
          </div>
        </div>

        <Button className="bg-carebase-blue hover:bg-carebase-blue-dark" asChild>
          <Link href="/notifications/settings">
            <Settings className="h-4 w-4 mr-2" />
            通知設定
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-6">
        <NotificationSearchBar onSearch={setSearchQuery} className="flex-1 max-w-md" />
        <NotificationFilters
          selectedType={selectedType}
          selectedPriority={selectedPriority}
          selectedStatus={selectedStatus}
          onTypeChange={setSelectedType}
          onPriorityChange={setSelectedPriority}
          onStatusChange={setSelectedStatus}
          onReset={handleResetFilters}
        />
      </div>

      {/* Table */}
      {filteredNotifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">お知らせが見つかりません</h3>
          <p className="text-gray-500">
            {searchQuery || selectedType || selectedPriority || selectedStatus
              ? '検索条件に一致するお知らせがありません。条件を変更してお試しください。'
              : 'お知らせがありません。'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-32">お知らせID</TableHead>
                <TableHead className="w-32">作成日時</TableHead>
                <TableHead className="w-32">作成者</TableHead>
                <TableHead>種別・件名</TableHead>
                <TableHead className="w-20">重要度</TableHead>
                <TableHead className="w-24">ステータス</TableHead>
                <TableHead className="w-20">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <NotificationTableRow
                  key={notification.id}
                  notification={notification}
                  onStatusUpdate={onStatusUpdate}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};