/**
 * Login Form Hook
 *
 * Manages login form state and validation
 */

import type { LoginCredentials, LoginFormState, LoginResult } from '@/types/auth';
import {
  validateLoginForm,
  validateLoginId,
  validatePassword,
} from '@/validations/auth-validation';
import { useCallback, useEffect, useState } from 'react';

interface UseLoginFormOptions {
  initialValues?: Partial<LoginCredentials>;
  onSubmit: (credentials: LoginCredentials) => Promise<LoginResult>;
  enableRealtimeValidation?: boolean;
}

export const useLoginForm = ({
  initialValues = {},
  onSubmit,
  enableRealtimeValidation = true,
}: UseLoginFormOptions) => {
  const [formState, setFormState] = useState<LoginFormState>({
    login_id: initialValues.login_id || '',
    password: initialValues.password || '',
    isLoading: false,
    error: null,
    success: false,
  });

  const [fieldErrors, setFieldErrors] = useState<{
    login_id?: string;
    password?: string;
  }>({});

  const [touched, setTouched] = useState<{
    login_id: boolean;
    password: boolean;
  }>({
    login_id: false,
    password: false,
  });

  // Real-time validation
  useEffect(() => {
    if (!enableRealtimeValidation) return;

    const validateField = (field: keyof LoginCredentials, value: string, isTouched: boolean) => {
      if (!isTouched) return;

      let validationResult: { success: boolean; error: string | null };

      switch (field) {
        case 'login_id':
          validationResult = validateLoginId(value);
          break;
        case 'password':
          validationResult = validatePassword(value);
          break;
        default:
          return;
      }

      setFieldErrors((prev) => ({
        ...prev,
        [field]: validationResult.error,
      }));
    };

    validateField('login_id', formState.login_id, touched.login_id);
    validateField('password', formState.password, touched.password);
  }, [formState.login_id, formState.password, touched, enableRealtimeValidation]);

  const updateField = useCallback(
    (field: keyof LoginCredentials, value: string) => {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
        error: null,
        success: false,
      }));

      if (!touched[field]) {
        setTouched((prev) => ({
          ...prev,
          [field]: true,
        }));
      }
    },
    [touched]
  );

  const setLoginId = useCallback(
    (value: string) => {
      updateField('login_id', value);
    },
    [updateField]
  );

  const setPassword = useCallback(
    (value: string) => {
      updateField('password', value);
    },
    [updateField]
  );

  const validateForm = useCallback(() => {
    const credentials = {
      login_id: formState.login_id,
      password: formState.password,
    };

    const validation = validateLoginForm(credentials);

    if (!validation.success) {
      const newFieldErrors: Record<string, string> = {};
      for (const error of validation.error.errors) {
        if (error.path.length > 0) {
          newFieldErrors[error.path[0]] = error.message;
        }
      }
      setFieldErrors(newFieldErrors);
      setFormState((prev) => ({
        ...prev,
        error: validation.error.errors[0]?.message || '入力内容に誤りがあります',
      }));
      return false;
    }

    setFieldErrors({});
    setFormState((prev) => ({
      ...prev,
      error: null,
    }));
    return true;
  }, [formState.login_id, formState.password]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Mark all fields as touched
      setTouched({
        login_id: true,
        password: true,
      });

      if (!validateForm()) {
        return;
      }

      setFormState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        success: false,
      }));

      try {
        const credentials = {
          login_id: formState.login_id.trim(),
          password: formState.password.trim(),
        };

        const result = await onSubmit(credentials);

        setFormState((prev) => ({
          ...prev,
          isLoading: false,
          success: result.success,
          error: result.success ? null : result.error || 'ログインに失敗しました。',
        }));
      } catch (error) {
        setFormState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'ログイン中にエラーが発生しました。もう一度お試しください。',
          success: false,
        }));
      }
    },
    [validateForm, onSubmit, formState.login_id, formState.password]
  );

  const reset = useCallback(() => {
    setFormState({
      login_id: initialValues.login_id || '',
      password: initialValues.password || '',
      isLoading: false,
      error: null,
      success: false,
    });
    setFieldErrors({});
    setTouched({
      login_id: false,
      password: false,
    });
  }, [initialValues]);

  const clearError = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  const isFormValid =
    !fieldErrors.login_id &&
    !fieldErrors.password &&
    formState.login_id.trim() !== '' &&
    formState.password.trim() !== '';

  return {
    // Form state
    login_id: formState.login_id,
    password: formState.password,
    isLoading: formState.isLoading,
    error: formState.error,
    success: formState.success,

    // Field errors
    fieldErrors,

    // Form validation
    isFormValid,

    // Actions
    setLoginId,
    setPassword,
    handleSubmit,
    reset,
    clearError,

    // Touched state
    touched,
  };
};
