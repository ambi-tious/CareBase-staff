'use client';

import { IndividualPointForm } from '@/components/2_molecules/individual-points/individual-point-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { IndividualPoint, IndividualPointFormData } from '@/types/individual-point';
import type React from 'react';

interface IndividualPointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IndividualPointFormData, mediaFiles?: File[]) => Promise<boolean>;
  point?: IndividualPoint;
  residentName?: string;
  mode: 'create' | 'edit';
}

export const IndividualPointModal: React.FC<IndividualPointModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  point,
  residentName,
  mode,
}) => {
  const initialData = point
    ? {
        title: point.title,
        content: point.content,
        category: point.category,
        priority: point.priority,
        status: point.status,
        tags: point.tags,
        notes: point.notes || '',
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto tablet:max-w-[95vw] tablet:max-h-[95vh]"
        data-testid="individual-point-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary tablet:text-tablet-xl">
            {mode === 'create' ? '個別ポイントの作成' : '個別ポイントの編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 tablet:text-tablet-base tablet:mt-3">
            {residentName && `${residentName}様の`}個別ポイントを
            {mode === 'create' ? '作成' : '編集'}してください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <div className="tablet:mt-6">
          <IndividualPointForm
            onSubmit={onSubmit}
            onCancel={onClose}
            initialData={initialData}
            mode={mode}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
