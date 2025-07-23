'use client';

import { Logo } from '@/components/1_atoms/common/logo';
import { StaffDashboard } from '@/components/3_organisms/dashboard/staff-dashboard';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils'; // Import cn
import type { Staff } from '@/mocks/staff-data';
import { Menu, User, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface SelectedStaffData {
  staff: Staff;
  groupName: string;
  teamName: string;
}

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStaffData, setSelectedStaffData] = useState<SelectedStaffData | null>(null);
  const [isStaffSelected, setIsStaffSelected] = useState(false);
  const [isGroupTeamSelected, setIsGroupTeamSelected] = useState(false);
  const router = useRouter();

  // Load selected staff data from localStorage
  useEffect(() => {
    const loadSelectedStaffData = () => {
      try {
        const data = localStorage.getItem('carebase_selected_staff_data');
        if (data) {
          setSelectedStaffData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Failed to load selected staff data:', error);
      }
    };

    loadSelectedStaffData();

    // Listen for storage changes (when staff is selected)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'carebase_selected_staff_data') {
        loadSelectedStaffData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Reset selection states when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-header-button]')) {
        setIsStaffSelected(false);
        setIsGroupTeamSelected(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleStaffNameClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Toggle staff selection and auto-select group/team
      const newStaffSelected = !isStaffSelected;
      setIsStaffSelected(newStaffSelected);

      if (newStaffSelected) {
        // Navigate to staff selection with query parameter to indicate we're coming from header
        setTimeout(() => {
          router.push('/staff-selection?from=header&staff=true&autoSelectStaff=false');
        }, 200);
      } else {
        setIsGroupTeamSelected(false);
      }
    },
    [isStaffSelected, router]
  );

  const handleGroupTeamClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      // Toggle group/team selection
      const newGroupTeamSelected = !isGroupTeamSelected;
      setIsGroupTeamSelected(newGroupTeamSelected);

      if (newGroupTeamSelected) {
        // Navigate to staff selection with query parameter to indicate we're coming from header
        setTimeout(() => {
          router.push('/staff-selection?from=header&group=true&autoSelectTeam=false');
        }, 200);
      }
    },
    [isGroupTeamSelected, router]
  );

  const handleStaffNameClickFallback = () => {
    router.push('/staff-selection?from=header&staff=true&autoSelectStaff=false');
  };

  const handleGroupTeamClickFallback = () => {
    // Clear current selection to start from group selection
    localStorage.removeItem('carebase_selected_staff_data');
    router.push('/staff-selection?from=header&group=true');
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-carebase-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 tablet:gap-4">
          {selectedStaffData ? (
            <>
              <Button
                variant="outline"
                onClick={handleStaffNameClick}
                data-header-button
                className={cn(
                  'hidden rounded-full md:flex font-medium tablet:px-6 tablet:py-3 tablet:text-tablet-base min-h-touch-target',
                  isStaffSelected
                    ? 'bg-carebase-blue text-white border-carebase-blue-dark shadow-md'
                    : 'border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light'
                )}
              >
                <User className="mr-2 h-4 w-4 tablet:h-5 tablet:w-5" />
                {selectedStaffData.staff.name}
              </Button>
              <Button
                variant="outline"
                onClick={handleGroupTeamClick}
                data-header-button
                className={cn(
                  'hidden rounded-full md:flex font-medium tablet:px-6 tablet:py-3 tablet:text-tablet-base min-h-touch-target',
                  isGroupTeamSelected
                    ? 'bg-carebase-blue text-white border-carebase-blue-dark shadow-md'
                    : 'border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light'
                )}
              >
                <Users className="mr-2 h-4 w-4 tablet:h-5 tablet:w-5" />
                {selectedStaffData.groupName} - {selectedStaffData.teamName}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleStaffNameClickFallback}
                className="hidden rounded-full md:flex border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium tablet:px-6 tablet:py-3 tablet:text-tablet-base min-h-touch-target"
              >
                <User className="mr-2 h-4 w-4 tablet:h-5 tablet:w-5" />
                職員を選択
              </Button>
              <Button
                variant="outline"
                onClick={handleGroupTeamClickFallback}
                className="hidden rounded-full md:flex border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium tablet:px-6 tablet:py-3 tablet:text-tablet-base min-h-touch-target"
              >
                <Users className="mr-2 h-4 w-4 tablet:h-5 tablet:w-5" />
                グループ・チームを選択
              </Button>
            </>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'hover:bg-carebase-blue-light tablet:h-12 tablet:w-12 min-h-touch-target min-w-touch-target'
              )}
              aria-label="メニューを開く"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6 text-carebase-blue tablet:h-7 tablet:w-7" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="sm:max-w-full bg-carebase-bg p-0 overflow-y-auto tablet:max-w-[90vw]"
            >
              <SheetHeader className="flex flex-row items-center justify-between py-2 px-4 tablet:py-4 tablet:px-6 sticky top-0 bg-carebase-bg z-10 border-b">
                <SheetTitle className="text-xl font-bold text-carebase-text-primary tablet:text-tablet-2xl">
                  メニュー
                </SheetTitle>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="tablet:h-12 tablet:w-12 min-h-touch-target min-w-touch-target"
                  >
                    <X className="h-6 w-6 tablet:h-7 tablet:w-7" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <StaffDashboard setIsMenuOpen={setIsMenuOpen} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
