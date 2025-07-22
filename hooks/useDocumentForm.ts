/**
 * Document Form Hook
 *
 * Manages document form state and validation
 */

import type { DocumentFormData } from '@/components/2_molecules/documents/document-form-fields';
import { useCallback, useState } from 'react';

interface UseDocumentFormOptions {
  onSubmit: (data: DocumentFormData) => Promise<boolean>;
  initialData?: Partial<DocumentFormData>;
}

const initialFormData: DocumentFormData = {
  title: '',
  category: '議事録',
  description: '',
  status: 'draft',
  tags: '',
};

export const useDocumentForm = ({ onSubmit, initialData = {} }: UseDocumentFormOptions) => {
  const [formData, setFormData] = useState<DocumentFormData>({
    ...initialFormData,
    ...initialData,
  });

  const [formState, setFormState] = useState({
    isSubmitting: false,
    error: null as string | null,
    fieldErrors: {} as Partial<Record<keyof DocumentFormData, string>>,
  });

  const updateField = useCallback(
    (field: keyof DocumentFormData, value: string) => {
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
    const errors: Partial<Record<keyof DocumentFormData, string>> = {};

    // Required fields
    if (!formData.title.trim()) {
      errors.title = '書類タイトルは必須です';
    }

    if (!formData.category) {
      errors.category = 'カテゴリは必須です';
    }

    if (!formData.status) {
      errors.status = 'ステータスは必須です';
    }

    // Set errors and return validation result
    setFormState((prev) => ({
      ...prev,
      fieldErrors: errors,
    }));

    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      setFormState((prev) => ({
        ...prev,
        error: '入力内容に不備があります。必須項目を確認してください。',
      }));
      return false;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
    }));

    try {
      const success = await onSubmit(formData);

      if (!success) {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: '保存に失敗しました。もう一度お試しください。',
        }));
      }

      return success;
    } catch (error) {
      console.error('Document form submission error:', error);
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。',
      }));
      return false;
    } finally {
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [formData, validateForm, onSubmit]);

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

  return {
    formData,
    updateField,
    isSubmitting: formState.isSubmitting,
    error: formState.error,
    fieldErrors: formState.fieldErrors,
    handleSubmit,
    reset,
    clearError,
  };
};
