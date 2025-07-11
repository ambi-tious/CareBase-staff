'use client';

import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MedicationStatusForm } from '@/components/2_molecules/forms/medication-status-form';
import type { MedicationStatusFormData } from '@/types/medication-status';

interface MedicationStatusRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicationStatusFormData) => Promise<boolean>;
  residentName?: string;
}

export const MedicationStatusRegistrationModal: React.FC<
  MedicationStatusRegistrationModalProps
> = ({ isOpen, onClose, onSubmit, residentName }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            服薬状況の登録
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName && `${residentName}様の`}服薬状況を登録してください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <MedicationStatusForm onSubmit={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};
