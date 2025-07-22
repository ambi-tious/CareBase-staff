'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getFolderPath, rootFolders, subFolders } from '@/mocks/hierarchical-documents';
import { AlertCircle, Check, Folder, FolderOpen } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

interface Folder {
  id: string;
  name: string;
  type: 'folder';
  parentId: string | null;
  children?: Folder[];
}

interface DocumentLocationMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
  currentFolderId: string | null;
  onMoveSuccess: (newFolderId: string | null) => void;
}

export const DocumentLocationMoveModal: React.FC<DocumentLocationMoveModalProps> = ({
  isOpen,
  onClose,
  documentId,
  documentTitle,
  currentFolderId,
  onMoveSuccess,
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(currentFolderId);
  const [isMoving, setIsMoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォルダ一覧を取得
  const getAllFolders = (): Folder[] => {
    const folders: Folder[] = [];

    // ルートフォルダを追加
    rootFolders.forEach((folder) => {
      folders.push({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        parentId: folder.parentId,
      });
    });

    // サブフォルダを追加
    subFolders.forEach((folder) => {
      folders.push({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        parentId: folder.parentId,
      });
    });

    return folders;
  };

  const folders = getAllFolders();

  // フォルダパス表示用
  const getFolderDisplayPath = (folderId: string | null): string => {
    if (!folderId) return 'ルート';

    try {
      const folderPath = getFolderPath(folderId);
      return (
        folderPath
          .filter((item) => item.id !== 'root')
          .map((item) => item.name)
          .join(' > ') || 'ルート'
      );
    } catch (error) {
      console.error('Failed to get folder path:', error);
      return 'ルート';
    }
  };

  const handleMove = async () => {
    setIsMoving(true);
    setError(null);

    try {
      // 実際のアプリケーションではAPIを呼び出して移動処理を実行
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 移動処理をシミュレート
      console.log(`Moving document ${documentId} to folder ${selectedFolderId}`);

      onMoveSuccess(selectedFolderId);
      onClose();
    } catch (error) {
      console.error('Failed to move document:', error);
      setError('書類の移動に失敗しました。もう一度お試しください。');
    } finally {
      setIsMoving(false);
    }
  };

  const currentPath = getFolderDisplayPath(currentFolderId);
  const newPath = getFolderDisplayPath(selectedFolderId);
  const isLocationChanged = selectedFolderId !== currentFolderId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            書類の場所を移動
          </DialogTitle>
          <DialogDescription>
            「{documentTitle}」の保存場所を変更します。移動先のフォルダを選択してください。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 現在の場所 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">現在の場所</label>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
              <FolderOpen className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">{currentPath}</span>
            </div>
          </div>

          {/* 移動先選択 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">移動先</label>
            <div className="border rounded-md max-h-48 overflow-y-auto">
              {/* ルートフォルダ */}
              <button
                type="button"
                onClick={() => setSelectedFolderId(null)}
                className={`w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedFolderId === null ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <Folder className="h-4 w-4 text-gray-500" />
                <span className="text-sm">ルート</span>
                {selectedFolderId === null && <Check className="h-4 w-4 text-blue-600 ml-auto" />}
              </button>

              {/* フォルダ一覧 */}
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  type="button"
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 transition-colors border-t ${
                    selectedFolderId === folder.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <Folder className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{getFolderDisplayPath(folder.id)}</span>
                  {selectedFolderId === folder.id && (
                    <Check className="h-4 w-4 text-blue-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 移動先プレビュー */}
          {isLocationChanged && (
            <Alert className="border-blue-200 bg-blue-50">
              <Folder className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">移動先: {newPath}</AlertDescription>
            </Alert>
          )}

          {/* エラー表示 */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isMoving}>
            キャンセル
          </Button>
          <Button
            onClick={handleMove}
            disabled={!isLocationChanged || isMoving}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
          >
            {isMoving ? '移動中...' : '移動'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
