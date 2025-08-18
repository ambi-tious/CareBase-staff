import { Toaster } from '@/components/ui/toaster';
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareBase Staff',
  description: '介護スタッフ管理システム',
  generator: 'CareBase',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CareBase Staff',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'CareBase Staff',
    title: 'CareBase Staff',
    description: '介護スタッフ管理システム',
  },
  twitter: {
    card: 'summary',
    title: 'CareBase Staff',
    description: '介護スタッフ管理システム',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
