'use client';

import { CategoryBadge } from '@/components/1_atoms/individual-points/category-badge';
import { PriorityBadge } from '@/components/1_atoms/individual-points/priority-badge';
import { StatusBadge } from '@/components/1_atoms/individual-points/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { IndividualPoint } from '@/types/individual-point';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Edit3, Paperclip, Target, Trash2, User } from 'lucide-react';
import type React from 'react';

interface IndividualPointsCompactListProps {
  points: IndividualPoint[];
  selectedCategory?: string;
  onEdit?: (point: IndividualPoint) => void;
  onDelete?: (point: IndividualPoint) => void;
  onViewDetails?: (point: IndividualPoint) => void;
  className?: string;
}

export const IndividualPointsCompactList: React.FC<IndividualPointsCompactListProps> = ({
  points,
  selectedCategory,
  onEdit,
  onDelete,
  onViewDetails,
  className = '',
}) => {
  // フィルタリング
  const filteredPoints = selectedCategory
    ? points.filter((point) => point.category === selectedCategory && point.status === 'active')
    : points.filter((point) => point.status === 'active');

  // 優先度順、作成日順でソート
  const sortedPoints = [...filteredPoints].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd HH:mm', { locale: ja });
  };

  const handleEdit = (e: React.MouseEvent, point: IndividualPoint) => {
    e.stopPropagation();
    onEdit?.(point);
  };

  const handleDelete = (e: React.MouseEvent, point: IndividualPoint) => {
    e.stopPropagation();
    onDelete?.(point);
  };

  const handleCardClick = (pointId: string) => {
    const point = sortedPoints.find(p => p.id === pointId);
    if (point) {
      onViewDetails?.(point);
    }
  };

  if (sortedPoints.length === 0) {
    return (
      <Card className={`border-dashed border-2 border-gray-300 ${className}`}>
        <CardContent className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-medium text-gray-900 mb-2">
            {selectedCategory
              ? 'このカテゴリの個別ポイントがありません'
              : '個別ポイントがありません'}
          </h3>
          <p className="text-sm text-gray-500">
            {selectedCategory
              ? '新しい個別ポイントを作成してください。'
              : '利用者様の個別ケアポイントを作成してください。'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* フィルタ表示 */}
      {selectedCategory && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-600">フィルタ中:</span>
          <CategoryBadge category={selectedCategory as any} />
          <span className="text-sm text-gray-500">({sortedPoints.length}件)</span>
        </div>
      )}

      {/* 個別ポイント一覧 */}
      {sortedPoints.map((point) => (
        <Card
          key={point.id}
          className="hover:shadow-md transition-all duration-200 cursor-pointer border-l-4 border-l-carebase-blue"
          onClick={() => onViewDetails?.(point)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              {/* メイン情報 */}
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-2">
                  <CategoryBadge category={point.category} />
                  <PriorityBadge priority={point.priority} />
                  <StatusBadge status={point.status} />
                  {point.mediaAttachments.length > 0 && (
                    <Badge variant="outline" className="text-xs bg-gray-50">
                      <Paperclip className="h-3 w-3 mr-1" />
                      {point.mediaAttachments.length}
                    </Badge>
                  )}
                </div>

                <h4 className="text-base font-semibold text-carebase-text-primary mb-2 line-clamp-1">
                  {point.title}
                </h4>

                <p className="text-sm text-gray-700 mb-3 line-clamp-2 leading-relaxed">
                  {point.content}
                </p>

                {/* タグ表示 */}
                {point.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {point.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                    {point.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                        +{point.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* メタ情報 */}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{point.createdByName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(point.createdAt)}</span>
                  </div>
                  {point.updatedAt !== point.createdAt && (
                    <span className="text-blue-600">更新: {formatDate(point.updatedAt)}</span>
                  )}
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleEdit(e, point)}
                    className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light h-8 px-3"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    編集
                  </Button>
                )}
                {onDelete && !point.isSystemDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleDelete(e, point)}
                    className="border-red-300 text-red-600 hover:bg-red-50 h-8 px-3"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    削除
                  </Button>
                )}
              </div>
            </div>

            {/* システム標準インジケーター */}
            {point.isSystemDefault && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  システム標準
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
