'use client';

import { Logo } from '@/components/1_atoms/common/logo';
import { LoginForm } from '@/components/2_molecules/auth/login-form';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (credentials: {
    facilityId: string;
    password: string;
  }): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - in production, this would call a real API
    if (credentials.facilityId === 'admin' && credentials.password === 'password') {
      router.push('/staff-selection');
      return true;
    }

    return false;
  };

  return (
    <div className="min-h-screen bg-carebase-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Logo />
        </div>

        {/* Login Form */}
        <LoginForm onLogin={handleLogin} />

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 CareBase. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
