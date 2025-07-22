'use client';

import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { HandoverForm } from '@/components/2_molecules/handover/handover-form';
import type { HandoverFormData } from '@/types/handover';
import type { Handover } from '@/types/handover';

interface HandoverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HandoverFormData, isDraft?: boolean) => Promise<boolean>;
  handover?: Handover;
  mode: 'create' | 'edit';
}

export const HandoverFormModal: React.FC<HandoverFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  handover,
  mode,
}) => {
  const initialData = handover
    ? {
        title: handover.title,
        content: handover.content,
        category: handover.category,
        priority: handover.priority,
        targetStaffIds: handover.targetStaffIds,
        residentId: handover.residentId || '',
        scheduledDate: handover.scheduledDate || '',
        scheduledTime: handover.scheduledTime || '',
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            {mode === 'create' ? '新規申し送り作成' : '申し送り編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {mode === 'create' 
              ? '新しい申し送りを作成してください。必須項目（'
              : '申し送り内容を編集してください。必須項目（'
            }
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <HandoverForm
          onSubmit={onSubmit}
          onCancel={onClose}
          initialData={initialData}
          mode={mode}
        />
      </DialogContent>
    </Dialog>
  );
};