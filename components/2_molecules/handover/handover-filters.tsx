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
        onValueChange={(value) => onPriorityChange(value as HandoverPriority || undefined)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="重要度" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">すべて</SelectItem>
          {priorityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedStatus || ''}
        onValueChange={(value) => onStatusChange(value as HandoverStatus || undefined)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="ステータス" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">すべて</SelectItem>
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
    </div>
  );
};