/**
 * Login Form Hook
 * 
 * Manages login form state and validation
 */

import { useState, useCallback, useEffect } from 'react';
import type { LoginFormState, LoginCredentials } from '@/types/auth';
import { validateLoginFormRelaxed } from '@/validations/auth-validation';

interface UseLoginFormOptions {
  initialValues?: Partial<LoginCredentials>;
  onSubmit: (credentials: LoginCredentials) => Promise<boolean>;
  enableRealtimeValidation?: boolean;
}

export const useLoginForm = ({
  initialValues = {},
  onSubmit,
  enableRealtimeValidation = true,
}: UseLoginFormOptions) => {
  const [formState, setFormState] = useState<LoginFormState>({
    facilityId: initialValues.facilityId || '',
    password: initialValues.password || '',
    isLoading: false,
    error: null,
    success: false,
  });

  const [fieldErrors, setFieldErrors] = useState<{
    facilityId?: string;
    password?: string;
  }>({});

  const [touched, setTouched] = useState<{
    facilityId: boolean;
    password: boolean;
  }>({
    facilityId: false,
    password: false,
  });

  // Real-time validation
  useEffect(() => {
    if (!enableRealtimeValidation) return;

    const validateField = (field: keyof LoginCredentials, value: string, isTouched: boolean) => {
      if (!isTouched) return;

      let error: string | null = null;

      switch (field) {
        case 'facilityId':
          if (!value.trim()) {
            error = '施設IDは必須です';
          }
          break;
        case 'password':
          if (!value.trim()) {
            error = 'パスワードは必須です';
          }
          break;
      }

      setFieldErrors(prev => ({
        ...prev,
        [field]: error,
      }));
    };

    validateField('facilityId', formState.facilityId, touched.facilityId);
    validateField('password', formState.password, touched.password);
  }, [formState.facilityId, formState.password, touched, enableRealtimeValidation]);

  const updateField = useCallback((field: keyof LoginCredentials, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
      error: null,
      success: false,
    }));

    if (!touched[field]) {
      setTouched(prev => ({
        ...prev,
        [field]: true,
      }));
    }
  }, [touched]);

  const setFacilityId = useCallback((value: string) => {
    updateField('facilityId', value);
  }, [updateField]);

  const setPassword = useCallback((value: string) => {
    updateField('password', value);
  }, [updateField]);

  const validateForm = useCallback(() => {
    const credentials = {
      facilityId: formState.facilityId,
      password: formState.password,
    };

    const validation = validateLoginFormRelaxed(credentials);
    
    if (!validation.success) {
      const newFieldErrors: Record<string, string> = {};
      for (const error of validation.error.errors) {
        if (error.path.length > 0) {
          newFieldErrors[error.path[0]] = error.message;
        }
      }
      setFieldErrors(newFieldErrors);
      setFormState(prev => ({
        ...prev,
        error: validation.error.errors[0]?.message || 'バリデーションエラーが発生しました',
      }));
      return false;
    }

    setFieldErrors({});
    setFormState(prev => ({
      ...prev,
      error: null,
    }));
    return true;
  }, [formState.facilityId, formState.password]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      facilityId: true,
      password: true,
    });

    if (!validateForm()) {
      return;
    }

    setFormState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      success: false,
    }));

    try {
      const credentials = {
        facilityId: formState.facilityId.trim(),
        password: formState.password.trim(),
      };

      const success = await onSubmit(credentials);

      setFormState(prev => ({
        ...prev,
        isLoading: false,
        success,
        error: success ? null : prev.error,
      }));
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: 'ログイン中にエラーが発生しました。もう一度お試しください。',
        success: false,
      }));
    }
  }, [validateForm, onSubmit, formState.facilityId, formState.password]);

  const reset = useCallback(() => {
    setFormState({
      facilityId: initialValues.facilityId || '',
      password: initialValues.password || '',
      isLoading: false,
      error: null,
      success: false,
    });
    setFieldErrors({});
    setTouched({
      facilityId: false,
      password: false,
    });
  }, [initialValues]);

  const clearError = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  const isFormValid = !fieldErrors.facilityId && 
                     !fieldErrors.password && 
                     formState.facilityId.trim() !== '' && 
                     formState.password.trim() !== '';

  return {
    // Form state
    facilityId: formState.facilityId,
    password: formState.password,
    isLoading: formState.isLoading,
    error: formState.error,
    success: formState.success,
    
    // Field errors
    fieldErrors,
    
    // Form validation
    isFormValid,
    
    // Actions
    setFacilityId,
    setPassword,
    handleSubmit,
    reset,
    clearError,
    
    // Touched state
    touched,
  };
};