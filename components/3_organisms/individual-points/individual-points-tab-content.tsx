'use client';

import { IndividualPointsCompactList } from '@/components/2_molecules/individual-points/individual-points-compact-list';
import { IndividualPointsSummary } from '@/components/2_molecules/individual-points/individual-points-summary';
import { IndividualPointModal } from '@/components/3_organisms/modals/individual-point-modal';
import { MediaViewerModal } from '@/components/3_organisms/modals/media-viewer-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { IndividualPointDetailModal } from '@/components/3_organisms/modals/individual-point-detail-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getIndividualPointsByResident,
  individualPointsData,
} from '@/mocks/individual-points-data';
import { individualPointService } from '@/services/individualPointService';
import type {
  IndividualPoint,
  IndividualPointFormData,
  MediaAttachment,
} from '@/types/individual-point';
import { Target } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

interface IndividualPointsTabContentProps {
  residentId: number;
  residentName: string;
  className?: string;
}

export const IndividualPointsTabContent: React.FC<IndividualPointsTabContentProps> = ({
  residentId,
  residentName,
  className = '',
}) => {
  const [points, setPoints] = useState<IndividualPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<IndividualPoint | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaAttachment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Load individual points
  useEffect(() => {
    const loadPoints = async () => {
      try {
        setIsLoading(true);
        const residentPoints = await individualPointService.getIndividualPoints(
          residentId.toString()
        );
        setPoints(residentPoints);
      } catch (error) {
        console.error('Failed to load individual points:', error);
        // Fallback to mock data
        const mockPoints = getIndividualPointsByResident(residentId.toString());
        setPoints(mockPoints);
      } finally {
        setIsLoading(false);
      }
    };

    loadPoints();
  }, [residentId]);

  const handleCreatePoint = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditPoint = (point: IndividualPoint) => {
    setSelectedPoint(point);
    setIsDetailModalOpen(false); // 詳細モーダルを閉じる
    setIsEditModalOpen(true);
  };

  const handleDeletePoint = (point: IndividualPoint) => {
    setSelectedPoint(point);
    setIsDetailModalOpen(false); // 詳細モーダルを閉じる
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleViewDetails = (point: IndividualPoint) => {
    setSelectedPoint(point);
    setIsDetailModalOpen(true);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(selectedCategory === category ? undefined : category);
  };

  const handleMediaView = (mediaId: string) => {
    // Find media in all points
    for (const point of points) {
      const media = point.mediaAttachments.find((m) => m.id === mediaId);
      if (media) {
        setSelectedMedia(media);
        setIsMediaViewerOpen(true);
        break;
      }
    }
  };

  const handleCreateSubmit = async (
    data: IndividualPointFormData,
    mediaFiles?: File[]
  ): Promise<boolean> => {
    try {
      const newPoint = await individualPointService.createIndividualPoint(
        residentId.toString(),
        data,
        mediaFiles
      );
      setPoints((prev) => [newPoint, ...prev]);
      setIsCreateModalOpen(false);
      return true;
    } catch (error) {
      console.error('Failed to create individual point:', error);
      return false;
    }
  };

  const handleEditSubmit = async (
    data: IndividualPointFormData,
    mediaFiles?: File[]
  ): Promise<boolean> => {
    if (!selectedPoint) return false;

    try {
      const updatedPoint = await individualPointService.updateIndividualPoint(
        residentId.toString(),
        selectedPoint.id,
        data,
        mediaFiles
      );
      setPoints((prev) => prev.map((p) => (p.id === selectedPoint.id ? updatedPoint : p)));
      setIsEditModalOpen(false);
      setSelectedPoint(null);
      return true;
    } catch (error) {
      console.error('Failed to update individual point:', error);
      return false;
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    if (!selectedPoint) return false;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await individualPointService.deleteIndividualPoint(residentId.toString(), selectedPoint.id);
      setPoints((prev) => prev.filter((p) => p.id !== selectedPoint.id));
      setSelectedPoint(null);
      return true;
    } catch (error) {
      console.error('Failed to delete individual point:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsDetailModalOpen(false);
    setIsMediaViewerOpen(false);
    setSelectedPoint(null);
    setSelectedMedia(null);
    setDeleteError(null);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carebase-blue mx-auto mb-4"></div>
          <p className="text-gray-500">個別ポイントを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* サマリ表示 */}
      <IndividualPointsSummary
        points={points}
        onCreatePoint={handleCreatePoint}
        onCategoryClick={handleCategoryClick}
      />


      {/* コンパクトリスト表示 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-carebase-text-primary">
            個別ポイント一覧
            {selectedCategory && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                （カテゴリフィルタ適用中）
              </span>
            )}
          </h3>
          {selectedCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory(undefined)}
              className="text-gray-600"
            >
              フィルタを解除
            </Button>
          )}
        </div>

        <IndividualPointsCompactList
          points={points}
          selectedCategory={selectedCategory}
          onEdit={handleEditPoint}
          onDelete={handleDeletePoint}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* モーダル */}
      <IndividualPointModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleCreateSubmit}
        residentName={residentName}
        mode="create"
      />

      <IndividualPointModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleEditSubmit}
        point={selectedPoint || undefined}
        residentName={residentName}
        mode="edit"
      />

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        itemName={selectedPoint?.title || ''}
        itemType="個別ポイント"
        isDeleting={isDeleting}
        error={deleteError}
      />

      <MediaViewerModal
        isOpen={isMediaViewerOpen}
        onClose={handleCloseModals}
        media={selectedMedia}
      />

      <IndividualPointDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModals}
        point={selectedPoint}
        onEdit={handleEditPoint}
        onDelete={handleDeletePoint}
        onMediaView={handleMediaView}
        residentName={residentName}
      />
    </div>
  );
};