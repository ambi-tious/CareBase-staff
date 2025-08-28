/**
 * Individual Point Form Hook
 *
 * React Hook Formベースの個別記録フォーム管理フック
 */

import type { IndividualPointFormData } from '@/validations/individual-point-validation';
import { individualPointFormSchema } from '@/validations/individual-point-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseIndividualPointFormOptions {
  onSubmit: (data: IndividualPointFormData, mediaFiles?: File[]) => Promise<boolean>;
  initialData?: Partial<IndividualPointFormData>;
  mode: 'create' | 'edit';
}

const initialFormData: IndividualPointFormData = {
  category: 'communication',
  title: '',
  content: '',
  priority: 'medium',
  status: 'active',
  tags: [],
};

export const useIndividualPointForm = ({
  onSubmit,
  initialData = {},
  mode,
}: UseIndividualPointFormOptions) => {
  const form = useForm<IndividualPointFormData>({
    resolver: zodResolver(individualPointFormSchema),
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
    error: null as string | null,
    hasUnsavedChanges: false,
  });

  const updateField = useCallback(
    (field: keyof IndividualPointFormData, value: any) => {
      setValue(field as any, value);
      setAdditionalState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: IndividualPointFormData, mediaFiles?: File[]): Promise<void> => {
      try {
        setAdditionalState((prev) => ({ ...prev, error: null }));

        const success = await onSubmit(data, mediaFiles);

        if (success) {
          setAdditionalState((prev) => ({
            ...prev,
            hasUnsavedChanges: false,
          }));
        } else {
          setAdditionalState((prev) => ({
            ...prev,
            error: '個別記録の保存に失敗しました。',
          }));
        }
      } catch (error) {
        console.error('Error submitting individual point form:', error);

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

  const submitForm = useCallback(
    async (mediaFiles?: File[]) => {
      return handleSubmit((data) => handleFormSubmit(data, mediaFiles))();
    },
    [handleSubmit, handleFormSubmit]
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
    fieldErrors: errors as Partial<Record<keyof IndividualPointFormData, { message?: string }>>,
    hasUnsavedChanges: additionalState.hasUnsavedChanges,

    // Actions
    submitForm,
    clearError,
  };
};
