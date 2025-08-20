import type { IconName } from '@/lib/lucide-icon-registry';

export interface NavLink {
  label: string;
  href: string;
  icon: IconName;
}

export interface NavCategory {
  title: string;
  icon: IconName;
  links: NavLink[];
}

export const dashboardMenu: NavCategory[] = [
  {
    title: '利用者関連',
    icon: 'Users',
    links: [
      { label: '利用者リスト', href: '/residents', icon: 'User' },
      { label: 'ケアボード', href: '/', icon: 'Notebook' },
    ],
  },
  {
    title: '連絡・予定',
    icon: 'MessageSquare',
    links: [
      { label: 'お知らせ一覧', href: '/notifications', icon: 'Bell' },
      { label: '週間表示', href: '/contact-schedule', icon: 'Calendar' },
      { label: '月間表示', href: '/contact-schedule', icon: 'Calendar' },
    ],
  },
  {
    title: '研修・マニュアル',
    icon: 'BookOpen',
    links: [
      { label: '研修・課題', href: '#', icon: 'Lightbulb' },
      { label: 'マニュアル', href: '#', icon: 'Book' },
      { label: 'ガイド', href: '#', icon: 'BookMarked' },
    ],
  },
  {
    title: '書類情報関連',
    icon: 'Folder',
    links: [
      { label: '議事録', href: '/documents?category=minutes', icon: 'NotebookText' },
      { label: 'ヒヤリハット', href: '/documents?category=incident-reports', icon: 'FileWarning' },
      { label: '事故報告書', href: '/documents?category=accident-reports', icon: 'FileClock' },
      { label: '行事企画書', href: '/documents?category=event-plans', icon: 'FileSignature' },
      { label: 'その他書類', href: '/documents?category=other-documents', icon: 'FileArchive' },
    ],
  },
  {
    title: '申し送り・介護記録',
    icon: 'FileText',
    links: [
      { label: '申し送り一覧', href: '/handovers', icon: 'MessageCircle' },
      { label: '介護記録一覧', href: '/care-records', icon: 'Clipboard' },
    ],
  },
];
