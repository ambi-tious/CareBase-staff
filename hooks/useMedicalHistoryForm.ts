/**
 * Medical History Form Hook
 *
 * React Hook Formベースの医療履歴フォーム管理フック
 */

import type { MedicalHistoryFormData } from '@/validations/resident-data-validation';
import { medicalHistoryFormSchema } from '@/validations/resident-data-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseMedicalHistoryFormOptions {
  onSubmit: (data: MedicalHistoryFormData) => Promise<boolean>;
  initialData?: Partial<MedicalHistoryFormData>;
}

const initialFormData: MedicalHistoryFormData = {
  diseaseName: '',
  onsetDate: '',
  treatmentStatus: false,
  treatmentInstitution: '',
  notes: '',
};

export const useMedicalHistoryForm = ({
  onSubmit,
  initialData = {},
}: UseMedicalHistoryFormOptions) => {
  const form = useForm<MedicalHistoryFormData>({
    resolver: zodResolver(medicalHistoryFormSchema),
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
  });

  const updateField = useCallback(
    (field: keyof MedicalHistoryFormData, value: string) => {
      setValue(field, value);
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: MedicalHistoryFormData): Promise<void> => {
      try {
        setAdditionalState({ error: null });

        const success = await onSubmit(data);

        if (!success) {
          setAdditionalState({ error: '医療履歴の保存に失敗しました。' });
        }
      } catch (error) {
        console.error('Error submitting medical history form:', error);

        const errorMessage =
          error instanceof Error
            ? error.message.includes('Network')
              ? 'ネットワークエラーが発生しました。接続を確認してください。'
              : error.message
            : '予期しないエラーが発生しました。';

        setAdditionalState({ error: errorMessage });
      }
    },
    [onSubmit]
  );

  const retry = useCallback(() => {
    setAdditionalState({ error: null });
    return handleSubmit(handleFormSubmit)();
  }, [handleSubmit, handleFormSubmit]);

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
    fieldErrors: errors as Partial<Record<keyof MedicalHistoryFormData, { message?: string }>>,

    // Actions
    onSubmit: handleSubmit(handleFormSubmit),
    retry,
  };
};
