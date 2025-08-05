/**
 * Document Form Hook
 *
 * Manages document form state and validation
 */

import { documentFormSchema, type DocumentFormData } from '@/validations/document-validation';
import { useCallback, useState } from 'react';

interface UseDocumentFormOptions {
  onSubmit: (data: DocumentFormData, isDraft?: boolean) => Promise<boolean>;
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
    isSavingDraft: false,
    hasUnsavedChanges: false,
    error: null as string | null,
    fieldErrors: {} as Partial<Record<keyof DocumentFormData, string>>,
  });

  const updateField = useCallback(
    (field: keyof DocumentFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setFormState((prev) => ({
        ...prev,
        hasUnsavedChanges: true,
        fieldErrors: prev.fieldErrors[field]
          ? { ...prev.fieldErrors, [field]: undefined }
          : prev.fieldErrors,
      }));

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

  const validateForm = useCallback(
    (isDraft = false) => {
      // 下書き保存の場合はバリデーションをスキップ
      if (isDraft) {
        setFormState((prev) => ({
          ...prev,
          fieldErrors: {},
          error: null,
        }));
        return true;
      }

      const result = documentFormSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Partial<Record<keyof DocumentFormData, string>> = {};

        for (const error of result.error.errors) {
          if (error.path.length > 0) {
            const field = error.path[0] as keyof DocumentFormData;
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
          // Reset form on success
          setFormData({ ...initialFormData, ...initialData });
          setFormState({
            isSubmitting: false,
            isSavingDraft: false,
            hasUnsavedChanges: false, // 保存成功時は未保存変更フラグをリセット
            error: null,
            fieldErrors: {},
          });
          return true;
        } else {
          setFormState((prev) => ({
            ...prev,
            [stateKey]: false,
            error: isDraft ? '下書き保存に失敗しました。' : '書類の作成に失敗しました。',
          }));
          return false;
        }
      } catch (error) {
        console.error('Document form submission error:', error);
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。',
        }));
        return false;
      }
    },
    [formData, validateForm, onSubmit, initialData]
  );

  const saveDraft = useCallback(() => {
    return handleSubmit(true);
  }, [handleSubmit]);

  const reset = useCallback(() => {
    setFormData({ ...initialFormData, ...initialData });
    setFormState({
      isSubmitting: false,
      isSavingDraft: false,
      hasUnsavedChanges: false,
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
    isSavingDraft: formState.isSavingDraft,
    hasUnsavedChanges: formState.hasUnsavedChanges,
    error: formState.error,
    fieldErrors: formState.fieldErrors,
    handleSubmit,
    reset,
    clearError,
    saveDraft,
  };
};
