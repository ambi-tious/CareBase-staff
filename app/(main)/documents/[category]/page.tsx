'use client';

import { notFound } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FolderContentsView } from '@/components/3_organisms/documents/folder-contents-view';
import { FolderBreadcrumb } from '@/components/2_molecules/documents/folder-breadcrumb';
import { Button } from '@/components/ui/button';
import { FileUploadModal } from '@/components/3_organisms/modals/file-upload-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { useToast } from '@/components/ui/use-toast';
import { getDocumentsByCategory, getCategoryByKey } from '@/mocks/documents-data';
import { getFolderContents, getFolderPath, getFolder } from '@/mocks/hierarchical-documents';
import { FileText, FolderPlus, ArrowLeft, FolderOpen, Upload, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import type { DocumentItem, Folder, Document, BreadcrumbItem } from '@/types/document';

interface DocumentCategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

interface FolderViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DocumentCategoryPage({ params }: DocumentCategoryPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [categoryKey, setCategoryKey] = useState<string>('');
  const [category, setCategory] = useState<any>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [breadcrumbPath, setBreadcrumbPath] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFolderView, setIsFolderView] = useState(false);
  const [folder, setFolder] = useState<Folder | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const resolvedParams = await params;
        const key = resolvedParams.category;
        setCategoryKey(key);

        // フォルダIDかカテゴリーキーかを判定
        const isFolderId = key.startsWith('folder-'); // フォルダIDの判定ロジック
        setIsFolderView(isFolderId);

        if (isFolderId) {
          // フォルダビューの場合
          await new Promise((resolve) => setTimeout(resolve, 300));

          // フォルダ情報を取得
          const folderData = getFolder(key);
          setFolder(folderData);

          // フォルダパスを取得
          const path = getFolderPath(key);
          setBreadcrumbPath(path as BreadcrumbItem[]);

          // フォルダコンテンツを取得
          const folderContents = getFolderContents(key);
          setDocuments(folderContents);
        } else {
          // カテゴリービューの場合
          const cat = getCategoryByKey(key);
          setCategory(cat);

          if (!cat) {
            notFound();
          }

          const docs = getDocumentsByCategory(key);
          setDocuments(docs as unknown as DocumentItem[]);

          setBreadcrumbPath([
            { id: 'root', name: 'ホーム', path: '/documents' },
            { id: key, name: cat?.name || key, path: `/documents/${key}` },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('データを読み込めませんでした。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [params]);

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
        category: isFolderView ? (folder?.name || 'その他') : (category?.name || 'その他'),
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

  if (!category && !folder) {
    return null; // データ読み込み中
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          {isFolderView && (
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>
          )}
          <div className="flex items-center gap-3">
            {isFolderView ? (
              <FolderOpen className="h-6 w-6 text-carebase-blue" />
            ) : (
              <FileText className="h-6 w-6 text-carebase-blue" />
            )}
            <h1 className="text-2xl font-bold text-carebase-text-primary">
              {isFolderView ? (folder?.name || 'フォルダ') : (category?.name || 'カテゴリー')}
            </h1>
          </div>
        </div>

        {/* パンくずリスト */}
        <FolderBreadcrumb path={breadcrumbPath} className="mb-4" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-600">
            {documents.length}個のアイテム
            {isFolderView && folder?.updatedAt && ` • 最終更新: ${folder.updatedAt}`}
          </p>
          <div className="flex items-center gap-2">
            {isFolderView ? (
              <>
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
              </>
            ) : (
              <>
                <Link href="/documents/edit">
                  <Button className="bg-carebase-blue hover:bg-carebase-blue-dark">
                    <FileText className="h-4 w-4 mr-2" />
                    新規{category?.name}
                  </Button>
                </Link>
                <Button className="bg-carebase-blue hover:bg-carebase-blue-dark">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  新しいフォルダ
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* フォルダ内容表示 */}
      <FolderContentsView
        items={documents}
        selectedItems={selectedItems}
        onItemSelection={handleItemSelection}
        onSelectAll={handleSelectAll}
      />

      {/* モーダル */}
      {isFolderView && (
        <>
          <FileUploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onUpload={handleUpload}
            folderId={categoryKey}
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
        </>
      )}
    </div>
  );
}
