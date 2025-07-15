'use client';

import type React from 'react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import type { DocumentFolder } from '@/mocks/documents-data';

interface FolderDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeleteFolder: (folderId: string) => Promise<boolean>;
  folder: DocumentFolder | null;
  hasItems: boolean;
}

export const FolderDeleteModal: React.FC<FolderDeleteModalProps> = ({
  isOpen,
  onClose,
  onDeleteFolder,
  folder,
  hasItems,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!folder) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const success = await onDeleteFolder(folder.id);
      if (success) {
        onClose();
      } else {
        setError('フォルダの削除に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
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
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            フォルダの削除
          </DialogTitle>
          <DialogDescription>この操作は取り消すことができません。</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <div className="py-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>{folder?.name}</strong> フォルダを削除してもよろしいですか？
              {hasItems && (
                <p className="mt-2 font-semibold">
                  このフォルダには {folder?.itemCount} 個のアイテムが含まれています。
                  削除するとフォルダ内のすべてのアイテムも削除されます。
                </p>
              )}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isSubmitting || !folder}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                削除中...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                削除する
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
