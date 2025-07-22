/**
 * Generic Form Hook
 *
 * 重複したフォーム管理ロジックを統合し、Zodスキーマベースのバリデーションを提供
 */

import { validateData, type ValidationResult } from '@/utils/validation-helpers';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

export interface FormState {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
}

export interface UseGenericFormOptions<T> {
  schema: z.ZodSchema<T>;
  initialData?: Partial<T>;
  onSubmit: (data: T) => Promise<boolean>;
  validateOnChange?: boolean;
}

export interface UseGenericFormReturn<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  updateField: (field: keyof T, value: any) => void;
  formState: FormState;
  isValid: boolean;
  handleSubmit: () => Promise<boolean>;
  resetForm: () => void;
  validateForm: () => boolean;
  // Backward compatibility with existing form components
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  reset?: () => void;
  retry?: () => Promise<boolean>;
}

export function useGenericForm<T extends Record<string, any>>(
  initialFormData: T,
  options: UseGenericFormOptions<T>
): UseGenericFormReturn<T> {
  const { schema, initialData, onSubmit, validateOnChange = true } = options;

  const [formData, setFormData] = useState<T>({
    ...initialFormData,
    ...initialData,
  });

  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    error: null,
    fieldErrors: {},
  });

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (formState.fieldErrors[field as string]) {
      setFormState((prev) => {
        const newFieldErrors = { ...prev.fieldErrors };
        delete newFieldErrors[field as string];
        return {
          ...prev,
          fieldErrors: newFieldErrors,
        };
      });
    }
  }, [formState.fieldErrors]);

  const validateForm = useCallback((): boolean => {
    const result: ValidationResult<T> = validateData(schema, formData);

    if (!result.isValid) {
      setFormState((prev) => ({
        ...prev,
        fieldErrors: result.fieldErrors || {},
        error: result.error || '入力内容に不備があります。必須項目を確認してください。',
      }));
      return false;
    }

    setFormState((prev) => ({
      ...prev,
      fieldErrors: {},
      error: null,
    }));
    return true;
  }, [formData, schema]);

  // Real-time validation
  useEffect(() => {
    if (validateOnChange) {
      const result: ValidationResult<T> = validateData(schema, formData);
      setFormState((prev) => ({
        ...prev,
        fieldErrors: result.fieldErrors || {},
        error: prev.isSubmitting ? prev.error : null, // Don't show general error during typing
      }));
    }
  }, [formData, schema, validateOnChange]);

  const handleSubmit = useCallback(async (): Promise<boolean> => {
    if (!validateForm()) {
      return false;
    }

    setFormState((prev) => ({
      ...prev,
      isSubmitting: true,
      error: null,
    }));

    try {
      const success = await onSubmit(formData as T);

      if (success) {
        // Reset form on successful submission
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
      console.error('Form submission error:', error);
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: 'エラーが発生しました。もう一度お試しください。',
      }));
      return false;
    }
  }, [formData, validateForm, onSubmit, initialFormData, initialData]);

  const resetForm = useCallback(() => {
    setFormData({ ...initialFormData, ...initialData });
    setFormState({
      isSubmitting: false,
      error: null,
      fieldErrors: {},
    });
  }, [initialFormData, initialData]);

  // Derive isValid from current field errors
  const isValid = Object.keys(formState.fieldErrors).length === 0;

  return {
    formData,
    setFormData,
    updateField,
    formState,
    isValid,
    handleSubmit,
    resetForm,
    validateForm,
    // Backward compatibility
    isSubmitting: formState.isSubmitting,
    error: formState.error,
    fieldErrors: formState.fieldErrors,
    reset: resetForm,
    retry: handleSubmit,
  };
} 
