/**
 * Document Form Hook (React Hook Form version)
 *
 * Manages document form state and validation using React Hook Form
 */

import { documentFormSchema, type DocumentFormData } from '@/validations/document-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

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
  const [error, setError] = useState<string | null>(null);

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentFormSchema),
    defaultValues: {
      ...initialFormData,
      ...initialData,
    },
    mode: 'onChange',
  });

  const { control, handleSubmit, reset, formState } = form;
  const { isSubmitting, isValid } = formState;

  const onFormSubmit = handleSubmit(async (data: DocumentFormData) => {
    setError(null);

    try {
      const success = await onSubmit(data);

      if (success) {
        // Reset form on success
        reset({ ...initialFormData, ...initialData });
        return true;
      } else {
        setError('保存に失敗しました。もう一度お試しください。');
        return false;
      }
    } catch (error) {
      console.error('Document form submission error:', error);
      setError('ネットワークエラーが発生しました。接続を確認してもう一度お試しください。');
      return false;
    }
  });

  const resetForm = useCallback(() => {
    reset({ ...initialFormData, ...initialData });
    setError(null);
  }, [reset, initialData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // React Hook Form instances
    form,
    control,
    // Form state
    isSubmitting,
    isValid,
    error,
    // Form actions
    handleSubmit: onFormSubmit,
    reset: resetForm,
    clearError,
  };
};
