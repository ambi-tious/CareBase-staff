'use client';

import { IndividualPointsList } from '@/components/3_organisms/individual-points/individual-points-list';
import { IndividualPointModal } from '@/components/3_organisms/modals/individual-point-modal';
import { MediaViewerModal } from '@/components/3_organisms/modals/media-viewer-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Resident } from '@/mocks/care-board-data';
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
import { ArrowLeft, Target, User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';

interface IndividualPointsManagementProps {
  resident: Resident;
}

export const IndividualPointsManagement: React.FC<IndividualPointsManagementProps> = ({
  resident,
}) => {
  const [points, setPoints] = useState<IndividualPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
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
          resident.id.toString()
        );
        setPoints(residentPoints);
      } catch (error) {
        console.error('Failed to load individual points:', error);
        // Fallback to mock data
        const mockPoints = getIndividualPointsByResident(resident.id.toString());
        setPoints(mockPoints);
      } finally {
        setIsLoading(false);
      }
    };

    loadPoints();
  }, [resident.id]);

  const handleCreatePoint = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditPoint = (point: IndividualPoint) => {
    setSelectedPoint(point);
    setIsEditModalOpen(true);
  };

  const handleDeletePoint = (point: IndividualPoint) => {
    setSelectedPoint(point);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
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
        resident.id.toString(),
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
        resident.id.toString(),
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
      await individualPointService.deleteIndividualPoint(resident.id.toString(), selectedPoint.id);
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
    setIsMediaViewerOpen(false);
    setSelectedPoint(null);
    setSelectedMedia(null);
    setDeleteError(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href={`/residents/${resident.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              利用者詳細に戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">個別ポイント管理</h1>
          </div>
        </div>
      </div>

      {/* Resident Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            利用者情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-carebase-text-primary">{resident.name}</h3>
              <div className="text-sm text-gray-600 space-x-4">
                <span>年齢: {resident.age}歳</span>
                <span>性別: {resident.sex}</span>
                <span>介護度: {resident.careLevel}</span>
                <span>部屋: {resident.roomInfo || '未設定'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Points List */}
      <IndividualPointsList
        points={points}
        onCreatePoint={handleCreatePoint}
        onEditPoint={handleEditPoint}
        onDeletePoint={handleDeletePoint}
        onMediaView={handleMediaView}
      />

      {/* Modals */}
      <IndividualPointModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleCreateSubmit}
        residentName={resident.name}
        mode="create"
      />

      <IndividualPointModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleEditSubmit}
        point={selectedPoint || undefined}
        residentName={resident.name}
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
    </div>
  );
};
