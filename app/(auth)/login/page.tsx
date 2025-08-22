'use client';

import { Logo } from '@/components/1_atoms/common/logo';
import { LoginForm } from '@/components/2_molecules/auth/login-form';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, error, login, clearError } = useAuth();

  // 既にログイン済みの場合はリダイレクト
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/staff-selection');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (credentials: any) => {
    const response = await login(credentials);
    return response;
  };

  return (
    <div className="min-h-screen bg-carebase-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Logo />

          {/* 開発環境表示 */}
          {process.env.NEXT_PUBLIC_USE_MOCK === 'true' && (
            <div className="mt-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                開発環境 - モックデータ使用中
              </div>
              <div className="mt-2 text-xs text-orange-600">
                認証情報: admin/password または demo/demo
              </div>
            </div>
          )}
        </div>

        {/* Login Form */}
        <LoginForm
          onLogin={handleLogin}
          isLoading={isLoading}
          error={error}
          onClearError={clearError}
        />

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 CareBase. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
