/**
 * Resident Data Form Hooks
 *
 * Custom hooks for managing resident-related form state and validation
 */

import type {
  FormOptions,
  FormState,
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
import { useCallback, useState } from 'react';

// Generic form hook
function useGenericForm<T>(schema: any, initialFormData: T, options: FormOptions<T>) {
  const [formData, setFormData] = useState<T>({
    ...initialFormData,
    ...options.initialData,
  });

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    fieldErrors: {},
  });

  const updateField = useCallback(
    (field: keyof T, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      if (formState.fieldErrors[field as string]) {
        setFormState((prev) => ({
          ...prev,
          fieldErrors: { ...prev.fieldErrors, [field as string]: undefined },
        }));
      }
    },
    [formState.fieldErrors]
  );

  const validateForm = useCallback(() => {
    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const error of result.error.errors) {
        if (error.path.length > 0) {
          const field = error.path[0] as string;
          fieldErrors[field] = error.message;
        }
      }

      setFormState((prev) => ({
        ...prev,
        fieldErrors,
        error: '入力内容に不備があります。必須項目を確認してください。',
      }));

      return false;
    }

    setFormState((prev) => ({
      ...prev,
      fieldErrors: {},
      error: null,
    }));

    return true;
  }, [formData, schema]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return false;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
    }));

    try {
      const success = await options.onSubmit(formData);

      if (success) {
        setFormData({ ...initialFormData, ...options.initialData });
        setFormState({
          isSubmitting: false,
          error: null,
          fieldErrors: {},
        });
        return true;
      } else {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: '登録に失敗しました。もう一度お試しください。',
        }));
        return false;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。',
      }));
      return false;
    }
  }, [formData, validateForm, options, initialFormData]);

  const reset = useCallback(() => {
    setFormData({ ...initialFormData, ...options.initialData });
    setFormState({
      isSubmitting: false,
      error: null,
      fieldErrors: {},
    });
  }, [initialFormData, options.initialData]);

  const clearError = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    formData,
    updateField,
    isSubmitting: formState.isSubmitting,
    error: formState.error,
    fieldErrors: formState.fieldErrors,
    handleSubmit,
    reset,
    clearError,
  };
}

// Home Care Office Form Hook
export const useHomeCareOfficeForm = (options: FormOptions<HomeCareOfficeFormData>) => {
  const initialFormData: HomeCareOfficeFormData = {
    businessName: '',
    careManager: '',
    phone: '',
    fax: '',
    address: '',
    notes: '',
  };

  return useGenericForm(homeCareOfficeFormSchema, initialFormData, options);
};

// Medical Institution Form Hook
export const useMedicalInstitutionForm = (options: FormOptions<MedicalInstitutionFormData>) => {
  const initialFormData: MedicalInstitutionFormData = {
    institutionName: '',
    doctorName: '',
    phone: '',
    fax: '',
    address: '',
    notes: '',
  };

  return useGenericForm(medicalInstitutionFormSchema, initialFormData, options);
};

// Medical History Form Hook
export const useMedicalHistoryForm = (options: FormOptions<MedicalHistoryFormDataType>) => {
  const initialFormData: MedicalHistoryFormDataType = {
    diseaseName: '',
    onsetDate: '',
    treatmentStatus: '治療中',
    treatmentInstitution: '',
    notes: '',
  };

  return useGenericForm(medicalHistoryFormSchemaImport, initialFormData, options);
};

// Medication Info Form Hook
export const useMedicationInfoForm = (options: FormOptions<MedicationInfoFormData>) => {
  const initialFormData: MedicationInfoFormData = {
    medicationName: '',
    dosageInstructions: '',
    startDate: '',
    prescribingInstitution: '',
    institution: '',
    prescriptionDate: '',
    notes: '',
    imageUrl: '',
  };

  return useGenericForm(medicationInfoFormSchema, initialFormData, options);
};

// Medication Status Form Hook
export const useMedicationStatusForm = (options: FormOptions<MedicationStatusFormData>) => {
  const initialFormData: MedicationStatusFormData = {
    date: '',
    content: '',
    notes: '',
  };

  return useGenericForm(medicationStatusFormSchema, initialFormData, options);
};
