'use client';

import { MedicalHistoryForm } from '@/components/2_molecules/forms/medical-history-form';
import type { MedicalHistory } from '@/mocks/care-board-data';
import type { MedicalHistoryFormData } from '@/types/resident-data';
import type React from 'react';
import { GenericFormModal } from './generic-form-modal';

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
    <GenericFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '既往歴の登録' : '既往歴の編集'}
      description={`既往歴情報を${mode === 'create' ? '登録' : '編集'}してください。`}
      residentName={residentName}
    >
      <MedicalHistoryForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData} />
    </GenericFormModal>
  );
};
