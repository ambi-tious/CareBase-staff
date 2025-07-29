'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  NotificationPriority,
  NotificationStatus,
  NotificationType,
} from '@/types/notification';
import {
  notificationPriorityOptions,
  notificationStatusOptions,
  notificationTypeOptions,
} from '@/types/notification';
import { Filter, RotateCcw } from 'lucide-react';
import type React from 'react';

interface NotificationFiltersProps {
  selectedType?: NotificationType;
  selectedPriority?: NotificationPriority;
  selectedStatus?: NotificationStatus;
  onTypeChange: (type?: NotificationType) => void;
  onPriorityChange: (priority?: NotificationPriority) => void;
  onStatusChange: (status?: NotificationStatus) => void;
  onReset: () => void;
  className?: string;
}

export const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  selectedType,
  selectedPriority,
  selectedStatus,
  onTypeChange,
  onPriorityChange,
  onStatusChange,
  onReset,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">フィルター:</span>
      </div>

      <Select
        value={selectedType || ''}
        onValueChange={(value) =>
          onTypeChange(value === 'all' ? undefined : (value as NotificationType))
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="種別" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          {notificationTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedPriority || ''}
        onValueChange={(value) =>
          onPriorityChange(value === 'all' ? undefined : (value as NotificationPriority))
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="重要度" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          {notificationPriorityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedStatus || 'unread'}
        onValueChange={(value) =>
          onStatusChange(value === 'all' ? undefined : (value as NotificationStatus))
        }
      >
        <SelectTrigger
          className={`w-36 ${selectedStatus === 'unread' ? 'border-blue-500 bg-blue-50' : ''}`}
        >
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          {notificationStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={onReset}>
        <RotateCcw className="h-4 w-4 mr-2" />
        リセット
      </Button>

      {selectedStatus === 'unread' && (
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">未読のみ表示</div>
      )}
    </div>
  );
};
