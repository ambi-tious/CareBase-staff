'use client';

import type { DocumentFolder } from '@/mocks/documents-data';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface UseFolderManagementOptions {
  initialFolders: DocumentFolder[];
  categoryKey: string;
}

export const useFolderManagement = ({
  initialFolders,
  categoryKey,
}: UseFolderManagementOptions) => {
  const [folders, setFolders] = useState<DocumentFolder[]>(initialFolders);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<DocumentFolder | null>(null);

  // フォルダ名の一覧を取得（重複チェック用）
  const folderNames = folders.map((folder) => folder.name);

  // フォルダ作成
  const createFolder = useCallback(
    async (folderName: string): Promise<boolean> => {
      try {
        // 実際のアプリケーションではAPIを呼び出してフォルダを作成します
        // ここではモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newFolder: DocumentFolder = {
          id: `folder-${Date.now()}`,
          name: folderName,
          type: 'folder',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          itemCount: 0,
        };

        setFolders((prev) => [...prev, newFolder]);

        toast.success(`「${folderName}」フォルダが正常に作成されました`);

        return true;
      } catch (error) {
        console.error('Failed to create folder:', error);
        return false;
      }
    }
  );

  // フォルダ更新
  const updateFolder = useCallback(
    async (folderId: string, folderName: string): Promise<boolean> => {
      try {
        // 実際のアプリケーションではAPIを呼び出してフォルダを更新します
        // ここではモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 500));

        setFolders((prev) =>
          prev.map((folder) =>
            folder.id === folderId
              ? { ...folder, name: folderName, updatedAt: new Date().toISOString() }
              : folder
          )
        );

        toast.success(`フォルダ名が「${folderName}」に変更されました`);

        return true;
      } catch (error) {
        console.error('Failed to update folder:', error);
        return false;
      }
    }
  );

  // フォルダ削除
  const deleteFolder = useCallback(
    async (folderId: string): Promise<boolean> => {
      try {
        // 実際のアプリケーションではAPIを呼び出してフォルダを削除します
        // ここではモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 500));

        const folderToDelete = folders.find((folder) => folder.id === folderId);

        setFolders((prev) => prev.filter((folder) => folder.id !== folderId));

        toast.success(`「${folderToDelete?.name}」フォルダが削除されました`);

        return true;
      } catch (error) {
        console.error('Failed to delete folder:', error);
        return false;
      }
    },
    [folders]
  );

  // フォルダ内のアイテム数を確認
  const getFolderItemCount = useCallback(
    (folderId: string): number => {
      const folder = folders.find((folder) => folder.id === folderId);
      return folder?.itemCount || 0;
    },
    [folders]
  );

  // モーダル操作
  const openCreateModal = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  const openEditModal = useCallback((folder: DocumentFolder) => {
    setSelectedFolder(folder);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((folder: DocumentFolder) => {
    setSelectedFolder(folder);
    setIsDeleteModalOpen(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalOpen(false);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedFolder(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
    setSelectedFolder(null);
  }, []);

  return {
    folders,
    folderNames,
    selectedFolder,
    isCreateModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolderItemCount,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    closeCreateModal,
    closeEditModal,
    closeDeleteModal,
  };
};
