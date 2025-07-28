'use client';

import { CategoryBadge } from '@/components/1_atoms/individual-points/category-badge';
import { PriorityBadge } from '@/components/1_atoms/individual-points/priority-badge';
import { StatusBadge } from '@/components/1_atoms/individual-points/status-badge';
import { MediaThumbnail } from '@/components/1_atoms/individual-points/media-thumbnail';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { IndividualPoint } from '@/types/individual-point';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Edit3, Paperclip, Target, Trash2, User, X } from 'lucide-react';
import type React from 'react';

interface IndividualPointDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  point: IndividualPoint | null;
  onEdit?: (point: IndividualPoint) => void;
  onDelete?: (point: IndividualPoint) => void;
  onMediaView?: (mediaId: string) => void;
  residentName?: string;
}

export const IndividualPointDetailModal: React.FC<IndividualPointDetailModalProps> = ({
  isOpen,
  onClose,
  point,
  onEdit,
  onDelete,
  onMediaView,
  residentName,
}) => {
  if (!point) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  const handleEdit = () => {
    onEdit?.(point);
  };

  const handleDelete = () => {
    onDelete?.(point);
  };

  const handleMediaView = (mediaId: string) => {
    onMediaView?.(mediaId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto tablet:max-w-[95vw] tablet:max-h-[95vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-bold text-carebase-text-primary tablet:text-tablet-xl mb-2">
                個別ポイント詳細
              </DialogTitle>
              <DialogDescription className="text-gray-600 tablet:text-tablet-base">
                {residentName && `${residentName}様の`}個別ポイントの詳細情報です。
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 tablet:h-10 tablet:w-10"
            >
              <X className="h-4 w-4 tablet:h-5 tablet:w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 tablet:space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={point.category} />
              <PriorityBadge priority={point.priority} />
              <StatusBadge status={point.status} />
              {point.isSystemDefault && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  システム標準
                </Badge>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-carebase-text-primary tablet:text-3xl">
              {point.title}
            </h2>

            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 tablet:h-5 tablet:w-5" />
                <span>作成者: {point.createdByName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 tablet:h-5 tablet:w-5" />
                <span>作成日時: {formatDate(point.createdAt)}</span>
              </div>
              {point.updatedAt !== point.createdAt && (
                <div className="flex items-center gap-2 md:col-span-2">
                  <Calendar className="h-4 w-4 tablet:h-5 tablet:w-5" />
                  <span className="text-blue-600">最終更新: {formatDate(point.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary tablet:text-xl border-b pb-2">
              詳細内容
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line tablet:text-tablet-base tablet:leading-relaxed">
                {point.content}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          {point.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-carebase-text-primary tablet:text-xl border-b pb-2">
                備考
              </h3>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line tablet:text-tablet-base tablet:leading-relaxed">
                  {point.notes}
                </p>
              </div>
            </div>
          )}

          {/* Tags Section */}
          {point.tags.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-carebase-text-primary tablet:text-xl border-b pb-2">
                タグ
              </h3>
              <div className="flex flex-wrap gap-2">
                {point.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 tablet:text-tablet-sm tablet:px-3 tablet:py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Media Attachments Section */}
          {point.mediaAttachments.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-gray-500 tablet:h-6 tablet:w-6" />
                <h3 className="text-lg font-semibold text-carebase-text-primary tablet:text-xl">
                  添付ファイル ({point.mediaAttachments.length}件)
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 tablet:gap-6">
                {point.mediaAttachments.map((media) => (
                  <MediaThumbnail
                    key={media.id}
                    media={media}
                    onView={() => handleMediaView(media.id)}
                    size="md"
                    className="tablet:scale-110"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t tablet:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="tablet:px-6 tablet:py-3"
            >
              閉じる
            </Button>

            {onEdit && (
              <Button
                onClick={handleEdit}
                className="bg-carebase-blue hover:bg-carebase-blue-dark tablet:px-6 tablet:py-3"
              >
                <Edit3 className="h-4 w-4 mr-2 tablet:h-5 tablet:w-5" />
                編集
              </Button>
            )}

            {onDelete && !point.isSystemDefault && (
              <Button
                variant="outline"
                onClick={handleDelete}
                className="border-red-300 text-red-600 hover:bg-red-50 tablet:px-6 tablet:py-3"
              >
                <Trash2 className="h-4 w-4 mr-2 tablet:h-5 tablet:w-5" />
                削除
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
