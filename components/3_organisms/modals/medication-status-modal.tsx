'use client';

import { MedicationStatusForm } from '@/components/2_molecules/forms/medication-status-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { MedicationStatus } from '@/types/medication-status';
import type { MedicationStatusFormData } from '@/validations/medication-status-validation';
import type React from 'react';

interface MedicationStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicationStatusFormData) => Promise<boolean>;
  medicationStatus?: MedicationStatus;
  residentName?: string;
  mode: 'create' | 'edit';
}

export const MedicationStatusModal: React.FC<MedicationStatusModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  medicationStatus,
  residentName,
  mode,
}) => {
  const initialData = medicationStatus
    ? {
        date: medicationStatus.date,
        content: medicationStatus.content,
        notes: medicationStatus.notes || '',
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        data-testid="medication-status-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            {mode === 'create' ? '服薬状況の登録' : '服薬状況の編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName && `${residentName}様の`}服薬状況を
            {mode === 'create' ? '登録' : '編集'}してください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <MedicationStatusForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};
