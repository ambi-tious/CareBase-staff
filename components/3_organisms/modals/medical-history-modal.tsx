'use client';

import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MedicalHistoryForm } from '@/components/2_molecules/forms/medical-history-form';
import type { MedicalHistoryFormData } from '@/types/resident-data';
import type { MedicalHistory } from '@/mocks/care-board-data';

interface MedicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicalHistoryFormData) => Promise<boolean>;
  history?: MedicalHistory;
  residentName?: string;
  mode: 'create' | 'edit';
}

export const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  history,
  residentName,
  mode,
}) => {
  const initialData = history
    ? {
        diseaseName: history.diseaseName,
        onsetDate: history.date.replace('/', '-'), // Convert YYYY/MM to YYYY-MM
        treatmentStatus: history.treatmentStatus,
        treatmentInstitution: history.treatmentInstitution || '',
        notes: history.notes || '',
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            {mode === 'create' ? '既往歴の登録' : '既往歴の編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName && `${residentName}様の`}既往歴情報を{mode === 'create' ? '登録' : '編集'}
            してください。 必須項目（<span className="text-red-500">*</span>
            ）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <MedicalHistoryForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};
