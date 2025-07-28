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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { IndividualPointCategory, IndividualPointPriority, IndividualPointStatus } from '@/types/individual-point';
import { categoryOptions, priorityOptions, statusOptions } from '@/types/individual-point';
import { Filter, RotateCcw, Search, X } from 'lucide-react';

interface IndividualPointFiltersProps {
  searchQuery: string;
  selectedCategory?: IndividualPointCategory;
  selectedPriority?: IndividualPointPriority;
  selectedStatus?: IndividualPointStatus;
  selectedTags: string[];
  availableTags: string[];
  onSearchChange: (query: string) => void;
  onCategoryChange: (category?: IndividualPointCategory) => void;
  onPriorityChange: (priority?: IndividualPointPriority) => void;
  onStatusChange: (status?: IndividualPointStatus) => void;
  onTagAdd: (tag: string) => void;
  onTagRemove: (tag: string) => void;
  onReset: () => void;
  className?: string;
}

export const IndividualPointFilters: React.FC<IndividualPointFiltersProps> = ({
  searchQuery,
  selectedCategory,
  selectedPriority,
  selectedStatus,
  selectedTags,
  availableTags,
  onSearchChange,
  onCategoryChange,
  onPriorityChange,
  onStatusChange,
  onTagAdd,
  onTagRemove,
  onReset,
  className = '',
}) => {
  const hasActiveFilters = selectedCategory || selectedPriority || selectedStatus || selectedTags.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="個別ポイントを検索..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">フィルター:</span>
        </div>

        {/* Category Filter */}
        <Select
          value={selectedCategory || ''}
          onValueChange={(value) =>
            onCategoryChange(value === 'all' ? undefined : (value as IndividualPointCategory))
          }
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="カテゴリ" />
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

        {/* Priority Filter */}
        <Select
          value={selectedPriority || ''}
          onValueChange={(value) =>
            onPriorityChange(value === 'all' ? undefined : (value as IndividualPointPriority))
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="優先度" />
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

        {/* Status Filter */}
        <Select
          value={selectedStatus || ''}
          onValueChange={(value) =>
            onStatusChange(value === 'all' ? undefined : (value as IndividualPointStatus))
          }
        >
          <SelectTrigger className="w-36">
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

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            リセット
          </Button>
        )}
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">選択中のタグ:</span>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => onTagRemove(tag)}
                  className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Available Tags */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">利用可能なタグ:</span>
          <div className="flex flex-wrap gap-2">
            {availableTags
              .filter(tag => !selectedTags.includes(tag))
              .slice(0, 10) // Show only first 10 tags
              .map((tag) => (
                <Button
                  key={tag}
                  variant="outline"
                  size="sm"
                  onClick={() => onTagAdd(tag)}
                  className="text-xs h-7 px-2 text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  {tag}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};