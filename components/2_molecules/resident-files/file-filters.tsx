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
import { RotateCcw, Search, X } from 'lucide-react';
import type React from 'react';

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
  const clearSearch = () => {
    onSearchChange('');
  };

  const hasActiveFilters = selectedCategory || searchQuery;

  return (
    <div className={`${className}`}>
      {/* Search, filter toggle, and upload button */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="ファイル名で検索..."
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

        {/* Category filter */}
        <Select
          value={selectedCategory || ''}
          onValueChange={(value) =>
            onCategoryChange(value === 'all' ? undefined : (value as ResidentFileCategory))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="カテゴリ" />
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

        {/* Reset button */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        )}

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            リセット
          </Button>
        )}
      </div>
    </div>
  );
};
