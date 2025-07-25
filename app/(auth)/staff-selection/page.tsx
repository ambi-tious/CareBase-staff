'use client';

import { StaffSelectionScreen } from '@/components/3_organisms/auth/staff-selection-screen';
import type { Staff } from '@/mocks/staff-data';
import { getGroupNameByStaff, getTeamNameByStaff } from '@/utils/staff-utils';
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
  const fromHeader = searchParams.get('from') === 'header';
  const fromStaffClick = searchParams.get('staff') === 'true';
  const autoSelectStaff = searchParams.get('autoSelectStaff') !== 'false';
  const autoSelectTeam = searchParams.get('autoSelectTeam') !== 'false';
  const fromGroupClick = searchParams.get('group') === 'true';
  const staffSelectionRef = useRef<HTMLDivElement>(null);
  const [selectedStaffData, setSelectedStaffData] = useState<SelectedStaffData | undefined>(
    undefined
  );

  // Load current staff data for header navigation context
  useEffect(() => {
    try {
      const data = localStorage.getItem('carebase_selected_staff_data');
      if (data) {
        setSelectedStaffData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load selected staff data:', error);
    }
  }, []);

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

  const handleLogout = (): void => {
    // Clear any stored authentication data
    try {
      localStorage.removeItem('carebase_selected_staff_data');
      localStorage.removeItem('carebase_token');
      localStorage.removeItem('carebase_user');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-carebase-bg p-4">
      <StaffSelectionScreen
        ref={staffSelectionRef}
        fromHeader={fromHeader}
        fromStaffClick={fromStaffClick}
        fromGroupClick={fromGroupClick}
        autoSelectStaff={autoSelectStaff}
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
    <Suspense fallback={<div className="min-h-screen bg-carebase-bg">読み込み中...</div>}>
      <StaffSelectionContent />
    </Suspense>
  );
}
