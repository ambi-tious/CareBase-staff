/**
 * Contact Schedule Form Hook
 *
 * React Hook Formベースの連絡スケジュールフォーム管理フック
 */

import type { ContactScheduleFormData } from '@/validations/contact-schedule-validation';
import { contactScheduleFormSchema } from '@/validations/contact-schedule-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseContactScheduleFormOptions {
  onSubmit: (data: ContactScheduleFormData, isDraft?: boolean) => Promise<boolean>;
  initialData?: Partial<ContactScheduleFormData>;
  mode: 'create' | 'edit';
}

const initialFormData: ContactScheduleFormData = {
  type: 'contact',
  title: '',
  content: '',
  dueDate: '',
  startTime: '',
  endTime: '',
  priority: 'medium',
  assignedTo: '',
  relatedResidentId: '',
  tags: '',
  category: 'company-wide',
};

export const useContactScheduleForm = ({
  onSubmit,
  initialData = {},
  mode,
}: UseContactScheduleFormOptions) => {
  const form = useForm<ContactScheduleFormData>({
    resolver: zodResolver(contactScheduleFormSchema),
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
    (field: keyof ContactScheduleFormData, value: string) => {
      setValue(field, value);
      setAdditionalState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: ContactScheduleFormData, isDraft = false): Promise<void> => {
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
            ? '連絡スケジュールの下書き保存に失敗しました。'
            : '連絡スケジュールの保存に失敗しました。';
          setAdditionalState((prev) => ({
            ...prev,
            isSavingDraft: false,
            error: errorMessage,
          }));
        }
      } catch (error) {
        console.error('Error submitting contact schedule form:', error);

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
    fieldErrors: errors as Partial<Record<keyof ContactScheduleFormData, { message?: string }>>,
    hasUnsavedChanges: additionalState.hasUnsavedChanges,

    // Actions
    submitFinal,
    saveDraft,
    clearError,
  };
};
