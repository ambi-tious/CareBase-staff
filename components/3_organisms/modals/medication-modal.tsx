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
import type { MedicationFormData, Medication } from '@/types/medication';

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicationFormData) => Promise<boolean>;
  medication?: Medication;
  residentName?: string;
  mode: 'create' | 'edit';
}

export const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  medication,
  residentName,
  mode,
}) => {
  const initialData = medication
    ? {
        medicationName: medication.medicationName,
        dosageInstructions: medication.dosageInstructions,
        startDate: medication.startDate,
        endDate: medication.endDate || '',
        prescribingInstitution: medication.prescribingInstitution,
        notes: medication.notes || '',
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            {mode === 'create' ? 'お薬情報の登録' : 'お薬情報の編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName && `${residentName}様の`}お薬情報を
            {mode === 'create' ? '登録' : '編集'}してください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <MedicationForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};