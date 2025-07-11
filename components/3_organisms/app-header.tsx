'use client';

import { Logo } from '@/components/1_atoms/logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, User, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { StaffDashboard } from './staff-dashboard';

export function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-carebase-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
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
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-carebase-blue-light">
                <Menu className="h-6 w-6 text-carebase-blue" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="max-w-screen sm:max-w-screen h-screen bg-carebase-bg p-0 overflow-y-auto"
            >
              <SheetHeader className="flex flex-row items-center justify-between p-4 sticky top-0 bg-carebase-bg z-10 border-b">
                <SheetTitle className="text-xl font-bold text-carebase-text-primary">
                  メニュー
                </SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                    <X className="h-6 w-6" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              {/* Removed padding from this div, StaffDashboard will manage its own padding */}
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
