'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import type { ResidentStatus } from '@/utils/resident-status-helpers';
import { UserPlus } from 'lucide-react';
import type React from 'react';
import { ResidentSearchBar } from './resident-search-bar';

export type SortOption = 'name' | 'room';

interface ResidentsToolbarProps {
  onSearch: (query: string) => void;
  statusFilter: ResidentStatus | 'all';
  onStatusFilterChange: (status: ResidentStatus | 'all') => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onCreateResident: () => void;
  className?: string;
}

export const ResidentsToolbar: React.FC<ResidentsToolbarProps> = ({
  onSearch,
  statusFilter,
  onStatusFilterChange,
  sortBy,
  onSortChange,
  onCreateResident,
  className = '',
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Bottom row - Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <ResidentSearchBar onSearch={onSearch} className="flex-1 min-w-64" />

          {/* ステータスフィルター */}
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">ステータス:</Label>
            <Select
              value={statusFilter === null ? 'all' : statusFilter}
              onValueChange={(value) => onStatusFilterChange(value as ResidentStatus | 'all')}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="全て" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全て（退所済みを除く）</SelectItem>
                <SelectItem value="入所前">入所前</SelectItem>
                <SelectItem value="入所中">入所中</SelectItem>
                <SelectItem value="退所">退所</SelectItem>
                <SelectItem value="ー">ー（選択なし）</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 並び替えオプション */}
          <div className="flex items-center gap-2">
            <Label className="text-sm whitespace-nowrap">並び替え:</Label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">名前順</SelectItem>
                <SelectItem value="room">部屋順</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onCreateResident}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
            size="sm"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            新規利用者登録
          </Button>
        </div>
      </div>
    </div>
  );
};
