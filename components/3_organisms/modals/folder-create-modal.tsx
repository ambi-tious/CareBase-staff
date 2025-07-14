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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Folder, Loader2 } from 'lucide-react';

interface FolderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (folderName: string) => Promise<boolean>;
  existingFolders: string[];
}

export const FolderCreateModal: React.FC<FolderCreateModalProps> = ({
  isOpen,
  onClose,
  onCreateFolder,
  existingFolders,
}) => {
  const [folderName, setFolderName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 入力検証
    if (!folderName.trim()) {
      setError('フォルダ名を入力してください');
      return;
    }
    
    // 重複チェック
    if (existingFolders.includes(folderName.trim())) {
      setError('同じ名前のフォルダが既に存在します');
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      const success = await onCreateFolder(folderName.trim());
      if (success) {
        setFolderName('');
        onClose();
      } else {
        setError('フォルダの作成に失敗しました。もう一度お試しください。');
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
      setError('エラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFolderName('');
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-carebase-blue" />
            新規フォルダの作成
          </DialogTitle>
          <DialogDescription>
            新しいフォルダの名前を入力してください。
          </DialogDescription>
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
              placeholder="新しいフォルダ"
              className="col-span-3"
              autoFocus
              disabled={isSubmitting}
            />
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !folderName.trim()} 
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  作成中...
                </>
              ) : (
                '作成'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};