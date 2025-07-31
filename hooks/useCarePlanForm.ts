/**
 * Care Plan Form Hook
 *
 * Manages care plan form state and validation for create/edit operations
 */

import type { CarePlanFormData } from '@/validations/care-plan-validation';
import { carePlanFormSchema } from '@/validations/care-plan-validation';
import { useCallback, useEffect, useState } from 'react';

interface UseCarePlanFormOptions {
  onSubmit: (data: CarePlanFormData, isDraft?: boolean) => Promise<boolean>;
  initialData?: Partial<CarePlanFormData>;
  mode: 'create' | 'edit';
}

interface CarePlanFormState {
  isSubmitting: boolean;
  isSavingDraft: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof CarePlanFormData, string>>;
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
  referralInfo: '',
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
  // Initialize form data only once with initial data
  const [formData, setFormData] = useState<CarePlanFormData>(() => ({
    ...initialFormData,
    ...initialData,
  }));

  const [formState, setFormState] = useState<CarePlanFormState>({
    isSubmitting: false,
    isSavingDraft: false,
    error: null,
    fieldErrors: {},
    hasUnsavedChanges: false,
  });

  // Set default dates on mount - only run once for create mode
  useEffect(() => {
    if (mode === 'create' && !formData.certificationDate) {
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

      setFormData((prev) => ({
        ...prev,
        certificationDate: todayStr,
        certValidityStart: todayStr,
        certValidityEnd: nextYearStr,
        nextReviewDate: nextReviewStr,
      }));
    }
  }, []); // Run only once on mount

  const updateField = useCallback((field: keyof CarePlanFormData, value: any) => {
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

      const result = carePlanFormSchema.safeParse(formData);

      if (!result.success) {
        const fieldErrors: Partial<Record<keyof CarePlanFormData, string>> = {};

        for (const error of result.error.errors) {
          if (error.path.length > 0) {
            const field = error.path[0] as keyof CarePlanFormData;
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
            error: isDraft ? '下書き保存に失敗しました。' : 'ケアプランの保存に失敗しました。',
          }));
          return false;
        }
      } catch (error) {
        console.error('Care plan form submission error:', error);
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
