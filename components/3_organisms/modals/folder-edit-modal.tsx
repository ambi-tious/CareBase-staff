'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Edit, Loader2 } from 'lucide-react';
import type { DocumentFolder } from '@/mocks/documents-data';

interface FolderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateFolder: (folderId: string, folderName: string) => Promise<boolean>;
  folder: DocumentFolder | null;
  existingFolders: string[];
}

export const FolderEditModal: React.FC<FolderEditModalProps> = ({
  isOpen,
  onClose,
  onUpdateFolder,
  folder,
  existingFolders,
}) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォルダが変更されたら名前を更新
  useEffect(() => {
    if (folder) {
      setFolderName(folder.name);
    }
  }, [folder]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!folder) return;

    // 入力検証
    if (!folderName.trim()) {
      setError('フォルダ名を入力してください');
      return;
    }

    // 重複チェック（自分自身は除外）
    if (folderName.trim() !== folder.name && existingFolders.includes(folderName.trim())) {
      setError('同じ名前のフォルダが既に存在します');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const success = await onUpdateFolder(folder.id, folderName.trim());
      if (success) {
        onClose();
      } else {
        setError('フォルダの更新に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Failed to update folder:', error);
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-carebase-blue" />
            フォルダ名の編集
          </DialogTitle>
          <DialogDescription>フォルダの新しい名前を入力してください。</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 py-2">
            <Label htmlFor="folder-name" className="text-right">
              フォルダ名 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="folder-name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="col-span-3"
              autoFocus
              disabled={isSubmitting || !folder}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !folderName.trim() || !folder}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  更新中...
                </>
              ) : (
                '更新'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
