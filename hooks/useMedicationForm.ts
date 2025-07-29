/**
 * Medication Form Hook
 *
 * Manages medication form state and validation
 */

import type { MedicationFormState } from '@/types/medication';
import type { MedicationFormData } from '@/validations/medication-validation';
import { medicationFormSchema } from '@/validations/medication-validation';
import { useCallback, useState } from 'react';

interface UseMedicationFormOptions {
  onSubmit: (data: MedicationFormData) => Promise<boolean>;
  initialData?: Partial<MedicationFormData>;
}

const initialFormData: MedicationFormData = {
  medicationName: '',
  dosageInstructions: '',
  startDate: '',
  endDate: '',
  prescribingInstitution: '',
  notes: '',
};

export const useMedicationForm = ({ onSubmit, initialData = {} }: UseMedicationFormOptions) => {
  const [formData, setFormData] = useState<MedicationFormData>({
    ...initialFormData,
    ...initialData,
  });

  const [formState, setFormState] = useState<MedicationFormState>({
    isSubmitting: false,
    error: null,
    fieldErrors: {},
  });

  const updateField = useCallback(
    (field: keyof MedicationFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (formState.fieldErrors[field]) {
        setFormState((prev) => ({
          ...prev,
          fieldErrors: { ...prev.fieldErrors, [field]: undefined },
        }));
      }
    },
    [formState.fieldErrors]
  );

  const validateForm = useCallback(() => {
    const result = medicationFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof MedicationFormData, string>> = {};

      for (const error of result.error.errors) {
        if (error.path.length > 0) {
          const field = error.path[0] as keyof MedicationFormData;
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
  }, [formData]);

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
      const success = await onSubmit(formData);

      if (success) {
        // Reset form on success
        setFormData({ ...initialFormData, ...initialData });
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
      console.error('Medication form submission error:', error);
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。',
      }));
      return false;
    }
  }, [formData, validateForm, onSubmit, initialData]);

  const reset = useCallback(() => {
    setFormData({ ...initialFormData, ...initialData });
    setFormState({
      isSubmitting: false,
      error: null,
      fieldErrors: {},
    });
  }, [initialData]);

  const clearError = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const retry = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      error: null,
    }));
    return handleSubmit();
  }, [handleSubmit]);

  return {
    // Form data
    formData,
    updateField,

    // Form state
    isSubmitting: formState.isSubmitting,
    error: formState.error,
    fieldErrors: formState.fieldErrors,

    // Actions
    handleSubmit,
    reset,
    clearError,
    retry,
  };
};
