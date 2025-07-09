'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Logo } from '@/components/1_atoms/common/logo';
import { Button, buttonVariants } from '@/components/ui/button'; // Import buttonVariants
import { User, Users, Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet';
import { StaffDashboard } from '@/components/3_organisms/dashboard/staff-dashboard';
import { cn } from '@/lib/utils'; // Import cn
import type { Staff } from '@/mocks/staff-data';

interface SelectedStaffData {
  staff: Staff;
  groupName: string;
  teamName: string;
}

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedStaffData, setSelectedStaffData] = useState<SelectedStaffData | null>(null);
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

  const handleStaffNameClick = () => {
    router.push('/staff-selection');
  };

  const handleGroupTeamClick = () => {
    // Clear current selection to start from group selection
    localStorage.removeItem('carebase_selected_staff_data');
    router.push('/staff-selection');
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-carebase-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          {selectedStaffData ? (
            <>
              <Button
                variant="outline"
                onClick={handleStaffNameClick}
                className="hidden rounded-full md:flex border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium"
              >
                <User className="mr-2 h-4 w-4" />
                {selectedStaffData.staff.name}
              </Button>
              <Button
                variant="outline"
                onClick={handleGroupTeamClick}
                className="hidden rounded-full md:flex border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium"
              >
                <Users className="mr-2 h-4 w-4" />
                {selectedStaffData.groupName} - {selectedStaffData.teamName}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleStaffNameClick}
                className="hidden rounded-full md:flex border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium"
              >
                <User className="mr-2 h-4 w-4" />
                職員を選択
              </Button>
              <Button
                variant="outline"
                onClick={handleGroupTeamClick}
                className="hidden rounded-full md:flex border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium"
              >
                <Users className="mr-2 h-4 w-4" />
                グループ・チームを選択
              </Button>
            </>
          )}

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'hover:bg-carebase-blue-light'
              )}
              aria-label="メニューを開く"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-6 w-6 text-carebase-blue" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="sm:max-w-full bg-carebase-bg p-0 overflow-y-auto"
            >
              <SheetHeader className="flex flex-row items-center justify-between py-2 px-4 sticky top-0 bg-carebase-bg z-10 border-b">
                <SheetTitle className="text-xl font-bold text-carebase-text-primary">
                  メニュー
                </SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    <X className="h-6 w-6" />
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
