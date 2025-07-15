'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FolderOpen, Upload, Trash2 } from 'lucide-react';
import { FolderContentsView } from '@/components/3_organisms/documents/folder-contents-view';
import { FileUploadModal } from '@/components/3_organisms/modals/file-upload-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { useToast } from '@/components/ui/use-toast';

interface FolderViewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FolderViewPage({ params: paramsPromise }: FolderViewPageProps) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const { toast } = useToast();
  const [folder, setFolder] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // フォルダとファイルデータの取得
  useEffect(() => {
    const fetchFolderContents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 実際のアプリケーションではAPIを呼び出してデータを取得します
        // ここではモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 500));

        // モックフォルダデータ
        const mockFolder = {
          id: params.id,
          name: '2025年度会議',
          type: 'folder',
          createdAt: '2025-01-15',
          updatedAt: '2025-01-20',
          itemCount: 5,
        };

        // モックファイルデータ
        const mockFiles = [
          {
            id: 'file-101',
            name: '第1回運営会議議事録.pdf',
            type: 'file',
            size: '2.3 MB',
            createdAt: '2025-01-20',
            updatedAt: '2025-01-20',
            createdBy: '田中 花子',
            fileType: 'pdf',
          },
          {
            id: 'file-102',
            name: '月次報告会議事録.docx',
            type: 'file',
            size: '1.8 MB',
            createdAt: '2025-01-18',
            updatedAt: '2025-01-18',
            createdBy: '佐藤 太郎',
            fileType: 'doc',
          },
          {
            id: 'file-103',
            name: '予算計画.xlsx',
            type: 'file',
            size: '3.5 MB',
            createdAt: '2025-01-15',
            updatedAt: '2025-01-17',
            createdBy: '鈴木 一郎',
            fileType: 'xlsx',
          },
          {
            id: 'file-104',
            name: '議事録テンプレート.docx',
            type: 'file',
            size: '0.8 MB',
            createdAt: '2025-01-10',
            updatedAt: '2025-01-10',
            createdBy: '高橋 恵子',
            fileType: 'doc',
          },
          {
            id: 'file-105',
            name: '会議スケジュール.pdf',
            type: 'file',
            size: '1.2 MB',
            createdAt: '2025-01-05',
            updatedAt: '2025-01-05',
            createdBy: '伊藤 健太',
            fileType: 'pdf',
          },
        ];

        setFolder(mockFolder);
        setFiles(mockFiles);
      } catch (error) {
        console.error('Failed to fetch folder contents:', error);
        setError('フォルダの内容を読み込めませんでした。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolderContents();
  }, [params.id]);

  const handleFileSelection = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles((prev) => [...prev, fileId]);
    } else {
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    }
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles(files.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedFiles.length === 0) return;
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    setIsDeleting(true);
    try {
      // 実際のアプリケーションではAPIを呼び出して削除します
      // ここではモックの処理
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // 選択されたファイルを削除
      setFiles((prev) => prev.filter((file) => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
      
      toast({
        title: 'ファイルを削除しました',
        description: `${selectedFiles.length}個のファイルが削除されました`,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to delete files:', error);
      return false;
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    // 実際のアプリケーションではAPIを呼び出してアップロードします
    // ここではモックの処理
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // モックのアップロード成功処理
      const newFiles = files.map((file) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: 'file',
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        createdBy: '現在のユーザー',
        fileType: file.name.split('.').pop() || 'txt',
      }));
      
      setFiles((prev) => [...prev, ...newFiles]);
      
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

  if (error || !folder) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'フォルダが見つかりませんでした'}</p>
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
            <h1 className="text-2xl font-bold text-carebase-text-primary">{folder.name}</h1>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-gray-600">
            {files.length}個のファイル • 最終更新: {folder.updatedAt}
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
              disabled={selectedFiles.length === 0}
              className={selectedFiles.length > 0 ? "border-red-300 text-red-600 hover:bg-red-50" : ""}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              選択したファイルを削除
            </Button>
          </div>
        </div>
      </div>

      {/* フォルダ内容表示 */}
      <FolderContentsView
        files={files}
        selectedFiles={selectedFiles}
        onFileSelection={handleFileSelection}
        onSelectAll={handleSelectAll}
      />

      {/* モーダル */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
        folderId={folder.id}
        folderName={folder.name}
      />

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        itemName={`選択された${selectedFiles.length}個のファイル`}
        itemType="ファイル"
        isDeleting={isDeleting}
      />
    </div>
  );
}