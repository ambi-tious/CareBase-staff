/**
 * Generic Form Modal
 *
 * 重複したモーダルパターンを統合する汎用的なモーダルコンポーネント
 */

'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type React from 'react';

interface GenericFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  residentName?: string;
  children: React.ReactNode;
  className?: string;
  testId?: string;
}

export const GenericFormModal: React.FC<GenericFormModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  residentName,
  children,
  className = 'max-w-4xl max-h-[90vh] overflow-y-auto',
  testId,
}) => {
  const fullDescription = description
    ? `${residentName && `${residentName}様の`}${description} 必須項目（${(
        <span className="text-red-500">*</span>
      )}）は必ず入力してください。`
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={className} data-testid={testId}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            {title}
          </DialogTitle>
          {fullDescription && (
            <DialogDescription className="text-gray-600">
              {residentName && `${residentName}様の`}
              {description}
              {' 必須項目（'}
              <span className="text-red-500">*</span>
              {'）は必ず入力してください。'}
            </DialogDescription>
          )}
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};
