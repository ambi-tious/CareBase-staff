'use client';

import { InputField } from '@/components/1_atoms/auth/InputField';
import { LoginButton } from '@/components/1_atoms/auth/LoginButton';
import { ErrorAlert } from '@/components/2_molecules/auth/ErrorAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LoginCredentials, LoginResult } from '@/types/auth';
import { useState } from 'react';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<LoginResult>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading = false,
  error = null,
  onClearError,
  className = '',
}) => {
  const [formData, setFormData] = useState<LoginCredentials>({
    login_id: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{
    login_id?: string;
    password?: string;
  }>({});

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Clear API error when user starts typing
    if (error && onClearError) {
      onClearError();
    }
  };

  const validateForm = (): boolean => {
    const errors: { login_id?: string; password?: string } = {};

    if (!formData.login_id.trim()) {
      errors.login_id = 'ログインIDを入力してください';
    }

    if (!formData.password.trim()) {
      errors.password = 'パスワードを入力してください';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onLogin(formData);
  };

  const isFormValid = formData.login_id.trim() !== '' && formData.password.trim() !== '';

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-carebase-text-primary">ログイン</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <InputField
            id="login_id"
            type="text"
            label="ログインID"
            value={formData.login_id}
            onChange={(e) => handleInputChange('login_id', e.target.value)}
            placeholder="ログインIDを入力"
            disabled={isLoading}
            isRequired
            error={fieldErrors.login_id}
            variant={fieldErrors.login_id ? 'error' : 'default'}
          />

          <InputField
            id="password"
            type="password"
            label="パスワード"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="パスワードを入力"
            disabled={isLoading}
            isRequired
            error={fieldErrors.password}
            variant={fieldErrors.password ? 'error' : 'default'}
          />

          {error && (
            <ErrorAlert type="error" message={error} dismissible onDismiss={onClearError} />
          )}

          <LoginButton
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
            loadingText="ログイン中..."
            size="lg"
            fullWidth
          >
            ログイン
          </LoginButton>
        </form>
      </CardContent>
    </Card>
  );
};
