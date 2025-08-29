/**
 * Communication Form Hook
 *
 * React Hook Formベースのコミュニケーション記録フォーム管理フック
 */

import type { CommunicationFormData } from '@/validations/communication-validation';
import { communicationFormSchema } from '@/validations/communication-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface UseCommunicationFormOptions {
  onSubmit: (data: CommunicationFormData) => Promise<boolean>;
  initialData?: Partial<CommunicationFormData>;
  mode: 'create' | 'edit' | 'reply';
}

const initialFormData: CommunicationFormData = {
  datetime: '',
  staffId: '',
  contactPersonId: '',
  contactPersonName: '',
  contactPersonType: 'family',
  communicationContent: '',
  responseContent: '',
  isImportant: false,
  threadId: '',
  parentId: '',
};

export const useCommunicationForm = ({
  onSubmit,
  initialData = {},
  mode,
}: UseCommunicationFormOptions) => {
  const form = useForm<CommunicationFormData>({
    resolver: zodResolver(communicationFormSchema),
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

  // Set default datetime on mount for create mode
  useEffect(() => {
    if (mode === 'create' && !formData.datetime) {
      const now = new Date();
      const formatDateTime = (date: Date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
      };

      setValue('datetime', formatDateTime(now));
    }
  }, [mode, formData.datetime, setValue]);

  // Set current staff as default
  useEffect(() => {
    if (mode === 'create' && !formData.staffId) {
      try {
        const staffDataStr = localStorage.getItem('carebase_selected_staff_data');
        if (staffDataStr) {
          const staffData = JSON.parse(staffDataStr);
          setValue('staffId', staffData.staff.id);
        }
      } catch (error) {
        console.error('Failed to load staff data:', error);
      }
    }
  }, [mode, formData.staffId, setValue]);

  const updateField = useCallback(
    (field: keyof CommunicationFormData, value: string | boolean) => {
      setValue(field, value as any);
      setAdditionalState((prev) => ({ ...prev, hasUnsavedChanges: true }));
    },
    [setValue]
  );

  const handleFormSubmit = useCallback(
    async (data: CommunicationFormData): Promise<void> => {
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
            error: 'コミュニケーション記録の保存に失敗しました。',
          }));
        }
      } catch (error) {
        console.error('Error submitting communication form:', error);

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
    fieldErrors: errors as Partial<Record<keyof CommunicationFormData, { message?: string }>>,
    hasUnsavedChanges: additionalState.hasUnsavedChanges,

    // Actions
    onSubmit: handleSubmit(handleFormSubmit),
    clearError,
  };
};
