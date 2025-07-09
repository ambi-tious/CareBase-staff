'use client';

import type React from 'react';
import { LoginForm } from '@/components/2_molecules/auth/login-form';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/1_atoms/common/logo';
import { Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import type { LoginCredentials } from '@/types/auth';

interface LoginScreenProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  onStaffSelection?: () => void;
  className?: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onStaffSelection,
  className = '',
}) => {
  const { isLoading } = useAuth();

  return (
    <div
      className={`min-h-screen bg-carebase-bg flex items-center justify-center p-4 ${className}`}
    >
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Logo />
        </div>

        {/* Login Form */}
        <LoginForm onLogin={onLogin} isLoading={isLoading} />

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2025 CareBase. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
