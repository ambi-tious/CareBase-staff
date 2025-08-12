'use client';

import { Logo } from '@/components/1_atoms/common/logo';
import LoginForm from './LoginForm';
import { authService } from '@/services/auth-service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials: {
    facility_id: string;
    password: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      const result = await authService.facilityLogin({
        facility_id: credentials.facility_id,
        password: credentials.password,
      });

      router.push('/staff-selection');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'ログイン中にエラーが発生しました。しばらく経ってからもう一度お試しください。',
      };
    } finally {
      setIsLoading(false);
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
