import type { LucideIcon } from 'lucide-react';
import { Folder, FileText, Calendar, Users, AlertTriangle, FileWarning } from 'lucide-react';

export interface DocumentFolder {
  id: string;
  name: string;
  type: 'folder';
  createdAt: string;
  updatedAt: string;
  itemCount: number;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: 'file';
  size: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  fileType: 'pdf' | 'doc' | 'xlsx' | 'txt';
}

export type DocumentItem = DocumentFolder | DocumentFile;

export interface DocumentCategory {
  key: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export const documentCategories: DocumentCategory[] = [
  {
    key: 'minutes',
    name: '議事録',
    icon: FileText,
    description: '会議の議事録や記録',
  },
  {
    key: 'incident-reports',
    name: 'ヒヤリハット',
    icon: AlertTriangle,
    description: 'ヒヤリハット報告書',
  },
  {
    key: 'accident-reports',
    name: '事故報告書',
    icon: FileWarning,
    description: '事故に関する報告書',
  },
  {
    key: 'event-plans',
    name: '行事企画書',
    icon: Calendar,
    description: 'イベントや行事の企画書',
  },
  {
    key: 'other-documents',
    name: 'その他書類',
    icon: FileText,
    description: 'その他の書類',
  },
];

// Sample data for each category
export const documentsData: Record<string, DocumentItem[]> = {
  minutes: [
    {
      id: 'folder-1',
      name: '2025年度会議',
      type: 'folder',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-20',
      itemCount: 12,
    },
    {
      id: 'folder-2',
      name: 'スタッフ会議',
      type: 'folder',
      createdAt: '2025-01-10',
      updatedAt: '2025-01-18',
      itemCount: 8,
    },
    {
      id: 'file-1',
      name: '第1回運営会議議事録.pdf',
      type: 'file',
      size: '2.3 MB',
      createdAt: '2025-01-20',
      updatedAt: '2025-01-20',
      createdBy: '田中 花子',
      fileType: 'pdf',
    },
    {
      id: 'file-2',
      name: '月次報告会議事録.docx',
      type: 'file',
      size: '1.8 MB',
      createdAt: '2025-01-18',
      updatedAt: '2025-01-18',
      createdBy: '佐藤 太郎',
      fileType: 'doc',
    },
  ],
  'incident-reports': [
    {
      id: 'folder-3',
      name: '2025年1月',
      type: 'folder',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-20',
      itemCount: 5,
    },
    {
      id: 'file-3',
      name: 'ヒヤリハット報告_転倒リスク.pdf',
      type: 'file',
      size: '1.2 MB',
      createdAt: '2025-01-19',
      updatedAt: '2025-01-19',
      createdBy: '山田 美咲',
      fileType: 'pdf',
    },
    {
      id: 'file-4',
      name: 'ヒヤリハット報告_薬剤管理.pdf',
      type: 'file',
      size: '0.9 MB',
      createdAt: '2025-01-17',
      updatedAt: '2025-01-17',
      createdBy: '鈴木 一郎',
      fileType: 'pdf',
    },
  ],
  'accident-reports': [
    {
      id: 'folder-4',
      name: '2024年度',
      type: 'folder',
      createdAt: '2024-04-01',
      updatedAt: '2025-01-15',
      itemCount: 3,
    },
    {
      id: 'file-5',
      name: '事故報告書_軽微な転倒.pdf',
      type: 'file',
      size: '1.5 MB',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15',
      createdBy: '高橋 恵子',
      fileType: 'pdf',
    },
  ],
  'event-plans': [
    {
      id: 'folder-5',
      name: '春のイベント',
      type: 'folder',
      createdAt: '2025-01-10',
      updatedAt: '2025-01-20',
      itemCount: 4,
    },
    {
      id: 'file-6',
      name: '新年会企画書.docx',
      type: 'file',
      size: '2.1 MB',
      createdAt: '2025-01-05',
      updatedAt: '2025-01-10',
      createdBy: '伊藤 健太',
      fileType: 'doc',
    },
    {
      id: 'file-7',
      name: '節分イベント計画.xlsx',
      type: 'file',
      size: '1.7 MB',
      createdAt: '2025-01-20',
      updatedAt: '2025-01-20',
      createdBy: '渡辺 由美',
      fileType: 'xlsx',
    },
  ],
  'other-documents': [
    {
      id: 'folder-6',
      name: '契約書類',
      type: 'folder',
      createdAt: '2024-12-01',
      updatedAt: '2025-01-10',
      itemCount: 15,
    },
    {
      id: 'folder-7',
      name: '研修資料',
      type: 'folder',
      createdAt: '2025-01-01',
      updatedAt: '2025-01-18',
      itemCount: 7,
    },
    {
      id: 'file-8',
      name: '施設利用規約.pdf',
      type: 'file',
      size: '3.2 MB',
      createdAt: '2025-01-12',
      updatedAt: '2025-01-12',
      createdBy: '管理者 太郎',
      fileType: 'pdf',
    },
  ],
};

export const getDocumentsByCategory = (categoryKey: string): DocumentItem[] => {
  return documentsData[categoryKey] || [];
};

export const getCategoryByKey = (key: string): DocumentCategory | undefined => {
  return documentCategories.find((category) => category.key === key);
};