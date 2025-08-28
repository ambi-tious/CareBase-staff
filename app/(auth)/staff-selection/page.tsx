'use client';

import { StaffSelectionScreen } from '@/components/3_organisms/auth/staff-selection-screen';
import { useAuth } from '@/hooks/useAuth';
import type { Staff } from '@/mocks/staff-data';
import { getStaffGroupAndTeam } from '@/mocks/staff-data';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

interface SelectedStaffData {
  staff: Staff;
  groupName: string;
  teamName: string;
}

function StaffSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getStoredToken, getStoredFacility, logout } = useAuth();
  const fromHeader = searchParams.get('from') === 'header';
  const fromStaffClick = searchParams.get('staff') === 'true';
  const autoSelectTeam = searchParams.get('autoSelectTeam') !== 'false';
  const staffSelectionRef = useRef<HTMLDivElement>(null);
  const [selectedStaffData, setSelectedStaffData] = useState<SelectedStaffData | undefined>(
    undefined
  );

  // Check authentication and load current staff data
  useEffect(() => {
    const token = getStoredToken();
    const facility = getStoredFacility();

    if (!token || !facility) {
      router.push('/login');
      return;
    }

    try {
      const data = localStorage.getItem('carebase_selected_staff_data');
      if (data) {
        setSelectedStaffData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load selected staff data:', error);
    }
  }, [getStoredToken, getStoredFacility, router]);

  // Scroll to staff selection area after component mounts
  useEffect(() => {
    // Short delay to ensure the component is fully rendered
    const timer = setTimeout(() => {
      if (staffSelectionRef.current) {
        staffSelectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleStaffSelected = async (staff: Staff): Promise<void> => {
    const token = getStoredToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Call API to select staff
      localStorage.setItem('selected_staff', JSON.stringify(staff));

      // 開発環境ではモックデータからグループ名とチーム名を取得
      let groupName = '';
      let teamName = '';

      if (!process.env.NEXT_PUBLIC_API_URL) {
        const groupAndTeam = getStaffGroupAndTeam(staff.id);
        if (groupAndTeam) {
          groupName = groupAndTeam.groupName;
          teamName = groupAndTeam.teamName;
        }
      } else {
        // 本番環境ではstaff.teamから取得
        groupName = staff.team?.group?.name || '';
        teamName = staff.team?.name || '';
      }

      const selectedStaffData = {
        staff,
        groupName,
        teamName,
      };

      // 開発環境: スタッフ選択データを保存
      if (process.env.NODE_ENV === 'development') {
        console.log('🔧 開発環境: スタッフ選択データを保存', {
          staffId: staff.id,
          staffName: staff.name,
          groupName,
          teamName,
        });
      }

      localStorage.setItem('carebase_selected_staff_data', JSON.stringify(selectedStaffData));
      router.push('/');
    } catch (error) {
      console.error('Error selecting staff:', error);
      // Handle error - could show a toast or error message
    }
  };

  const handleLogout = async (): Promise<void> => {
    const token = getStoredToken();
    if (token) {
      try {
        await logout();
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }

    // Clear any remaining stored data
    try {
      localStorage.removeItem('carebase_selected_staff_data');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }

    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-carebase-bg p-4">
      {/* 開発環境表示 */}
      {!process.env.NEXT_PUBLIC_API_URL && (
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
            開発環境 - モックデータ使用中
          </div>
        </div>
      )}

      <StaffSelectionScreen
        ref={staffSelectionRef}
        fromHeader={fromHeader}
        fromStaffClick={fromStaffClick}
        autoSelectTeam={autoSelectTeam}
        onStaffSelected={handleStaffSelected}
        onLogout={handleLogout}
        selectedStaffData={selectedStaffData}
      />
    </div>
  );
}

export default function StaffSelectionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-carebase-bg flex items-center justify-center">
          読み込み中...
        </div>
      }
    >
      <StaffSelectionContent />
    </Suspense>
  );
}
