/**
 * Individual Point Form Hook
 *
 * Manages individual point form state and validation for create/edit operations
 */

import type { IndividualPointFormData } from '@/types/individual-point';
import { individualPointFormSchema } from '@/types/individual-point';
import { useCallback, useEffect, useState } from 'react';

interface UseIndividualPointFormOptions {
  onSubmit: (data: IndividualPointFormData, mediaFiles?: File[]) => Promise<boolean>;
  initialData?: Partial<IndividualPointFormData>;
  mode: 'create' | 'edit';
}

interface IndividualPointFormState {
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof IndividualPointFormData, string>>;
  hasUnsavedChanges: boolean;
}

const initialFormData: IndividualPointFormData = {
  title: '',
  content: '',
  category: 'meal',
  priority: 'medium',
  status: 'active',
  tags: [],
  notes: '',
};

export const useIndividualPointForm = ({
  onSubmit,
  initialData = {},
  mode,
}: UseIndividualPointFormOptions) => {
  const [formData, setFormData] = useState<IndividualPointFormData>(() => ({
    ...initialFormData,
    ...initialData,
  }));

  const [formState, setFormState] = useState<IndividualPointFormState>({
    isSubmitting: false,
    error: null,
    fieldErrors: {},
    hasUnsavedChanges: false,
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const updateField = useCallback((field: keyof IndividualPointFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormState((prev) => ({
      ...prev,
      hasUnsavedChanges: true,
      fieldErrors: prev.fieldErrors[field]
        ? { ...prev.fieldErrors, [field]: undefined }
        : prev.fieldErrors,
    }));
  }, []);

  const addTag = useCallback(
    (tag: string) => {
      if (tag.trim() && !formData.tags.includes(tag.trim())) {
        updateField('tags', [...formData.tags, tag.trim()]);
      }
    },
    [formData.tags, updateField]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      updateField(
        'tags',
        formData.tags.filter((tag) => tag !== tagToRemove)
      );
    },
    [formData.tags, updateField]
  );

  const addMediaFile = useCallback((file: File) => {
    setMediaFiles((prev) => [...prev, file]);
    setFormState((prev) => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  const removeMediaFile = useCallback((index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setFormState((prev) => ({ ...prev, hasUnsavedChanges: true }));
  }, []);

  const validateForm = useCallback(() => {
    const result = individualPointFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof IndividualPointFormData, string>> = {};

      for (const error of result.error.errors) {
        if (error.path.length > 0) {
          const field = error.path[0] as keyof IndividualPointFormData;
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
      const success = await onSubmit(formData, mediaFiles);

      if (success) {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          hasUnsavedChanges: false,
        }));
        return true;
      } else {
        setFormState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: '個別ポイントの保存に失敗しました。',
        }));
        return false;
      }
    } catch (error) {
      console.error('Individual point form submission error:', error);
      setFormState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。',
      }));
      return false;
    }
  }, [formData, mediaFiles, validateForm, onSubmit]);

  const reset = useCallback(() => {
    setFormData({
      ...initialFormData,
      ...initialData,
    });
    setMediaFiles([]);
    setFormState({
      isSubmitting: false,
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
    mediaFiles,
    addMediaFile,
    removeMediaFile,

    // Tag management
    addTag,
    removeTag,

    // Form state
    isSubmitting: formState.isSubmitting,
    error: formState.error,
    fieldErrors: formState.fieldErrors,
    hasUnsavedChanges: formState.hasUnsavedChanges,

    // Actions
    handleSubmit,
    reset,
    clearError,
  };
};
