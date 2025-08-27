/**
 * Care Record Form Hook
 *
 * React Hook Formベースのケア記録フォーム管理フック
 */

import type { CareRecordFormData } from '@/validations/care-record-validation';
import { careRecordFormSchema } from '@/validations/care-record-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseCareRecordFormOptions {
  onSubmit: (data: CareRecordFormData, isDraft?: boolean) => Promise<boolean>;
  initialData?: Partial<CareRecordFormData>;
  mode: 'create' | 'edit';
}

const initialFormData: CareRecordFormData = {
  residentId: '',
  category: 'meal',
  title: '',
  content: '',
  recordedAt: new Date().toISOString().slice(0, 16),
  priority: 'medium',
  status: 'draft',
};

export const useCareRecordForm = ({
  onSubmit,
  initialData = {},
  mode,
}: UseCareRecordFormOptions) => {
  const form = useForm<CareRecordFormData>({
    resolver: zodResolver(careRecordFormSchema),
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
  } = form;
  const formData = watch();

  const [additionalState, setAdditionalState] = useState({
    isSavingDraft: false,
    error: null as string | null,
    hasUnsavedChanges: false,
  });

  const updateField = useCallback(
    (field: keyof CareRecordFormData, value: string) => {
      setValue(field, value);
      setAdditionalState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: CareRecordFormData, isDraft = false): Promise<void> => {
      try {
        if (isDraft) {
          setAdditionalState((prev) => ({ ...prev, isSavingDraft: true, error: null }));
        } else {
          setAdditionalState((prev) => ({ ...prev, error: null }));
        }

        const success = await onSubmit(data, isDraft);

        if (success) {
          setAdditionalState((prev) => ({
            ...prev,
            isSavingDraft: false,
            hasUnsavedChanges: false,
          }));
        } else {
          const errorMessage = isDraft
            ? 'ケア記録の下書き保存に失敗しました。'
            : 'ケア記録の保存に失敗しました。';
          setAdditionalState((prev) => ({
            ...prev,
            isSavingDraft: false,
            error: errorMessage,
          }));
        }
      } catch (error) {
        console.error('Error submitting care record form:', error);

        const errorMessage =
          error instanceof Error
            ? error.message.includes('Network')
              ? 'ネットワークエラーが発生しました。接続を確認してください。'
              : error.message
            : '予期しないエラーが発生しました。';

        setAdditionalState((prev) => ({
          ...prev,
          isSavingDraft: false,
          error: errorMessage,
        }));
      }
    },
    [onSubmit]
  );

  const submitFinal = useCallback(async () => {
    return handleSubmit((data) => handleFormSubmit(data, false))();
  }, [handleSubmit, handleFormSubmit]);

  const saveDraft = useCallback(async () => {
    return handleSubmit((data) => handleFormSubmit(data, true))();
  }, [handleSubmit, handleFormSubmit]);

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
    isSavingDraft: additionalState.isSavingDraft,
    error: additionalState.error,
    fieldErrors: errors as Partial<Record<keyof CareRecordFormData, { message?: string }>>,
    hasUnsavedChanges: additionalState.hasUnsavedChanges,

    // Actions
    submitFinal,
    saveDraft,
    clearError,
  };
};
