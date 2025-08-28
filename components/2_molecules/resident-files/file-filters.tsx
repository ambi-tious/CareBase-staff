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
import type { ResidentFileCategory } from '@/types/resident-file';
import { fileCategoryOptions } from '@/types/resident-file';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface FileFiltersProps {
  searchQuery: string;
  selectedCategory?: ResidentFileCategory;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category?: ResidentFileCategory) => void;
  onReset: () => void;
  className?: string;
}

export const FileFilters: React.FC<FileFiltersProps> = ({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onReset,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const clearSearch = () => {
    onSearchChange('');
  };

  const hasActiveFilters = selectedCategory || searchQuery;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and filter toggle */}
      <div className="flex items-center gap-4">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="ファイル名、説明で検索..."
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

        {/* Filter toggle */}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          フィルタ
          {hasActiveFilters && (
            <span className="bg-carebase-blue text-white text-xs px-1.5 py-0.5 rounded-full">
              ON
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            リセット
          </Button>
        )}
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">フィルタ条件</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">カテゴリ</label>
              <Select
                value={selectedCategory || ''}
                onValueChange={(value) =>
                  onCategoryChange(value === 'all' ? undefined : (value as ResidentFileCategory))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="すべて" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  {fileCategoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active filters display */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>アクティブフィルタ:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedCategory && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      カテゴリ: {fileCategoryOptions.find((c) => c.value === selectedCategory)?.label}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      検索: {searchQuery}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};