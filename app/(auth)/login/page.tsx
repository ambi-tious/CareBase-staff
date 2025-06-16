'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginScreen } from '@/components/3_organisms/auth/login-screen';
import { StaffSelectionScreen } from '@/components/3_organisms/auth/staff-selection-screen';
import type { Staff } from '@/mocks/staff-data';

type AuthMode = 'login' | 'staff-selection';

export default function LoginPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const router = useRouter();

  const handleLogin = async (credentials: {
    facilityId: string;
    password: string;
  }): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - in production, this would call a real API
    if (credentials.facilityId === 'admin' && credentials.password === 'password') {
      setAuthMode('staff-selection');
      return true;
    }

    return false;
  };

  const handleStaffSelected = async (staff: Staff): Promise<void> => {
    // Simulate staff selection processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In production, this would authenticate with the selected staff's credentials
    console.log('Selected staff:', staff);
    router.push('/');
  };

  const handleStaffSelection = (): void => {
    setAuthMode('staff-selection');
  };

  const handleBackToLogin = (): void => {
    setAuthMode('login');
  };

  return (
    <div className="min-h-screen">
      {authMode === 'login' ? (
        <LoginScreen onLogin={handleLogin} onStaffSelection={handleStaffSelection} />
      ) : (
        <div className="min-h-screen bg-carebase-bg flex items-center justify-center p-4">
          <StaffSelectionScreen onStaffSelected={handleStaffSelected} onBack={handleBackToLogin} />
        </div>
      )}
    </div>
  );
}
