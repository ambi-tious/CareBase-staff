'use client';

import { IndividualPointCard } from '@/components/2_molecules/individual-points/individual-point-card';
import { IndividualPointFilters } from '@/components/2_molecules/individual-points/individual-point-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type {
  IndividualPoint,
  IndividualPointCategory,
  IndividualPointPriority,
  IndividualPointStatus,
} from '@/types/individual-point';
import { Target, PlusCircle, Settings } from 'lucide-react';
import type React from 'react';
import { useMemo, useState } from 'react';

interface IndividualPointsListProps {
  points: IndividualPoint[];
  onCreatePoint?: () => void;
  onEditPoint?: (point: IndividualPoint) => void;
  onDeletePoint?: (point: IndividualPoint) => void;
  onManageCategories?: () => void;
  onMediaView?: (mediaId: string) => void;
  className?: string;
}

export const IndividualPointsList: React.FC<IndividualPointsListProps> = ({
  points,
  onCreatePoint,
  onEditPoint,
  onDeletePoint,
  onManageCategories,
  onMediaView,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IndividualPointCategory | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<IndividualPointPriority | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<IndividualPointStatus | undefined>('active');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Extract all available tags from points
  const availableTags = useMemo(() => {
    const allTags = points.flatMap((point) => point.tags);
    return Array.from(new Set(allTags)).sort();
  }, [points]);

  // Filter points based on search and filters
  const filteredPoints = useMemo(() => {
    return points
      .filter((point) => {
        // Search filter
        const matchesSearch =
          searchQuery === '' ||
          point.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          point.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          point.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        // Category filter
        const matchesCategory = !selectedCategory || point.category === selectedCategory;

        // Priority filter
        const matchesPriority = !selectedPriority || point.priority === selectedPriority;

        // Status filter
        const matchesStatus = !selectedStatus || point.status === selectedStatus;

        // Tags filter
        const matchesTags =
          selectedTags.length === 0 || selectedTags.some((tag) => point.tags.includes(tag));

        return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesTags;
      })
      .sort((a, b) => {
        // Sort by priority (high -> medium -> low), then by creation date (newest first)
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

        if (priorityDiff !== 0) {
          return priorityDiff;
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [points, searchQuery, selectedCategory, selectedPriority, selectedStatus, selectedTags]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setSelectedPriority(undefined);
    setSelectedStatus('active');
    setSelectedTags([]);
  };

  const handleTagAdd = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags((prev) => [...prev, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const activeCount = points.filter((p) => p.status === 'active').length;
  const totalCount = points.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-carebase-blue" />
            <h2 className="text-2xl font-bold text-carebase-text-primary">個別ポイント</h2>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>有効: {activeCount}件</span>
            <span>総数: {totalCount}件</span>
            <span>表示中: {filteredPoints.length}件</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onManageCategories && (
            <Button
              variant="outline"
              onClick={onManageCategories}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Settings className="h-4 w-4 mr-2" />
              カテゴリ管理
            </Button>
          )}
          {onCreatePoint && (
            <Button
              onClick={onCreatePoint}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <IndividualPointFilters
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedPriority={selectedPriority}
            selectedStatus={selectedStatus}
            selectedTags={selectedTags}
            availableTags={availableTags}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onPriorityChange={setSelectedPriority}
            onStatusChange={setSelectedStatus}
            onTagAdd={handleTagAdd}
            onTagRemove={handleTagRemove}
            onReset={handleResetFilters}
          />
        </CardContent>
      </Card>

      {/* Points List */}
      {filteredPoints.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">個別ポイントが見つかりません</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory || selectedPriority || selectedTags.length > 0
                ? '検索条件に一致する個別ポイントがありません。条件を変更してお試しください。'
                : '個別ポイントが登録されていません。新規作成してください。'}
            </p>
            {onCreatePoint && (
              <Button
                onClick={onCreatePoint}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                最初の個別ポイントを作成
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPoints.map((point) => (
            <IndividualPointCard
              key={point.id}
              point={point}
              onEdit={onEditPoint}
              onDelete={onDeletePoint}
              onMediaView={onMediaView}
            />
          ))}
        </div>
      )}
    </div>
  );
};
