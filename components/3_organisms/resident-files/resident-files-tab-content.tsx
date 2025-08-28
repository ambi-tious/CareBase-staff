'use client';

import { FileFilters } from '@/components/2_molecules/resident-files/file-filters';
import { FileGridView } from '@/components/2_molecules/resident-files/file-grid-view';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { ResidentFileEditModal } from '@/components/3_organisms/modals/resident-file-edit-modal';
import { ResidentFileUploadModal } from '@/components/3_organisms/modals/resident-file-upload-modal';
import { ResidentFileViewerModal } from '@/components/3_organisms/modals/resident-file-viewer-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getResidentFilesByResidentId } from '@/mocks/resident-file-data';
import { residentFileService } from '@/services/residentFileService';
import type { ResidentFile, ResidentFileCategory } from '@/types/resident-file';
import type { ResidentFileFormData } from '@/validations/resident-file-validation';
import { FileText, Upload } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ResidentFilesTabContentProps {
  residentId: number;
  residentName: string;
  className?: string;
}

export const ResidentFilesTabContent: React.FC<ResidentFilesTabContentProps> = ({
  residentId,
  residentName,
  className = '',
}) => {
  const [files, setFiles] = useState<ResidentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ResidentFileCategory | undefined>();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewerModalOpen, setIsViewerModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<ResidentFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Load resident files
  useEffect(() => {
    const loadFiles = async () => {
      try {
        setIsLoading(true);
        const residentFiles = await residentFileService.getResidentFiles(residentId.toString());
        setFiles(residentFiles);
      } catch (error) {
        console.error('Failed to load resident files:', error);
        // Fallback to mock data
        const mockFiles = getResidentFilesByResidentId(residentId.toString());
        setFiles(mockFiles);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [residentId]);

  // Filter files based on search and category
  const filteredFiles = files.filter((file) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      file.originalFileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory = !selectedCategory || file.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleUploadFile = () => {
    setIsUploadModalOpen(true);
  };

  const handleFileView = (file: ResidentFile) => {
    setSelectedFile(file);
    setIsViewerModalOpen(true);
  };

  const handleFileEdit = (file: ResidentFile) => {
    setSelectedFile(file);
    setIsEditModalOpen(true);
  };

  const handleFileDelete = (file: ResidentFile) => {
    setSelectedFile(file);
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleFileDownload = (file: ResidentFile) => {
    // Create download link
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('ファイルのダウンロードを開始しました。');
  };

  const handleUploadSubmit = async (data: ResidentFileFormData, file: File): Promise<boolean> => {
    try {
      const newFile = await residentFileService.uploadResidentFile(
        residentId.toString(),
        file,
        data
      );
      setFiles((prev) => [newFile, ...prev]);

      // Show success toast
      toast.success('ファイルのアップロードが完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to upload file:', error);
      return false;
    }
  };

  const handleEditSubmit = async (data: ResidentFileFormData): Promise<boolean> => {
    if (!selectedFile) return false;

    try {
      const updatedFile = await residentFileService.updateResidentFile(
        residentId.toString(),
        selectedFile.id,
        data
      );
      setFiles((prev) => prev.map((f) => (f.id === selectedFile.id ? updatedFile : f)));

      // Show success toast
      toast.success('ファイル情報の更新が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to update file:', error);
      return false;
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    if (!selectedFile) return false;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await residentFileService.deleteResidentFile(residentId.toString(), selectedFile.id);
      setFiles((prev) => prev.filter((f) => f.id !== selectedFile.id));

      // Show success toast
      toast.success('ファイルの削除が完了しました。');

      return true;
    } catch (error) {
      console.error('Failed to delete file:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(undefined);
  };

  const handleCloseModals = () => {
    setIsUploadModalOpen(false);
    setIsViewerModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedFile(null);
    setDeleteError(null);
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carebase-blue mx-auto mb-4"></div>
          <p className="text-gray-500">ファイルを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filters */}
      <FileFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onReset={handleResetFilters}
        onUploadFile={handleUploadFile}
      />

      {/* File grid */}
      {filteredFiles.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery || selectedCategory
                ? 'フィルタ条件に一致するファイルがありません'
                : 'ファイルがありません'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedCategory
                ? 'フィルタ条件を変更するか、新しいファイルをアップロードしてください。'
                : '利用者様に関するファイルをアップロードしてください。'}
            </p>
            <Button
              onClick={handleUploadFile}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              <Upload className="h-4 w-4 mr-2" />
              最初のファイルをアップロード
            </Button>
          </CardContent>
        </Card>
      ) : (
        <FileGridView files={filteredFiles} onFileView={handleFileView} />
      )}

      {/* Modals */}
      <ResidentFileUploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleUploadSubmit}
        residentName={residentName}
      />

      <ResidentFileViewerModal
        isOpen={isViewerModalOpen}
        onClose={handleCloseModals}
        file={selectedFile}
        onEdit={handleFileEdit}
        onDelete={handleFileDelete}
      />

      <ResidentFileEditModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleEditSubmit}
        file={selectedFile}
        residentName={residentName}
      />

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        itemName={selectedFile?.originalFileName || ''}
        itemType="ファイル"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
};
