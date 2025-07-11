/**
 * Contact Form Hook
 *
 * Manages contact form state and validation
 */

import { useState, useCallback } from 'react';
import type { ContactFormData, ContactFormState } from '@/types/contact';
import { contactFormSchema } from '@/types/contact';

interface UseContactFormOptions {
  onSubmit: (data: ContactFormData) => Promise<boolean>;
  initialData?: Partial<ContactFormData>;
}

const initialFormData: ContactFormData = {
  name: '',
  furigana: '',
  relationship: '',
  phone1: '',
  phone2: '',
  email: '',
  address: '',
  notes: '',
  type: '連絡先',
};

export const useContactForm = ({ onSubmit, initialData = {} }: UseContactFormOptions) => {
  const [formData, setFormData] = useState<ContactFormData>({
    ...initialFormData,
    ...initialData,
  });

  const [formState, setFormState] = useState<ContactFormState>({
    isSubmitting: false,
    error: null,
    fieldErrors: {},
  });

  const updateField = useCallback(
    (field: keyof ContactFormData, value: string) => {
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
    const result = contactFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};

      for (const error of result.error.errors) {
        if (error.path.length > 0) {
          const field = error.path[0] as keyof ContactFormData;
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
      console.error('Contact form submission error:', error);
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
