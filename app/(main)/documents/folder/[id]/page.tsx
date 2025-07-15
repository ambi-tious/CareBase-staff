'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FolderOpen, Upload, Trash2 } from 'lucide-react';
import { FolderBreadcrumb } from '@/components/2_molecules/documents/folder-breadcrumb';
import { FolderContentsView } from '@/components/3_organisms/documents/folder-contents-view';
import { FileUploadModal } from '@/components/3_organisms/modals/file-upload-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { useToast } from '@/components/ui/use-toast';
import { getFolderContents, getFolderPath, getFolder } from '@/mocks/hierarchical-documents';
import type { DocumentItem, Folder, Document, BreadcrumbItem } from '@/types/document';

interface FolderViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FolderViewPage({ params: paramsPromise }: FolderViewPageProps) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const { toast } = useToast();
  const [folder, setFolder] = useState<Folder | null>(null);
  const [contents, setContents] = useState<DocumentItem[]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // フォルダとコンテンツデータの取得
  useEffect(() => {
    const fetchFolderContents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 実際のアプリケーションではAPIを呼び出してデータを取得します
        await new Promise((resolve) => setTimeout(resolve, 300));

        // フォルダ情報を取得
        const folderData = getFolder(params.id);
        setFolder(folderData);

        // フォルダパスを取得
        const path = getFolderPath(params.id);
        setBreadcrumbPath(path as BreadcrumbItem[]);

        // フォルダコンテンツを取得
        const folderContents = getFolderContents(params.id);
        setContents(folderContents);
      } catch (error) {
        console.error('Failed to fetch folder contents:', error);
        setError('フォルダの内容を読み込めませんでした。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolderContents();
  }, [params.id]);

  const handleItemSelection = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(contents.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      // 実際のアプリケーションではAPIを呼び出して削除します
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 選択されたアイテムを削除
      setContents((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);

      toast({
        title: 'アイテムを削除しました',
        description: `${selectedItems.length}個のアイテムが削除されました`,
      });

      return true;
    } catch (error) {
      console.error('Failed to delete items:', error);
      return false;
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    // 実際のアプリケーションではAPIを呼び出してアップロードします
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // モックのアップロード成功処理
      const newFiles = files.map((file) => ({
        id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: 'document' as const,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        fileType: (file.name.split('.').pop() || 'txt') as 'pdf' | 'doc' | 'xlsx' | 'txt' | 'html',
        category: folder?.name || 'その他',
        status: 'published' as const,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        createdBy: '現在のユーザー',
      }));

      setContents((prev) => [...prev, ...newFiles]);

      toast({
        title: 'アップロード完了',
        description: `${files.length}個のファイルがアップロードされました`,
      });

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => router.back()}>戻る</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
          <div className="flex items-center gap-3">
            <FolderOpen className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">
              {folder?.name || 'フォルダ'}
            </h1>
          </div>
        </div>

        {/* パンくずリスト */}
        <FolderBreadcrumb path={breadcrumbPath} className="mb-4" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-600">
            {contents.length}個のアイテム • 最終更新: {folder?.updatedAt || '-'}
          </p>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              <Upload className="h-4 w-4 mr-2" />
              ファイルをアップロード
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteSelected}
              disabled={selectedItems.length === 0}
              className={
                selectedItems.length > 0 ? 'border-red-300 text-red-600 hover:bg-red-50' : ''
              }
            >
              <Trash2 className="h-4 w-4 mr-2" />
              選択したアイテムを削除
            </Button>
          </div>
        </div>
      </div>

      {/* フォルダ内容表示 */}
      <FolderContentsView
        items={contents}
        selectedItems={selectedItems}
        onItemSelection={handleItemSelection}
        onSelectAll={handleSelectAll}
      />

      {/* モーダル */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        folderId={params.id}
        folderName={folder?.name || 'フォルダ'}
      />

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        itemName={`選択された${selectedItems.length}個のアイテム`}
        itemType="アイテム"
        isDeleting={isDeleting}
      />
    </div>
  );
}
