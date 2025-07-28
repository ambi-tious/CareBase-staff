'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  IndividualPointCategory,
  IndividualPointPriority,
  IndividualPointStatus,
} from '@/types/individual-point';
import { categoryOptions, priorityOptions, statusOptions } from '@/types/individual-point';
import { Filter, RotateCcw, Search, X } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface IndividualPointsFiltersProps {
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
  onTagsChange: (tags: string[]) => void;
  onReset: () => void;
  className?: string;
}

export const IndividualPointsFilters: React.FC<IndividualPointsFiltersProps> = ({
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
  onTagsChange,
  onReset,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  const hasActiveFilters =
    selectedCategory ||
    selectedPriority ||
    selectedStatus ||
    selectedTags.length > 0 ||
    searchQuery;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* フィルタ展開ボタン */}
      <div className="flex items-center justify-between gap-2">
        {/* 検索バー */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="個別ポイントを検索..."
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
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          詳細フィルタ
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

      {/* 詳細フィルタ */}
      {isExpanded && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">フィルタ条件</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* カテゴリフィルタ */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">カテゴリ</Label>
              <Select
                value={selectedCategory || ''}
                onValueChange={(value) =>
                  onCategoryChange(value === 'all' ? undefined : (value as IndividualPointCategory))
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

            {/* 優先度フィルタ */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">優先度</Label>
              <Select
                value={selectedPriority || ''}
                onValueChange={(value) =>
                  onPriorityChange(value === 'all' ? undefined : (value as IndividualPointPriority))
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

            {/* ステータスフィルタ */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">ステータス</Label>
              <Select
                value={selectedStatus || ''}
                onValueChange={(value) =>
                  onStatusChange(value === 'all' ? undefined : (value as IndividualPointStatus))
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
          </div>

          {/* タグフィルタ */}
          {availableTags.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">タグ</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <Button
                      key={tag}
                      variant={isSelected ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleTagToggle(tag)}
                      className={`text-xs ${
                        isSelected
                          ? 'bg-carebase-blue text-white hover:bg-carebase-blue-dark'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {tag}
                      {isSelected && <X className="h-3 w-3 ml-1" />}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* アクティブフィルタ表示 */}
          {hasActiveFilters && (
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>アクティブフィルタ:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedCategory && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      カテゴリ: {categoryOptions.find((c) => c.value === selectedCategory)?.label}
                    </span>
                  )}
                  {selectedPriority && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      優先度: {priorityOptions.find((p) => p.value === selectedPriority)?.label}
                    </span>
                  )}
                  {selectedStatus && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      ステータス: {statusOptions.find((s) => s.value === selectedStatus)?.label}
                    </span>
                  )}
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                    >
                      タグ: {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
