'use client';

import { FolderBreadcrumb } from '@/components/2_molecules/documents/folder-breadcrumb';
import { FolderContentsView } from '@/components/3_organisms/documents/folder-contents-view';
import { FileUploadModal } from '@/components/3_organisms/modals/file-upload-modal';
import { FolderCreateModal } from '@/components/3_organisms/modals/folder-create-modal';
import { FolderDeleteModal } from '@/components/3_organisms/modals/folder-delete-modal';
import { FolderEditModal } from '@/components/3_organisms/modals/folder-edit-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { DocumentCategory, DocumentFolder } from '@/mocks/documents-data';
import { getCategoryByKey, getDocumentsByCategory } from '@/mocks/documents-data';
import {
  createFolder,
  deleteFolder,
  getExistingFolderNames,
  getFolder,
  getFolderContents,
  getFolderPath,
  updateFolder,
} from '@/mocks/hierarchical-documents';
import type { DocumentItem, Folder } from '@/types/document';
import { FileText, FolderPlus, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

// パンくずリストアイテムの型定義
interface BreadcrumbPathItem {
  id: string;
  name: string;
  path: string;
}

function DocumentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // URLパラメータからカテゴリーまたはフォルダIDを取得
  const categoryOrFolderId = searchParams.get('category') || searchParams.get('folder') || null;

  const [category, setCategory] = useState<DocumentCategory | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbPathItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFolderView, setIsFolderView] = useState(false);
  const [folder, setFolder] = useState<Folder | null>(null);

  // フォルダ操作の状態管理
  const [isFolderCreateModalOpen, setIsFolderCreateModalOpen] = useState(false);
  const [isFolderEditModalOpen, setIsFolderEditModalOpen] = useState(false);
  const [isFolderDeleteModalOpen, setIsFolderDeleteModalOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [existingFolderNames, setExistingFolderNames] = useState<string[]>([]);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!categoryOrFolderId) {
          // ルートビュー
          const contents = getFolderContents(null);

          setDocuments(contents);
          setBreadcrumbPath([]);
          setIsFolderView(false);
          setCategory(null);
          setFolder(null);
        } else {
          // フォルダIDかカテゴリーキーかを判定
          const isFolderId = categoryOrFolderId.startsWith('folder-');
          setIsFolderView(isFolderId);

          if (isFolderId) {
            // フォルダビューの場合
            await new Promise((resolve) => setTimeout(resolve, 300));

            // フォルダ情報を取得
            const folderData = getFolder(categoryOrFolderId);
            setFolder(folderData);

            if (!folderData) {
              notFound();
            }

            // フォルダパスを取得
            const path = getFolderPath(categoryOrFolderId)
              .filter((item) => item.id !== 'root')
              .map((item) => ({
                ...item,
                path: `/documents/folder/${item.id}`,
              }));
            setBreadcrumbPath(path);

            // フォルダコンテンツを取得
            const folderContents = getFolderContents(categoryOrFolderId);
            setDocuments(folderContents);
          } else {
            // カテゴリービューの場合
            const cat = getCategoryByKey(categoryOrFolderId);
            setCategory(cat ?? null);

            if (!cat) {
              notFound();
            }

            const docs = getDocumentsByCategory(categoryOrFolderId);
            setDocuments(docs as unknown as DocumentItem[]);

            setBreadcrumbPath([
              {
                id: categoryOrFolderId,
                name: cat?.name || categoryOrFolderId,
                path: `/documents?category=${categoryOrFolderId}`,
              },
            ]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('データを読み込めませんでした。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [categoryOrFolderId]);

  const handleItemSelection = (itemId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems((prev) => [...prev, itemId]);
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedItems(documents.map((item) => item.id));
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
      setDocuments((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
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
        category: isFolderView ? folder?.name || 'その他' : category?.name || 'その他',
        status: 'published' as const,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        createdBy: '現在のユーザー',
      }));

      setDocuments((prev) => [...prev, ...newFiles]);

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

  // フォルダ作成の処理
  const handleCreateFolder = () => {
    const existingNames = getExistingFolderNames(categoryOrFolderId);
    setExistingFolderNames(existingNames);
    setIsFolderCreateModalOpen(true);
  };

  const handleFolderCreate = async (folderName: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newFolder = createFolder(folderName, categoryOrFolderId);
      setDocuments((prev) => [newFolder, ...prev]);

      toast({
        title: 'フォルダを作成しました',
        description: `「${folderName}」フォルダが作成されました`,
      });

      return true;
    } catch (error) {
      console.error('Failed to create folder:', error);
      return false;
    }
  };

  // フォルダ編集の処理
  const handleEditFolder = (item: DocumentItem) => {
    if (item.type !== 'folder') return;
    const folder = item as Folder;
    setSelectedFolder(folder);
    const existingNames = getExistingFolderNames(folder.parentId);
    setExistingFolderNames(existingNames);
    setIsFolderEditModalOpen(true);
  };

  const handleFolderUpdate = async (folderId: string, folderName: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const success = updateFolder(folderId, folderName);
      if (success) {
        setDocuments((prev) =>
          prev.map((item) =>
            item.id === folderId && item.type === 'folder'
              ? { ...item, name: folderName, updatedAt: new Date().toISOString().split('T')[0] }
              : item
          )
        );

        toast({
          title: 'フォルダを更新しました',
          description: `フォルダ名を「${folderName}」に変更しました`,
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update folder:', error);
      return false;
    }
  };

  // フォルダ削除の処理
  const handleDeleteFolder = (item: DocumentItem) => {
    if (item.type !== 'folder') return;
    const folder = item as Folder;
    setSelectedFolder(folder);
    setIsFolderDeleteModalOpen(true);
  };

  const handleFolderDelete = async (folderId: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const success = deleteFolder(folderId);
      if (success) {
        setDocuments((prev) => prev.filter((item) => item.id !== folderId));

        toast({
          title: 'フォルダを削除しました',
          description: '選択したフォルダが削除されました',
        });

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete folder:', error);
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
      <div className="mb-6">
        {/* パンくずリスト */}
        <FolderBreadcrumb path={breadcrumbPath} className="mb-4" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-600">
            {documents.length}個のアイテム
            {isFolderView && folder?.updatedAt && ` • 最終更新: ${folder.updatedAt}`}
          </p>
          <div className="flex items-center gap-2">
            <Link href="/documents/edit">
              <Button className="bg-carebase-blue hover:bg-carebase-blue-dark">
                <FileText className="h-4 w-4 mr-2" />
                新規書類
              </Button>
            </Link>
            <Button
              onClick={handleCreateFolder}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              <FolderPlus className="h-4 w-4 mr-2" />
              新しいフォルダ
            </Button>
            <Button
              onClick={() => setIsUploadModalOpen(true)}
              variant="outline"
              className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
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
        items={documents}
        selectedItems={selectedItems}
        onItemSelection={handleItemSelection}
        onSelectAll={handleSelectAll}
        onEditFolder={handleEditFolder}
        onDeleteFolder={handleDeleteFolder}
      />

      {/* モーダル */}
      {(isFolderView || !categoryOrFolderId) && (
        <>
          <FileUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onUpload={handleUpload}
            folderId={categoryOrFolderId || 'root'}
            folderName={isFolderView ? folder?.name || 'フォルダ' : 'ホーム'}
          />

          <GenericDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={executeDelete}
            itemName={`選択された${selectedItems.length}個のアイテム`}
            itemType="アイテム"
            isDeleting={isDeleting}
          />

          {/* フォルダ操作モーダル */}
          <FolderCreateModal
            isOpen={isFolderCreateModalOpen}
            onClose={() => setIsFolderCreateModalOpen(false)}
            onCreateFolder={handleFolderCreate}
            existingFolders={existingFolderNames}
          />

          <FolderEditModal
            isOpen={isFolderEditModalOpen}
            onClose={() => setIsFolderEditModalOpen(false)}
            onUpdateFolder={handleFolderUpdate}
            folder={
              selectedFolder
                ? ({
                    id: selectedFolder.id,
                    name: selectedFolder.name,
                    type: selectedFolder.type,
                    createdAt: selectedFolder.createdAt,
                    updatedAt: selectedFolder.updatedAt,
                    itemCount: 0, // フォルダ内のアイテム数（実際のアプリケーションでは取得）
                  } as DocumentFolder)
                : null
            }
            existingFolders={existingFolderNames}
          />

          <FolderDeleteModal
            isOpen={isFolderDeleteModalOpen}
            onClose={() => setIsFolderDeleteModalOpen(false)}
            onDeleteFolder={handleFolderDelete}
            folder={
              selectedFolder
                ? ({
                    id: selectedFolder.id,
                    name: selectedFolder.name,
                    type: selectedFolder.type,
                    createdAt: selectedFolder.createdAt,
                    updatedAt: selectedFolder.updatedAt,
                    itemCount: 0, // フォルダ内のアイテム数（実際のアプリケーションでは取得）
                  } as DocumentFolder)
                : null
            }
            hasItems={false}
          />
        </>
      )}
    </div>
  );
}

// ローディングフォールバックコンポーネント
function DocumentsLoading() {
  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<DocumentsLoading />}>
      <DocumentsContent />
    </Suspense>
  );
}
