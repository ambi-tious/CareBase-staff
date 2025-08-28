'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AbsenceReason, AbsenceStatus } from '@/types/absence';
import { absenceReasonOptions, absenceStatusOptions } from '@/types/absence';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import type React from 'react';

interface AbsenceFiltersProps {
  searchQuery: string;
  selectedStatus?: AbsenceStatus;
  selectedReason?: AbsenceReason;
  onSearchChange: (query: string) => void;
  onStatusChange: (status?: AbsenceStatus) => void;
  onReasonChange: (reason?: AbsenceReason) => void;
  onReset: () => void;
  className?: string;
}

export const AbsenceFilters: React.FC<AbsenceFiltersProps> = ({
  searchQuery,
  selectedStatus,
  selectedReason,
  onSearchChange,
  onStatusChange,
  onReasonChange,
  onReset,
  className = '',
}) => {
  const clearSearch = () => {
    onSearchChange('');
  };

  const hasActiveFilters = selectedStatus || selectedReason || searchQuery;

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="備考や理由で検索..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">フィルター:</span>
          </div>

          <Select
            value={selectedStatus || ''}
            onValueChange={(value) =>
              onStatusChange(value === 'all' ? undefined : (value as AbsenceStatus))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {absenceStatusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedReason || ''}
            onValueChange={(value) =>
              onReasonChange(value === 'all' ? undefined : (value as AbsenceReason))
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="理由" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              {absenceReasonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              リセット
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};