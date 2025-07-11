'use client';

import { StaffSelectionScreen } from '@/components/3_organisms/auth/staff-selection-screen';
import type { Staff } from '@/mocks/staff-data';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StaffSelectionPage() {
  const router = useRouter();
  const [initialStep, setInitialStep] = useState<'group' | 'staff' | 'team'>('group');

  useEffect(() => {
    // Determine the initial step based on previously selected staff data
    // Only run on client side to avoid SSR issues with localStorage
    try {
      const selectedStaffData = JSON.parse(
        localStorage.getItem('carebase_selected_staff_data') || '{}'
      );
      const step = selectedStaffData.teamName
        ? 'team'
        : selectedStaffData.groupName
          ? 'staff'
          : 'group';
      setInitialStep(step);
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      setInitialStep('group');
    }
  }, []);

  const handleStaffSelected = async (staff: Staff): Promise<void> => {
    // Simulate staff selection processing
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Store selected staff in localStorage for header display
    const selectedStaffData = {
      staff,
      groupName: getGroupNameByStaff(staff),
      teamName: getTeamNameByStaff(staff),
    };

    try {
      localStorage.setItem('carebase_selected_staff_data', JSON.stringify(selectedStaffData));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }

    // In production, this would authenticate with the selected staff's credentials
    router.push('/');
  };

  const handleBackToLogin = (): void => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-carebase-bg flex items-center justify-center p-4">
      <StaffSelectionScreen
        onStaffSelected={handleStaffSelected}
        onBack={handleBackToLogin}
        initialStep={initialStep}
      />
    </div>
  );
}

// Helper functions to get group and team names
function getGroupNameByStaff(staff: Staff): string {
  // This would normally come from the API or be passed through the selection process
  // For now, we'll use mock data mapping
  const organizationData: Record<string, { groupName: string }> = {
    'staff-001': { groupName: '介護フロア A' },
    'staff-002': { groupName: '介護フロア A' },
    'staff-003': { groupName: '介護フロア A' },
    'staff-004': { groupName: '介護フロア A' },
    'staff-005': { groupName: '介護フロア A' },
    'staff-006': { groupName: '介護フロア A' },
    'staff-007': { groupName: '介護フロア A' },
    'staff-008': { groupName: '介護フロア B' },
    'staff-009': { groupName: '介護フロア B' },
    'staff-010': { groupName: '介護フロア B' },
    'staff-011': { groupName: '管理部門' },
    'staff-012': { groupName: '管理部門' },
  };

  return organizationData[staff.id]?.groupName || '不明なグループ';
}

function getTeamNameByStaff(staff: Staff): string {
  // This would normally come from the API or be passed through the selection process
  const teamMapping: Record<string, string> = {
    'staff-001': '朝番チーム',
    'staff-002': '朝番チーム',
    'staff-003': '朝番チーム',
    'staff-004': '日勤チーム',
    'staff-005': '日勤チーム',
    'staff-006': '夜勤チーム',
    'staff-007': '夜勤チーム',
    'staff-008': '朝番チーム',
    'staff-009': '朝番チーム',
    'staff-010': '日勤チーム',
    'staff-011': '管理チーム',
    'staff-012': '管理チーム',
  };

  return teamMapping[staff.id] || '不明なチーム';
}
