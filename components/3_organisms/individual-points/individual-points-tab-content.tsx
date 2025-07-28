'use client';

import { IndividualPointsCompactList } from '@/components/2_molecules/individual-points/individual-points-compact-list';
import { IndividualPointsFilters } from '@/components/2_molecules/individual-points/individual-points-filters';
import { IndividualPointsSummary } from '@/components/2_molecules/individual-points/individual-points-summary';
import { CategoryManagementModal } from '@/components/3_organisms/modals/category-management-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { IndividualPointDetailModal } from '@/components/3_organisms/modals/individual-point-detail-modal';
import { IndividualPointModal } from '@/components/3_organisms/modals/individual-point-modal';
import { MediaViewerModal } from '@/components/3_organisms/modals/media-viewer-modal';
import { getIndividualPointsByResident } from '@/mocks/individual-points-data';
import { individualPointService } from '@/services/individualPointService';
import type {
  CategoryFormData,
  IndividualPoint,
  IndividualPointFormData,
  MediaAttachment,
  PointCategory,
} from '@/types/individual-point';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface IndividualPointsTabContentProps {
  residentId: number;
  residentName: string;
  className?: string;
}

export interface IndividualPointsTabContentRef {
  openCreateModal: () => void;
  openCategoryModal: () => void;
}

export const IndividualPointsTabContent = forwardRef<
  IndividualPointsTabContentRef,
  IndividualPointsTabContentProps
>(({ residentId, residentName, className = '' }, ref) => {
  const [points, setPoints] = useState<IndividualPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedPriority, setSelectedPriority] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<IndividualPoint | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaAttachment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [categories, setCategories] = useState<PointCategory[]>([]);

  // Load individual points
  useEffect(() => {
    const loadPoints = async () => {
      try {
        setIsLoading(true);
        const residentPoints = await individualPointService.getIndividualPoints(
          residentId.toString()
        );
        setPoints(residentPoints);

        // Load categories
        const pointCategories = await individualPointService.getPointCategories();
        setCategories(pointCategories);
      } catch (error) {
        console.error('Failed to load individual points:', error);
        // Fallback to mock data
        const mockPoints = getIndividualPointsByResident(residentId.toString());
        setPoints(mockPoints);

        // Load mock categories
        const { pointCategoriesData } = await import('@/mocks/individual-points-data');
        setCategories(pointCategoriesData);
      } finally {
        setIsLoading(false);
      }
    };

    loadPoints();
  }, [residentId]);

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    openCreateModal: handleCreatePoint,
    openCategoryModal: handleCategoryManagement,
  }));

  const handleCreatePoint = () => {
    setIsCreateModalOpen(true);
  };

  const handleCategoryManagement = () => {
    setIsCategoryModalOpen(true);
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
    const newCategory = selectedCategory === category ? undefined : category;
    setSelectedCategory(newCategory);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
    setSelectedPriority(undefined);
    setSelectedStatus(undefined);
    setSelectedTags([]);
  };

  const handleCreateCategory = async (data: CategoryFormData): Promise<boolean> => {
    try {
      const newCategory = await individualPointService.createPointCategory(data);
      setCategories((prev) => [...prev, newCategory]);
      return true;
    } catch (error) {
      console.error('Failed to create category:', error);
      return false;
    }
  };

  const handleUpdateCategory = async (
    categoryId: string,
    data: CategoryFormData
  ): Promise<boolean> => {
    try {
      // In a real implementation, this would call the API
      // For now, we'll update the local state
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                name: data.name,
                description: data.description || '',
                icon: data.icon,
                color: data.color,
                updatedAt: new Date().toISOString(),
              }
            : cat
        )
      );
      return true;
    } catch (error) {
      console.error('Failed to update category:', error);
      return false;
    }
  };

  const handleDeleteCategory = async (categoryId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would call the API
      // For now, we'll update the local state
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
      return true;
    } catch (error) {
      console.error('Failed to delete category:', error);
      return false;
    }
  };

  // フィルタリングされたポイントを取得
  const filteredPoints = points.filter((point) => {
    // 検索クエリフィルター
    const matchesSearch =
      searchQuery === '' ||
      point.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // カテゴリフィルター
    const matchesCategory = !selectedCategory || point.category === selectedCategory;

    // 優先度フィルター
    const matchesPriority = !selectedPriority || point.priority === selectedPriority;

    // ステータスフィルター
    const matchesStatus = !selectedStatus || point.status === selectedStatus;

    // タグフィルター
    const matchesTags =
      selectedTags.length === 0 || selectedTags.every((tag) => point.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesTags;
  });

  // 利用可能なタグ一覧を取得
  const availableTags = Array.from(new Set(points.flatMap((point) => point.tags))).sort();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handlePriorityChange = (priority?: string) => {
    setSelectedPriority(priority);
  };

  const handleStatusChange = (status?: string) => {
    setSelectedStatus(status);
  };

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
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
    setIsCategoryModalOpen(false);
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
        selectedCategory={selectedCategory}
        onCategoryManagement={handleCategoryManagement}
      />

      {/* フィルタ機能 */}
      <IndividualPointsFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory as any}
        selectedPriority={selectedPriority as any}
        selectedStatus={selectedStatus as any}
        selectedTags={selectedTags}
        availableTags={availableTags}
        onCreatePoint={handleCreatePoint}
        onSearchChange={handleSearchChange}
        onCategoryChange={(category) => setSelectedCategory(category)}
        onPriorityChange={handlePriorityChange}
        onStatusChange={handleStatusChange}
        onTagsChange={handleTagsChange}
        onReset={handleResetFilters}
      />

      <IndividualPointsCompactList
        points={filteredPoints}
        selectedCategory={selectedCategory}
        onEdit={handleEditPoint}
        onDelete={handleDeletePoint}
        onViewDetails={handleViewDetails}
      />

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

      <CategoryManagementModal
        isOpen={isCategoryModalOpen}
        onClose={handleCloseModals}
        categories={categories}
        onCreateCategory={handleCreateCategory}
        onUpdateCategory={handleUpdateCategory}
        onDeleteCategory={handleDeleteCategory}
      />
    </div>
  );
});
