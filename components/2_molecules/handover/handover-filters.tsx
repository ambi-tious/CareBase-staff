'use client';

import type React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { HandoverPriority, HandoverStatus } from '@/types/handover';
import { priorityOptions, statusOptions } from '@/types/handover';
import { Filter, RotateCcw } from 'lucide-react';

interface HandoverFiltersProps {
  selectedPriority?: HandoverPriority;
  selectedStatus?: HandoverStatus;
  onPriorityChange: (priority?: HandoverPriority) => void;
  onStatusChange: (status?: HandoverStatus) => void;
  onReset: () => void;
  className?: string;
}

export const HandoverFilters: React.FC<HandoverFiltersProps> = ({
  selectedPriority,
  selectedStatus,
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
        value={selectedPriority || ''}
        onValueChange={(value) => onPriorityChange(value === 'all' ? undefined : value as HandoverPriority)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="重要度" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          {priorityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedStatus || 'unread'}
        onValueChange={(value) => onStatusChange(value === 'all' ? undefined : value as HandoverStatus)}
      >
        <SelectTrigger className={`w-36 ${selectedStatus === 'unread' ? 'border-blue-500 bg-blue-50' : ''}`}>
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          {statusOptions.map((option) => (
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
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
          未読のみ表示
        </div>
      )}
    </div>
  );
};