'use client';

import type React from 'react';
import { useState } from 'react';
import type { IndividualPoint } from '@/types/individual-point';
import { CategoryBadge } from '@/components/1_atoms/individual-points/category-badge';
import { PriorityBadge } from '@/components/1_atoms/individual-points/priority-badge';
import { StatusBadge } from '@/components/1_atoms/individual-points/status-badge';
import { MediaThumbnail } from '@/components/1_atoms/individual-points/media-thumbnail';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit3, Trash2, Calendar, User, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface IndividualPointCardProps {
  point: IndividualPoint;
  onEdit?: (point: IndividualPoint) => void;
  onDelete?: (point: IndividualPoint) => void;
  onMediaView?: (mediaId: string) => void;
  className?: string;
}

export const IndividualPointCard: React.FC<IndividualPointCardProps> = ({
  point,
  onEdit,
  onDelete,
  onMediaView,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEdit = () => {
    onEdit?.(point);
  };

  const handleDelete = () => {
    onDelete?.(point);
  };

  const handleMediaView = (mediaId: string) => {
    onMediaView?.(mediaId);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  const shouldShowExpandButton = point.content.length > 100 || point.notes;

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <CategoryBadge category={point.category} />
              <PriorityBadge priority={point.priority} />
              <StatusBadge status={point.status} />
            </div>
            <h3 className="text-lg font-semibold text-carebase-text-primary mb-1 line-clamp-2">
              {point.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{point.createdByName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(point.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
              >
                <Edit3 className="h-3 w-3 mr-1" />
                編集
              </Button>
            )}
            {onDelete && !point.isSystemDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                削除
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Content */}
        <div className="mb-4">
          <p
            className={`text-gray-700 leading-relaxed ${!isExpanded && shouldShowExpandButton ? 'line-clamp-3' : ''}`}
          >
            {point.content}
          </p>
          {shouldShowExpandButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 p-0 h-auto text-carebase-blue hover:bg-transparent"
            >
              {isExpanded ? '折りたたむ' : 'もっと見る'}
            </Button>
          )}
        </div>

        {/* Notes (expanded view only) */}
        {isExpanded && point.notes && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-1">備考</h4>
            <p className="text-sm text-gray-600">{point.notes}</p>
          </div>
        )}

        {/* Tags */}
        {point.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {point.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs bg-gray-50 text-gray-600 border-gray-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Media attachments */}
        {point.mediaAttachments.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 mb-3">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                添付ファイル ({point.mediaAttachments.length}件)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {point.mediaAttachments.map((media) => (
                <MediaThumbnail
                  key={media.id}
                  media={media}
                  onView={() => handleMediaView(media.id)}
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* System default indicator */}
        {point.isSystemDefault && (
          <div className="mt-4 pt-3 border-t">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              システム標準
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
