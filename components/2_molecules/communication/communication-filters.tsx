'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RotateCcw, Search, X } from 'lucide-react';
import type React from 'react';

interface CommunicationFiltersProps {
  searchQuery: string;
  showImportantOnly: boolean;
  onSearchChange: (query: string) => void;
  onImportantToggle: (show: boolean) => void;
  onReset: () => void;
  totalCount: number;
  importantCount: number;
  filteredCount: number;
  className?: string;
}

export const CommunicationFilters: React.FC<CommunicationFiltersProps> = ({
  searchQuery,
  showImportantOnly,
  onSearchChange,
  onImportantToggle,
  onReset,
  totalCount,
  importantCount,
  filteredCount,
  className = '',
}) => {
  const clearSearch = () => {
    onSearchChange('');
  };

  const hasActiveFilters = showImportantOnly || searchQuery;

  return (
    <div className={`${className}`}>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* 左側：件数表示 */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>総件数: {totalCount}件</span>
          <span className={importantCount > 0 ? 'text-red-600 font-medium' : ''}>
            重要: {importantCount}件
          </span>
          <span>表示中: {filteredCount}件</span>
        </div>

        {/* 右側：検索とフィルタ */}
        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="コミュニケーション内容や連絡者で検索..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-10 w-80"
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

          {/* Important filter */}
          <div className="flex items-center space-x-2">
            <Switch
              id="important-only"
              checked={showImportantOnly}
              onCheckedChange={onImportantToggle}
            />
            <Label htmlFor="important-only" className="text-sm whitespace-nowrap">
              重要のみ
            </Label>
          </div>

          {/* Reset button */}
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