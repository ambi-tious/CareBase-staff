'use client';

import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { MedicalInstitutionForm } from '@/components/2_molecules/forms/medical-institution-form';
import type { MedicalInstitutionFormData } from '@/types/resident-data';
import type { MedicalInstitution } from '@/mocks/care-board-data';

interface MedicalInstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicalInstitutionFormData) => Promise<boolean>;
  institution?: MedicalInstitution;
  residentName?: string;
  mode: 'create' | 'edit';
}

export const MedicalInstitutionModal: React.FC<MedicalInstitutionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  institution,
  residentName,
  mode,
}) => {
  const initialData = institution
    ? {
        institutionName: institution.institutionName,
        doctorName: institution.doctorName,
        phone: institution.phone,
        fax: institution.fax || '',
        address: institution.address,
        notes: institution.notes || '',
      }
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            {mode === 'create' ? 'かかりつけ医療機関の登録' : 'かかりつけ医療機関の編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName && `${residentName}様の`}かかりつけ医療機関情報を
            {mode === 'create' ? '登録' : '編集'}してください。 必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <MedicalInstitutionForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData} />
      </DialogContent>
    </Dialog>
  );
};
