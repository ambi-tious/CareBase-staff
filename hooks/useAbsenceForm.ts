/**
 * Absence Form Hook
 *
 * React Hook Formベースの不在情報フォーム管理フック
 */

import type { AbsenceFormData } from '@/validations/absence-validation';
import { absenceFormSchema } from '@/validations/absence-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseAbsenceFormOptions {
  onSubmit: (data: AbsenceFormData) => Promise<boolean>;
  initialData?: Partial<AbsenceFormData>;
  mode: 'create' | 'edit';
}

const initialFormData: AbsenceFormData = {
  startDateTime: '',
  endDateTime: '',
  reason: 'hospital_visit',
  customReason: '',
  notes: '',
};

export const useAbsenceForm = ({ onSubmit, initialData = {}, mode }: UseAbsenceFormOptions) => {
  const form = useForm<AbsenceFormData>({
    resolver: zodResolver(absenceFormSchema),
    defaultValues: {
      ...initialFormData,
      ...initialData,
    },
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
    setValue,
    trigger,
  } = form;
  const formData = watch();

  const [additionalState, setAdditionalState] = useState({
    error: null as string | null,
    hasUnsavedChanges: false,
  });

  // Set default dates on mount for create mode
  useEffect(() => {
    if (mode === 'create' && !formData.startDateTime) {
      const now = new Date();
      const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1時間後
      const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2時間後

      const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setValue('startDateTime', formatDateTime(startTime));
      setValue('endDateTime', formatDateTime(endTime));
    }
  }, [mode, formData.startDateTime, setValue]);

  const updateField = useCallback(
    (field: keyof AbsenceFormData, value: string) => {
      setValue(field, value);
      setAdditionalState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: AbsenceFormData): Promise<void> => {
      try {
        setAdditionalState((prev) => ({ ...prev, error: null }));

        const success = await onSubmit(data);

        if (success) {
          setAdditionalState((prev) => ({
            ...prev,
            hasUnsavedChanges: false,
          }));
        } else {
          setAdditionalState((prev) => ({
            ...prev,
            error: '不在情報の保存に失敗しました。',
          }));
        }
      } catch (error) {
        console.error('Error submitting absence form:', error);

        const errorMessage =
          error instanceof Error
            ? error.message.includes('Network')
              ? 'ネットワークエラーが発生しました。接続を確認してください。'
              : error.message
            : '予期しないエラーが発生しました。';

        setAdditionalState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
      }
    },
    [onSubmit]
  );

  const clearError = useCallback(() => {
    setAdditionalState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // React Hook Form methods (spread all to maintain compatibility)
    ...form,
    control,

    // Form data
    formData,
    updateField,

    // Form state
    isSubmitting,
    error: additionalState.error,
    fieldErrors: errors as Partial<Record<keyof AbsenceFormData, { message?: string }>>,
    hasUnsavedChanges: additionalState.hasUnsavedChanges,

    // Actions
    onSubmit: handleSubmit(handleFormSubmit),
    clearError,
  };
};
