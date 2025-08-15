'use client';

import { Logo } from '@/components/1_atoms/common/logo';
import { LoginForm } from '@/components/2_molecules/auth/login-form';
import { useAuth } from '@/hooks/useAuth';
import type { LoginCredentials } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, authData, getStoredToken, clearError } = useAuth();

  // 既にログイン済みの場合はリダイレクト
  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      router.push('/staff-selection');
    }
  }, [getStoredToken, router]);

  // ログイン成功時の処理
  useEffect(() => {
    if (authData?.success && authData.token) {
      console.log('ログイン成功:', authData.token);
      router.push('/staff-selection');
    }
  }, [authData, router]);

  const handleLogin = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // エラー状態をクリア
      clearError();

      const response = await login(credentials);

      console.log('response', response);

      if (response.token) {
        return { success: true };
      } else {
        // APIからのエラーメッセージを返す
        return {
          success: false,
          error: response.error || 'ログインに失敗しました',
        };
      }
    } catch (error) {
      // 予期しないエラーの場合
      const errorMessage =
        error instanceof Error ? error.message : 'ログイン中にエラーが発生しました';
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return (
    <div className="min-h-screen bg-carebase-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Logo />
        </div>

        {/* Login Form */}
        <LoginForm onLogin={handleLogin} isLoading={isLoading} />

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 CareBase. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
