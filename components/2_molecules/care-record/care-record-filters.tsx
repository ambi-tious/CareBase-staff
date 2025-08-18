'use client';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CareRecordCategory, CareRecordPriority, CareRecordStatus } from '@/types/care-record';
import { categoryOptions, priorityOptions, statusOptions } from '@/types/care-record';
import { Filter, RotateCcw } from 'lucide-react';
import type React from 'react';

interface CareRecordFiltersProps {
  selectedCategory?: CareRecordCategory;
  selectedPriority?: CareRecordPriority;
  selectedStatus?: CareRecordStatus;
  dateFrom?: string;
  dateTo?: string;
  onCategoryChange: (category?: CareRecordCategory) => void;
  onPriorityChange: (priority?: CareRecordPriority) => void;
  onStatusChange: (status?: CareRecordStatus) => void;
  onDateFromChange: (date?: string) => void;
  onDateToChange: (date?: string) => void;
  onReset: () => void;
  className?: string;
}

export const CareRecordFilters: React.FC<CareRecordFiltersProps> = ({
  selectedCategory,
  selectedPriority,
  selectedStatus,
  dateFrom,
  dateTo,
  onCategoryChange,
  onPriorityChange,
  onStatusChange,
  onDateFromChange,
  onDateToChange,
  onReset,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">フィルター条件</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 記録種別 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">記録種別</Label>
          <Select
            value={selectedCategory || ''}
            onValueChange={(value) =>
              onCategoryChange(value === 'all' ? undefined : (value as CareRecordCategory))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 重要度 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">重要度</Label>
          <Select
            value={selectedPriority || ''}
            onValueChange={(value) =>
              onPriorityChange(value === 'all' ? undefined : (value as CareRecordPriority))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
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
        </div>

        {/* ステータス */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">ステータス</Label>
          <Select
            value={selectedStatus || ''}
            onValueChange={(value) =>
              onStatusChange(value === 'all' ? undefined : (value as CareRecordStatus))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="すべて" />
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
        </div>

        {/* 日付範囲 */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">開始日</Label>
          <DatePicker
            value={dateFrom || ''}
            onChange={(value) => onDateFromChange(value || undefined)}
            placeholder="開始日を選択"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">終了日</Label>
          <DatePicker
            value={dateTo || ''}
            onChange={(value) => onDateToChange(value || undefined)}
            placeholder="終了日を選択"
          />
        </div>
      </div>

      {/* リセットボタン */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          リセット
        </Button>
      </div>
    </div>
  );
};
