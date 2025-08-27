/**
 * Handover Form Hook
 *
 * React Hook Formベースの申し送りフォーム管理フック
 */

import type { HandoverFormData } from '@/validations/handover-validation';
import { handoverFormSchema } from '@/validations/handover-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseHandoverFormOptions {
  onSubmit: (data: HandoverFormData, isDraft?: boolean) => Promise<boolean>;
  initialData?: Partial<HandoverFormData>;
  mode: 'create' | 'edit';
}

const initialFormData: HandoverFormData = {
  title: '',
  content: '',
  category: 'communication',
  priority: 'medium',
  targetStaffIds: [],
  residentId: '',
};

export const useHandoverForm = ({ onSubmit, initialData = {}, mode }: UseHandoverFormOptions) => {
  const form = useForm<HandoverFormData>({
    resolver: zodResolver(handoverFormSchema),
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
    (field: keyof HandoverFormData, value: any) => {
      setValue(field as any, value);
      setAdditionalState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: HandoverFormData, isDraft = false): Promise<void> => {
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
            ? '申し送りの下書き保存に失敗しました。'
            : '申し送りの保存に失敗しました。';
          setAdditionalState((prev) => ({
            ...prev,
            isSavingDraft: false,
            error: errorMessage,
          }));
        }
      } catch (error) {
        console.error('Error submitting handover form:', error);

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
    fieldErrors: errors as Partial<Record<keyof HandoverFormData, { message?: string }>>,
    hasUnsavedChanges: additionalState.hasUnsavedChanges,

    // Actions
    submitFinal,
    saveDraft,
    clearError,
  };
};
