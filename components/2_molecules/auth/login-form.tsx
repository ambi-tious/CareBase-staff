'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputField } from '@/components/1_atoms/auth/InputField';
import { LoginButton } from '@/components/1_atoms/auth/LoginButton';
import { ErrorAlert } from '@/components/2_molecules/auth/ErrorAlert';
import { useLoginForm } from '@/hooks/useLoginForm';
import type { LoginCredentials } from '@/types/auth';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  isLoading?: boolean;
  className?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  isLoading = false,
  className = '',
}) => {
  const {
    facilityId,
    password,
    error,
    success,
    fieldErrors,
    isFormValid,
    setFacilityId,
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="facilityId"
            type="text"
            label="施設ID"
            value={facilityId}
            onChange={(e) => setFacilityId(e.target.value)}
            placeholder="施設IDを入力"
            disabled={isLoading}
            isRequired
            error={fieldErrors.facilityId}
            variant={fieldErrors.facilityId ? 'error' : 'default'}
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

          {error && (
            <ErrorAlert 
              type="error" 
              message={error} 
              dismissible 
              onDismiss={clearError}
            />
          )}

          {success && (
            <ErrorAlert 
              type="success" 
              message="ログインに成功しました。" 
            />
          )}

          <LoginButton
            isLoading={isLoading}
            disabled={!isFormValid || isLoading}
            loadingText="ログイン中..."
            fullWidth
          >
            ログイン
          </LoginButton>
        </form>
      </CardContent>
    </Card>
  );
};
