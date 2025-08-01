/**
 * Contact Schedule Form Hook
 *
 * Manages contact schedule form state and validation for create/edit operations
 */

import type { ContactScheduleFormData } from '@/types/contact-schedule';
import { contactScheduleFormSchema } from '@/types/contact-schedule';
import { useCallback, useEffect, useState } from 'react';

interface UseContactScheduleFormOptions {
  onSubmit: (data: ContactScheduleFormData, isDraft?: boolean) => Promise<boolean>;
  initialData?: Partial<ContactScheduleFormData>;
  mode: 'create' | 'edit';
}

interface ContactScheduleFormState {
  isSubmitting: boolean;
  isSavingDraft: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof ContactScheduleFormData, string>>;
  hasUnsavedChanges: boolean;
}

const initialFormData: ContactScheduleFormData = {
  title: '',
  content: '',
  type: 'contact',
  priority: 'medium',
  assignedTo: 'all-staff',
  dueDate: '',
  startTime: '',
  endTime: '',
  relatedResidentId: '',
  tags: '',
  category: 'company-wide',
};

export const useContactScheduleForm = ({
  onSubmit,
  initialData = {},
  mode,
}: UseContactScheduleFormOptions) => {
  // Initialize form data only once with initial data
  const [formData, setFormData] = useState<ContactScheduleFormData>(() => ({
    ...initialFormData,
    ...initialData,
  }));

  const [formState, setFormState] = useState<ContactScheduleFormState>({
    isSubmitting: false,
    isSavingDraft: false,
    error: null,
    fieldErrors: {},
    hasUnsavedChanges: false,
  });

  // Set default date and time on mount - only run once for create mode
  useEffect(() => {
    if (mode === 'create' && !formData.dueDate) {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = now.toTimeString().slice(0, 5);

      setFormData((prev) => ({
        ...prev,
        dueDate: today,
        startTime: currentTime,
      }));
    }
  }, []); // Run only once on mount

  const updateField = useCallback((field: keyof ContactScheduleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormState((prev) => ({
      ...prev,
      hasUnsavedChanges: true,
      fieldErrors: prev.fieldErrors[field]
        ? { ...prev.fieldErrors, [field]: undefined }
        : prev.fieldErrors,
    }));
  }, []);

  const validateForm = useCallback(
    (isDraft = false) => {
      // For drafts, only validate non-empty fields
      if (isDraft) {
        setFormState((prev) => ({
          ...prev,
          fieldErrors: {},
          error: null,
        }));
        return true;
      }

      const result = contactScheduleFormSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Partial<Record<keyof ContactScheduleFormData, string>> = {};

        for (const error of result.error.errors) {
          if (error.path.length > 0) {
            const field = error.path[0] as keyof ContactScheduleFormData;
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
    },
    [formData]
  );

  const handleSubmit = useCallback(
    async (isDraft = false) => {
      if (!validateForm(isDraft)) {
        return false;
      }

      const stateKey = isDraft ? 'isSavingDraft' : 'isSubmitting';
      setFormState((prev) => ({
        ...prev,
        [stateKey]: true,
        error: null,
      }));

      try {
        const success = await onSubmit(formData, isDraft);

        if (success) {
          setFormState((prev) => ({
            ...prev,
            [stateKey]: false,
            hasUnsavedChanges: false,
          }));
          return true;
        } else {
          setFormState((prev) => ({
            ...prev,
            [stateKey]: false,
            error: isDraft ? '下書き保存に失敗しました。' : '連絡・予定の作成に失敗しました。',
          }));
          return false;
        }
      } catch (error) {
        console.error('Contact schedule form submission error:', error);
        setFormState((prev) => ({
          ...prev,
          [stateKey]: false,
          error: 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。',
        }));
        return false;
      }
    },
    [formData, validateForm, onSubmit]
  );

  const saveDraft = useCallback(() => {
    return handleSubmit(true);
  }, [handleSubmit]);

  const submitFinal = useCallback(() => {
    return handleSubmit(false);
  }, [handleSubmit]);

  const reset = useCallback(() => {
    setFormData({
      ...initialFormData,
      ...initialData,
    });
    setFormState({
      isSubmitting: false,
      isSavingDraft: false,
      error: null,
      fieldErrors: {},
      hasUnsavedChanges: false,
    });
  }, [initialData]);

  const clearError = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    // Form data
    formData,
    updateField,

    // Form state
    isSubmitting: formState.isSubmitting,
    isSavingDraft: formState.isSavingDraft,
    error: formState.error,
    fieldErrors: formState.fieldErrors,
    hasUnsavedChanges: formState.hasUnsavedChanges,

    // Actions
    submitFinal,
    saveDraft,
    reset,
    clearError,
  };
};
