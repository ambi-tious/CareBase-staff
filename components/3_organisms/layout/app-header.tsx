'use client';

import Link from 'next/link';
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
import { useState } from 'react';
import { cn } from '@/lib/utils'; // Import cn

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-carebase-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="hidden rounded-full md:flex border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium"
          >
            <User className="mr-2 h-4 w-4" />
            スタッフ名が入ります
          </Button>
          <Button
            variant="outline"
            className="hidden rounded-full md:flex border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium"
          >
            <Users className="mr-2 h-4 w-4" />
            グループ名が入ります
          </Button>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'hover:bg-carebase-blue-light'
              )}
              aria-label="メニューを開く"
              onClick={() => setIsMenuOpen(true)} // Explicitly set open state on click
            >
              <Menu className="h-6 w-6 text-carebase-blue" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="sm:max-w-full bg-carebase-bg p-0 overflow-y-auto" // Adjusted width class
            >
              <SheetHeader className="flex flex-row items-center justify-between py-2 px-4 sticky top-0 bg-carebase-bg z-10 border-b">
                <SheetTitle className="text-xl font-bold text-carebase-text-primary">
                  メニュー
                </SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">
                    {' '}
                    {/* Removed onClick, SheetClose handles it */}
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <div>
                <StaffDashboard />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
