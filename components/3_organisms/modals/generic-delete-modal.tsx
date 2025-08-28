/**
 * Generic Delete Confirmation Modal
 *
 * Reusable modal for confirming deletion of any data type
 */

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
import { AlertTriangle, Trash2 } from 'lucide-react';
import type React from 'react';

interface GenericDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
  itemName: string;
  itemType: string;
  isDeleting?: boolean;
  error?: string | null;
  customMessage?: string;
}

export const GenericDeleteModal: React.FC<GenericDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType,
  isDeleting = false,
  error,
  customMessage,
}) => {
  const handleConfirm = async () => {
    const success = await onConfirm();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md tablet:max-w-xl tablet:p-8" data-testid="delete-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5 tablet:h-6 tablet:w-6" />
            削除の確認
          </DialogTitle>
          <DialogDescription className="text-gray-600 tablet:text-tablet-base tablet:mt-3">
            この操作は取り消すことができません。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 tablet:py-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600 tablet:h-5 tablet:w-5" />
            <AlertDescription className="text-red-700 tablet:text-tablet-base tablet:leading-relaxed">
              <strong>{itemName}</strong> の{itemType}を削除してもよろしいですか？
              <br />
              削除されたデータは復元できません。
              {customMessage && (
                <>
                  <br />
                  {customMessage}
                </>
              )}
            </AlertDescription>
          </Alert>

          {error && (
            <Alert className="border-red-200 bg-red-50 mt-4">
              <AlertTriangle className="h-4 w-4 text-red-600 tablet:h-5 tablet:w-5" />
              <AlertDescription className="text-red-700 tablet:text-tablet-base">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="tablet:px-6 tablet:py-3"
          >
            キャンセル
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 tablet:px-6 tablet:py-3"
          >
            <Trash2 className="h-4 w-4 mr-2 tablet:h-5 tablet:w-5" />
            {isDeleting ? '削除中...' : '削除'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
