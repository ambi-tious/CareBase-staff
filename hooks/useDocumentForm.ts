/**
 * Document Form Hook
 *
 * Manages document form state and validation using React Hook Form
 */

import { documentFormSchema, type DocumentFormData } from '@/validations/document-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

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
  folderId: 'root',
};

export const useDocumentForm = ({ onSubmit, initialData = {} }: UseDocumentFormOptions) => {
  const [formState, setFormState] = useState({
    isSubmitting: false,
    isSavingDraft: false,
    hasUnsavedChanges: false,
    error: null as string | null,
  });

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      ...initialFormData,
      ...initialData,
    },
    mode: 'onChange',
  });

  const { handleSubmit, reset, formState: rhfFormState, watch } = form;

  // フォームの変更を監視
  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      hasUnsavedChanges: rhfFormState.isDirty,
    }));
  }, [rhfFormState.isDirty]);

  const submitHandler = useCallback(
    async (data: DocumentFormData, isDraft = false) => {
      const stateKey = isDraft ? 'isSavingDraft' : 'isSubmitting';
      setFormState((prev) => ({
        ...prev,
        [stateKey]: true,
        error: null,
      }));

      try {
        const success = await onSubmit(data, isDraft);

        if (success) {
          // 下書き保存時はフォームデータをリセットしない
          if (!isDraft) {
            reset({ ...initialFormData, ...initialData });
          }
          setFormState((prev) => ({
            isSubmitting: false,
            isSavingDraft: false,
            hasUnsavedChanges: isDraft ? prev.hasUnsavedChanges : false,
            error: null,
          }));
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
          [stateKey]: false,
          error: 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。',
        }));
        return false;
      }
    },
    [onSubmit, initialData, reset]
  );

  const onValidSubmit = useCallback(
    (data: DocumentFormData) => {
      return submitHandler(data, false);
    },
    [submitHandler]
  );

  const saveDraft = useCallback(async () => {
    const data = form.getValues();
    return submitHandler(data, true);
  }, [form, submitHandler]);

  const resetForm = useCallback(() => {
    reset({ ...initialFormData, ...initialData });
    setFormState({
      isSubmitting: false,
      isSavingDraft: false,
      hasUnsavedChanges: false,
      error: null,
    });
  }, [initialData, reset]);

  const clearError = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    form,
    isSubmitting: formState.isSubmitting,
    isSavingDraft: formState.isSavingDraft,
    hasUnsavedChanges: formState.hasUnsavedChanges,
    error: formState.error,
    handleSubmit: handleSubmit(onValidSubmit),
    reset: resetForm,
    clearError,
    saveDraft,
  };
};
