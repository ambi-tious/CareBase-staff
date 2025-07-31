'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CarePlanStatus } from '@/types/care-plan';
import { statusOptions } from '@/types/care-plan';
import { Filter, RotateCcw } from 'lucide-react';
import type React from 'react';

interface CarePlanFiltersProps {
  selectedStatus?: CarePlanStatus;
  selectedCareLevel?: string;
  onStatusChange: (status?: CarePlanStatus) => void;
  onCareLevelChange: (careLevel?: string) => void;
  onReset: () => void;
  className?: string;
}

const careLevelOptions = [
  { value: '要介護1', label: '要介護1' },
  { value: '要介護2', label: '要介護2' },
  { value: '要介護3', label: '要介護3' },
  { value: '要介護4', label: '要介護4' },
  { value: '要介護5', label: '要介護5' },
];

export const CarePlanFilters: React.FC<CarePlanFiltersProps> = ({
  selectedStatus,
  selectedCareLevel,
  onStatusChange,
  onCareLevelChange,
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
        value={selectedStatus || ''}
        onValueChange={(value) =>
          onStatusChange(value === 'all' ? undefined : (value as CarePlanStatus))
        }
      >
        <SelectTrigger className="w-32">
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

      <Select
        value={selectedCareLevel || ''}
        onValueChange={(value) => onCareLevelChange(value === 'all' ? undefined : value)}
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="要介護度" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">すべて</SelectItem>
          {careLevelOptions.map((option) => (
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
