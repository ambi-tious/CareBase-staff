'use client';

import { InputField } from '@/components/1_atoms/auth/InputField';
import { LoginButton } from '@/components/1_atoms/auth/LoginButton';
import { ErrorAlert } from '@/components/2_molecules/auth/ErrorAlert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoginForm } from '@/hooks/useLoginForm';
import type { LoginCredentials, LoginResult } from '@/types/auth';
import type React from 'react';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<LoginResult>;
  isLoading?: boolean;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading = false,
  className = '',
}) => {
  const {
    login_id,
    password,
    error,
    success,
    fieldErrors,
    isFormValid,
    setLoginId,
    setPassword,
    handleSubmit,
    clearError,
  } = useLoginForm({
    onSubmit: onLogin,
    enableRealtimeValidation: true,
  });

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
            value={login_id}
            onChange={(e) => setLoginId(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワードを入力"
            disabled={isLoading}
            isRequired
            error={fieldErrors.password}
            variant={fieldErrors.password ? 'error' : 'default'}
          />

          {error && <ErrorAlert type="error" message={error} dismissible onDismiss={clearError} />}

          {success && <ErrorAlert type="success" message="ログインに成功しました。" />}

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
