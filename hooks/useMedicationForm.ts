/**
 * Medication Form Hook
 *
 * React Hook Formベースの薬剤情報フォーム管理フック
 */

import type { MedicationFormData } from '@/validations/medication-validation';
import { medicationFormSchema } from '@/validations/medication-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

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
  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationFormSchema),
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
    (field: keyof MedicationFormData, value: string) => {
      setValue(field, value);
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: MedicationFormData): Promise<void> => {
      try {
        setAdditionalState({ error: null });

        const success = await onSubmit(data);

        if (!success) {
          setAdditionalState({ error: '薬剤情報の保存に失敗しました。' });
        }
      } catch (error) {
        console.error('Error submitting medication form:', error);

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
    fieldErrors: errors as Partial<Record<keyof MedicationFormData, { message?: string }>>,

    // Actions
    onSubmit: handleSubmit(handleFormSubmit),
    retry,
  };
};
