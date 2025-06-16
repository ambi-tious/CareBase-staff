import type { ReactNode } from 'react';
import { AppHeader } from '@/components/3_organisms/layout/app-header';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-carebase-bg">
      <AppHeader />
      <main>{children}</main>
    </div>
  );
}
