'use client';

import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MedicationForm } from '@/components/2_molecules/forms/medication-form';
import type { MedicationFormData } from '@/types/medication';

interface MedicationRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicationFormData) => Promise<boolean>;
  residentName?: string;
}

export const MedicationRegistrationModal: React.FC<MedicationRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  residentName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            お薬情報の登録
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName && `${residentName}様の`}お薬情報を登録してください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <MedicationForm onSubmit={onSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};
