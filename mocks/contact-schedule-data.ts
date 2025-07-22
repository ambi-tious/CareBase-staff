import type { IconName } from '@/lib/lucide-icon-registry';
import { Plus } from 'lucide-react';

export interface ContactScheduleItem {
  id: string;
  title: string;
  content: string;
  type: 'contact' | 'schedule' | 'handover';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'confirmed' | 'completed';
  assignedTo: string;
  assignedToId: string;
  dueDate: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  tags?: string[];
  relatedResidentId?: string;
  relatedResidentName?: string;
}

export interface ContactScheduleCategory {
  key: string;
  name: string;
  icon: IconName;
  color: string;
  description: string;
}

export const contactScheduleCategories: ContactScheduleCategory[] = [
  {
    key: 'contact',
    name: '連絡事項',
    icon: 'MessageCircle',
    color: 'bg-green-100 text-green-700 border-green-200',
    description: '一般的な連絡事項',
  },
  {
    key: 'schedule',
    name: '予定',
    icon: 'Calendar',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    description: '会議や行事の予定',
  },
  {
    key: 'handover',
    name: '申し送り',
    icon: 'MessageSquare',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    description: '職員間の申し送り事項',
  },
];

export const contactScheduleData: ContactScheduleItem[] = [
  {
    id: 'cs-001',
    title: '月次ミーティング',
    content: '来月の業務計画について話し合います。各部署からの報告と課題の共有を行います。',
    type: 'schedule',
    priority: 'high',
    status: 'pending',
    assignedTo: '田中 花子',
    assignedToId: 'staff-001',
    dueDate: '2025-01-25T14:00:00.000Z',
    startTime: '14:00',
    endTime: '15:30',
    createdAt: '2025-01-20T09:00:00.000Z',
    updatedAt: '2025-01-20T09:00:00.000Z',
    createdBy: 'staff-011',
    tags: ['会議', '業務計画'],
  },
  {
    id: 'cs-002',
    title: '設備点検のお知らせ',
    content: 'エアコンの定期点検を実施します。点検中は一時的に空調が停止する可能性があります。',
    type: 'contact',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: '佐藤 太郎',
    assignedToId: 'staff-002',
    dueDate: '2025-01-23T10:00:00.000Z',
    startTime: '10:00',
    endTime: '12:00',
    createdAt: '2025-01-19T15:30:00.000Z',
    updatedAt: '2025-01-20T08:15:00.000Z',
    createdBy: 'staff-012',
    tags: ['設備', '点検'],
  },
  {
    id: 'cs-003',
    title: '利用者様の体調変化について',
    content: '山田様の血圧が高めです。注意深く観察をお願いします。必要に応じて医師に相談してください。',
    type: 'handover',
    priority: 'high',
    status: 'pending',
    assignedTo: '鈴木 一郎',
    assignedToId: 'staff-004',
    dueDate: '2025-01-22T08:00:00.000Z',
    startTime: '08:00',
    endTime: '08:30',
    createdAt: '2025-01-21T16:45:00.000Z',
    updatedAt: '2025-01-21T16:45:00.000Z',
    createdBy: 'staff-005',
    tags: ['健康管理', '申し送り'],
    relatedResidentId: '6',
    relatedResidentName: '山田様',
  },
  {
    id: 'cs-004',
    title: '研修会の案内',
    content: '来月の介護技術研修会についてご案内します。参加希望者は事務所までお申し出ください。',
    type: 'contact',
    priority: 'low',
    status: 'completed',
    assignedTo: '高橋 恵子',
    assignedToId: 'staff-005',
    dueDate: '2025-01-30T13:00:00.000Z',
    startTime: '13:00',
    endTime: '17:00',
    createdAt: '2025-01-18T11:20:00.000Z',
    updatedAt: '2025-01-19T14:30:00.000Z',
    createdBy: 'staff-011',
    tags: ['研修', '技術向上'],
  },
  {
    id: 'cs-005',
    title: '新年会の準備',
    content: '利用者様との新年会の準備を進めています。装飾や出し物の準備にご協力ください。',
    type: 'schedule',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: '伊藤 健太',
    assignedToId: 'staff-006',
    dueDate: '2025-01-28T15:00:00.000Z',
    startTime: '15:00',
    endTime: '17:00',
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: '2025-01-20T12:00:00.000Z',
    createdBy: 'staff-007',
    tags: ['行事', '新年会'],
  },
];

// Helper functions
export const getContactScheduleById = (id: string): ContactScheduleItem | undefined => {
  return contactScheduleData.find((item) => item.id === id);
};

export const getContactScheduleByStatus = (status: string): ContactScheduleItem[] => {
  return contactScheduleData.filter((item) => item.status === status);
};

export const getContactScheduleByType = (type: string): ContactScheduleItem[] => {
  return contactScheduleData.filter((item) => item.type === type);
};

export const getContactScheduleByDate = (date: string): ContactScheduleItem[] => {
  return contactScheduleData.filter((item) => {
    const itemDate = new Date(item.dueDate).toISOString().split('T')[0];
    return itemDate === date;
  });
};

export const searchContactSchedule = (query: string): ContactScheduleItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return contactScheduleData.filter(
    (item) =>
      item.title.toLowerCase().includes(lowercaseQuery) ||
      item.content.toLowerCase().includes(lowercaseQuery) ||
      item.assignedTo.toLowerCase().includes(lowercaseQuery) ||
      item.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
};