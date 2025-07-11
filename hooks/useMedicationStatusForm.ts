/**
 * Medication Status Form Hook
 *
 * Manages medication status form state and validation
 */

import { useState, useCallback } from 'react';
import type { MedicationStatusFormData, MedicationStatusFormState } from '@/types/medication-status';
import { medicationStatusFormSchema } from '@/types/medication-status';

interface UseMedicationStatusFormOptions {
  onSubmit: (data: MedicationStatusFormData) => Promise<boolean>;
  initialData?: Partial<MedicationStatusFormData>;
}

const initialFormData: MedicationStatusFormData = {
  date: new Date().toISOString().split('T')[0], // Default to today
  content: '',
  notes: '',
};

export const useMedicationStatusForm = ({ onSubmit, initialData = {} }: UseMedicationStatusFormOptions) => {
  const [formData, setFormData] = useState<MedicationStatusFormData>({
    ...initialFormData,
    ...initialData,
  });

  const [formState, setFormState] = useState<MedicationStatusFormState>({
    isSubmitting: false,
    error: null,
    fieldErrors: {},
  });

  const updateField = useCallback(
    (field: keyof MedicationStatusFormData, value: string) => {
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
    const result = medicationStatusFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof MedicationStatusFormData, string>> = {};

      for (const error of result.error.errors) {
        if (error.path.length > 0) {
          const field = error.path[0] as keyof MedicationStatusFormData;
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
      console.error('Medication status form submission error:', error);
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