'use client';

import { MedicationForm } from '@/components/2_molecules/forms/medication-form';
import type { MedicalInstitution } from '@/mocks/residents-data';
import type { Medication } from '@/types/medication';
import type { MedicationFormData } from '@/validations/medication-validation';
import type React from 'react';
import { GenericFormModal } from './generic-form-modal';

interface MedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicationFormData) => Promise<boolean>;
  medication?: Medication;
  residentName?: string;
  mode: 'create' | 'edit';
  initialData?: Partial<MedicationFormData>;
  medicalInstitutions: MedicalInstitution[];
}

export const MedicationModal: React.FC<MedicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  medication,
  residentName,
  mode,
  initialData: propInitialData,
  medicalInstitutions,
}) => {
  const initialData =
    propInitialData ||
    (medication
      ? {
          medicationName: medication.medicationName,
          dosageInstructions: medication.dosageInstructions,
          startDate: medication.startDate,
          endDate: medication.endDate || '',
          prescribingInstitution: medication.prescribingInstitution,
          notes: medication.notes || '',
          thumbnailUrl: medication.thumbnailUrl || '',
        }
      : undefined);

  return (
    <GenericFormModal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'お薬情報の登録' : 'お薬情報の編集'}
      description={`お薬情報を${mode === 'create' ? '登録' : '編集'}してください。`}
      residentName={residentName}
      testId="medication-modal"
    >
      <MedicationForm
        onSubmit={onSubmit}
        onCancel={onClose}
        initialData={initialData}
        medicalInstitutions={medicalInstitutions}
      />
    </GenericFormModal>
  );
};
