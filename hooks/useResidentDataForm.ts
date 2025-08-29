/**
 * Resident Data Form Hooks
 *
 * React Hook Formベースの入居者データフォーム管理フック群
 */

import type { FormOptions } from '@/types/resident-data';
import type {
  HomeCareOfficeFormData,
  MedicalHistoryFormData as MedicalHistoryFormDataType,
  MedicalInstitutionFormData,
  MedicationInfoFormData,
} from '@/validations/resident-data-validation';
import {
  homeCareOfficeFormSchema,
  medicalHistoryFormSchema as medicalHistoryFormSchemaImport,
  medicalInstitutionFormSchema,
  medicationInfoFormSchema,
} from '@/validations/resident-data-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

// Initial form data for each form type
const initialHomeCareOfficeFormData: HomeCareOfficeFormData = {
  businessName: '',
  careManager: '',
  phone: '',
  fax: '',
  address: '',
  notes: '',
};

const initialMedicalInstitutionFormData: MedicalInstitutionFormData = {
  institutionName: '',
  doctorName: '',
  phone: '',
  fax: '',
  address: '',
  notes: '',
};

const initialMedicalHistoryFormData: MedicalHistoryFormDataType = {
  diseaseName: '',
  onsetDate: '',
  treatmentStatus: false,
  treatmentInstitution: '',
  notes: '',
};

const initialMedicationInfoFormData: MedicationInfoFormData = {
  medicationName: '',
  dosageInstructions: '',
  startDate: '',
  prescribingInstitution: '',
  institution: '',
  prescriptionDate: '',
  notes: '',
  imageUrl: '',
};

// Home Care Office Form Hook
export const useHomeCareOfficeForm = (options: FormOptions<HomeCareOfficeFormData>) => {
  return useForm<HomeCareOfficeFormData>({
    resolver: zodResolver(homeCareOfficeFormSchema),
    defaultValues: {
      ...initialHomeCareOfficeFormData,
      ...options.initialData,
    },
    mode: 'onChange',
  });
};

// Medical Institution Form Hook
export const useMedicalInstitutionForm = (options: FormOptions<MedicalInstitutionFormData>) => {
  return useForm<MedicalInstitutionFormData>({
    resolver: zodResolver(medicalInstitutionFormSchema),
    defaultValues: {
      ...initialMedicalInstitutionFormData,
      ...options.initialData,
    },
    mode: 'onChange',
  });
};

// Medical History Form Hook
export const useMedicalHistoryForm = (options: FormOptions<MedicalHistoryFormDataType>) => {
  return useForm<MedicalHistoryFormDataType>({
    resolver: zodResolver(medicalHistoryFormSchemaImport),
    defaultValues: {
      ...initialMedicalHistoryFormData,
      ...options.initialData,
    },
    mode: 'onChange',
  });
};

// Medication Info Form Hook
export const useMedicationInfoForm = (options: FormOptions<MedicationInfoFormData>) => {
  return useForm<MedicationInfoFormData>({
    resolver: zodResolver(medicationInfoFormSchema),
    defaultValues: {
      ...initialMedicationInfoFormData,
      ...options.initialData,
    },
    mode: 'onChange',
  });
};
