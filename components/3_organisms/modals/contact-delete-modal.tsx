/**
 * Contact Delete Confirmation Modal
 *
 * Modal for confirming contact deletion with appropriate warnings
 */

'use client';

import type React from 'react';
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
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ContactDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  contactName: string;
  isDeleting?: boolean;
  error?: string | null;
}

export const ContactDeleteModal: React.FC<ContactDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  contactName,
  isDeleting = false,
  error,
}) => {
  const handleConfirm = async () => {
    const success = await onConfirm();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            削除の確認
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            この操作は取り消すことができません。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>{contactName}</strong> の連絡先情報を削除してもよろしいですか？
              <br />
              削除されたデータは復元できません。
            </AlertDescription>
          </Alert>

          {error && (
            <Alert className="border-red-200 bg-red-50 mt-4">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? '削除中...' : '削除する'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
