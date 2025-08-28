/**
 * Care Plan Form Hook
 *
 * React Hook Formベースのケアプランフォーム管理フック
 */

import type { CarePlanFormData } from '@/validations/care-plan-validation';
import { carePlanFormSchema } from '@/validations/care-plan-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm, type Path } from 'react-hook-form';

interface UseCarePlanFormOptions {
  onSubmit: (data: CarePlanFormData, isDraft?: boolean) => Promise<boolean>;
  initialData?: Partial<CarePlanFormData>;
  mode: 'create' | 'edit';
}

interface CarePlanFormState {
  isSavingDraft: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
}

const initialFormData: CarePlanFormData = {
  planTitle: '',
  planType: 'initial',
  careLevel: '',
  certificationDate: '',
  certValidityStart: '',
  certValidityEnd: '',
  certificationStatus: 'certified',
  careManager: '',
  careManagerOffice: '',
  nextReviewDate: '',
  isReferral: false,
  residentIntention: '',
  familyIntention: '',
  assessmentCommitteeOpinion: '',
  comprehensiveGuidance: '',
  consentObtained: false,
  goals: [''],
  services: [],
  notes: '',
};

export const useCarePlanForm = ({ onSubmit, initialData = {}, mode }: UseCarePlanFormOptions) => {
  const form = useForm<CarePlanFormData>({
    resolver: zodResolver(carePlanFormSchema),
    defaultValues: {
      ...initialFormData,
      ...initialData,
    },
    mode: 'onChange',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid, isDirty },
    setValue,
    getValues,
    watch,
    reset,
    trigger,
    control,
  } = form;

  const [additionalState, setAdditionalState] = useState<CarePlanFormState>({
    isSavingDraft: false,
    error: null,
    hasUnsavedChanges: false,
  });

  // Watch all form data
  const formData = watch();

  // Set default dates on mount - only run once for create mode
  useEffect(() => {
    if (mode === 'create' && !getValues('certificationDate')) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // 認定有効期間は通常1年間
      const nextYear = new Date(today);
      nextYear.setFullYear(nextYear.getFullYear() + 1);
      const nextYearStr = nextYear.toISOString().split('T')[0];

      // 次回見直しは3ヶ月後
      const nextReview = new Date(today);
      nextReview.setMonth(nextReview.getMonth() + 3);
      const nextReviewStr = nextReview.toISOString().split('T')[0];

      setValue('certificationDate', todayStr);
      setValue('certValidityStart', todayStr);
      setValue('certValidityEnd', nextYearStr);
      setValue('nextReviewDate', nextReviewStr);
    }
  }, [mode, setValue, getValues]); // Dependencies updated

  const updateField = useCallback(
    (field: string, value: unknown) => {
      setValue(field as Path<CarePlanFormData>, value as any, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setAdditionalState((prev) => ({
        ...prev,
        hasUnsavedChanges: true,
      }));
    },
    [setValue]
  );

  const validateForm = useCallback(
    async (isDraft = false) => {
      // For drafts, skip validation
      if (isDraft) {
        setAdditionalState((prev) => ({
          ...prev,
          error: null,
        }));
        return true;
      }

      // Trigger React Hook Form validation
      const isValid = await trigger();

      if (!isValid) {
        setAdditionalState((prev) => ({
          ...prev,
          error: '入力内容に不備があります。必須項目を確認してください。',
        }));
        return false;
      }

      setAdditionalState((prev) => ({
        ...prev,
        error: null,
      }));

      return true;
    },
    [trigger]
  );

  const internalHandleSubmit = useCallback(
    async (isDraft = false) => {
      const isFormValid = await validateForm(isDraft);
      if (!isFormValid) {
        return false;
      }

      if (isDraft) {
        setAdditionalState((prev) => ({
          ...prev,
          isSavingDraft: true,
          error: null,
        }));
      }

      try {
        const currentData = getValues();
        const success = await onSubmit(currentData, isDraft);

        if (success) {
          setAdditionalState((prev) => ({
            ...prev,
            isSavingDraft: false,
            hasUnsavedChanges: false,
          }));
          return true;
        } else {
          setAdditionalState((prev) => ({
            ...prev,
            isSavingDraft: false,
            error: isDraft ? '下書き保存に失敗しました。' : 'ケアプランの保存に失敗しました。',
          }));
          return false;
        }
      } catch (error) {
        console.error('Care plan form submission error:', error);
        setAdditionalState((prev) => ({
          ...prev,
          isSavingDraft: false,
          error: 'ネットワークエラーが発生しました。接続を確認してもう一度お試しください。',
        }));
        return false;
      }
    },
    [validateForm, getValues, onSubmit]
  );

  const saveDraft = useCallback(() => {
    return internalHandleSubmit(true);
  }, [internalHandleSubmit]);

  const submitFinal = useCallback(() => {
    return internalHandleSubmit(false);
  }, [internalHandleSubmit]);

  const resetForm = useCallback(() => {
    reset({
      ...initialFormData,
      ...initialData,
    });
    setAdditionalState({
      isSavingDraft: false,
      error: null,
      hasUnsavedChanges: false,
    });
  }, [reset, initialData]);

  const clearError = useCallback(() => {
    setAdditionalState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // React Hook Form submit handler
  const reactHookFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data, false);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  return {
    // React Hook Form methods (spread all to maintain compatibility)
    ...form,
    control,

    // Form data
    formData,
    updateField,

    // Form state (combined)
    isSubmitting,
    isSavingDraft: additionalState.isSavingDraft,
    error: additionalState.error,
    fieldErrors: errors as Partial<Record<keyof CarePlanFormData, { message?: string }>>,
    hasUnsavedChanges: isDirty || additionalState.hasUnsavedChanges,

    // Actions
    submitFinal,
    saveDraft,
    resetForm,
    clearError,
  };
};
