'use client';

import { MedicalHistoryForm } from '@/components/2_molecules/forms/medical-history-form';
import type { MedicalHistory, MedicalInstitution } from '@/mocks/care-board-data';
import type { MedicalHistoryFormData } from '@/validations/resident-data-validation';
import type React from 'react';
import { GenericFormModal } from './generic-form-modal';

interface MedicalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicalHistoryFormData) => Promise<boolean>;
  history?: MedicalHistory;
  residentName?: string;
  medicalInstitutions: MedicalInstitution[];
  mode: 'create' | 'edit';
}

export const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  history,
  residentName,
  medicalInstitutions,
  mode,
}) => {
  const initialData = history
    ? {
        diseaseName: history.diseaseName,
        onsetDate: history.date ? history.date.replace('/', '-') : '', // Convert YYYY/MM to YYYY-MM
        treatmentStatus:
          typeof history.treatmentStatus === 'boolean'
            ? history.treatmentStatus
            : history.treatmentStatus === '治療中',
        treatmentInstitution: history.treatmentInstitution || '',
        notes: history.notes || '',
      }
    : undefined;

  return (
    <GenericFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? '現病歴＆既往歴の登録' : '現病歴＆既往歴の編集'}
      description={`現病歴＆既往歴情報を${mode === 'create' ? '登録' : '編集'}してください。`}
      residentName={residentName}
    >
      <MedicalHistoryForm
        onSubmit={onSubmit}
        onCancel={onClose}
        initialData={initialData}
        medicalInstitutions={medicalInstitutions}
      />
    </GenericFormModal>
  );
};
