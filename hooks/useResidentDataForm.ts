/**
 * Resident Data Form Hooks
 *
 * Custom hooks for managing resident-related form state and validation
 * Now using the generic form hook for consistency
 */

import type {
    FormOptions,
    HomeCareOfficeFormData,
    MedicalHistoryFormData as MedicalHistoryFormDataType,
    MedicalInstitutionFormData,
    MedicationInfoFormData,
    MedicationStatusFormData,
} from '@/types/resident-data';
import {
    homeCareOfficeFormSchema,
    medicalHistoryFormSchema as medicalHistoryFormSchemaImport,
    medicalInstitutionFormSchema,
    medicationInfoFormSchema,
    medicationStatusFormSchema,
} from '@/types/resident-data';
import { useGenericForm } from './useGenericForm';

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
  treatmentStatus: '治療中',
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

const initialMedicationStatusFormData: MedicationStatusFormData = {
  date: '',
  content: '',
  notes: '',
};

// Home Care Office Form Hook
export const useHomeCareOfficeForm = (options: FormOptions<HomeCareOfficeFormData>) => {
  return useGenericForm(initialHomeCareOfficeFormData, {
    schema: homeCareOfficeFormSchema,
    initialData: options.initialData,
    onSubmit: options.onSubmit,
  });
};

// Medical Institution Form Hook
export const useMedicalInstitutionForm = (options: FormOptions<MedicalInstitutionFormData>) => {
  return useGenericForm(initialMedicalInstitutionFormData, {
    schema: medicalInstitutionFormSchema,
    initialData: options.initialData,
    onSubmit: options.onSubmit,
  });
};

// Medical History Form Hook
export const useMedicalHistoryForm = (options: FormOptions<MedicalHistoryFormDataType>) => {
  return useGenericForm(initialMedicalHistoryFormData, {
    schema: medicalHistoryFormSchemaImport,
    initialData: options.initialData,
    onSubmit: options.onSubmit,
  });
};

// Medication Info Form Hook
export const useMedicationInfoForm = (options: FormOptions<MedicationInfoFormData>) => {
  return useGenericForm(initialMedicationInfoFormData, {
    schema: medicationInfoFormSchema,
    initialData: options.initialData,
    onSubmit: options.onSubmit,
  });
};

// Medication Status Form Hook
export const useMedicationStatusForm = (options: FormOptions<MedicationStatusFormData>) => {
  return useGenericForm(initialMedicationStatusFormData, {
    schema: medicationStatusFormSchema,
    initialData: options.initialData,
    onSubmit: options.onSubmit,
  });
};
