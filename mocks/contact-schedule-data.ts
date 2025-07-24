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
    title: '緊急：インフルエンザ対策強化のお知らせ',
    content: '近隣施設でインフルエンザが発生しました。面会制限と感染予防対策を強化します。マスク着用の徹底、手指消毒の頻回実施をお願いします。利用者様の体調変化に十分注意してください。',
    type: 'contact',
    priority: 'high',
    status: 'pending',
    assignedTo: '全職員',
    assignedToId: 'all-staff',
    dueDate: '2025-01-22T08:00:00.000Z',
    startTime: '08:00',
    endTime: '08:30',
    createdAt: '2025-01-21T17:30:00.000Z',
    updatedAt: '2025-01-21T17:30:00.000Z',
    createdBy: 'staff-011',
    tags: ['感染対策', '緊急', '健康管理'],
  },
  {
    id: 'cs-002',
    title: '月次スタッフ会議',
    content: '1月度の業務報告と2月の業務計画について話し合います。各フロアからの報告事項、利用者様の状況共有、新しい介護手順の確認を行います。資料は事前に配布済みです。',
    type: 'schedule',
    priority: 'high',
    status: 'confirmed',
    assignedTo: '全職員',
    assignedToId: 'all-staff',
    dueDate: '2025-01-25T14:00:00.000Z',
    startTime: '14:00',
    endTime: '16:00',
    createdAt: '2025-01-18T10:00:00.000Z',
    updatedAt: '2025-01-20T09:00:00.000Z',
    createdBy: 'staff-011',
    tags: ['会議', '業務計画', '月次'],
  },
  {
    id: 'cs-003',
    title: '佐藤清様の服薬時間変更について',
    content: '主治医の指示により、佐藤清様の降圧剤の服薬時間を朝食後から夕食後に変更します。薬剤師からの指導内容を申し送りノートに記載済みです。血圧測定も夕方に変更してください。',
    type: 'handover',
    priority: 'high',
    status: 'pending',
    assignedTo: '介護フロア A',
    assignedToId: 'group-1',
    dueDate: '2025-01-23T18:00:00.000Z',
    startTime: '18:00',
    endTime: '18:30',
    createdAt: '2025-01-22T14:20:00.000Z',
    updatedAt: '2025-01-22T14:20:00.000Z',
    createdBy: 'staff-005',
    tags: ['服薬管理', '申し送り', '医療'],
    relatedResidentId: '1',
    relatedResidentName: '佐藤清',
  },
  {
    id: 'cs-004',
    title: '節分イベント準備作業',
    content: '2月3日の節分イベントに向けて準備を進めます。豆まき用の豆の準備、鬼のお面作り、利用者様との制作活動を予定しています。アレルギー対応についても確認をお願いします。',
    type: 'schedule',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: 'レクリエーション担当',
    assignedToId: 'recreation-team',
    dueDate: '2025-01-27T15:00:00.000Z',
    startTime: '15:00',
    endTime: '17:00',
    createdAt: '2025-01-20T11:00:00.000Z',
    updatedAt: '2025-01-21T09:30:00.000Z',
    createdBy: 'staff-006',
    tags: ['行事', '節分', 'レクリエーション'],
  },
  {
    id: 'cs-005',
    title: '給湯設備メンテナンス実施',
    content: '給湯設備の定期メンテナンスを実施します。作業時間中（10:00-12:00）は一部エリアでお湯の使用ができません。利用者様の入浴時間の調整をお願いします。',
    type: 'contact',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: '全職員',
    assignedToId: 'all-staff',
    dueDate: '2025-01-24T10:00:00.000Z',
    startTime: '10:00',
    endTime: '12:00',
    createdAt: '2025-01-19T16:00:00.000Z',
    updatedAt: '2025-01-20T08:15:00.000Z',
    createdBy: 'staff-012',
    tags: ['設備', 'メンテナンス', '入浴'],
  },
  {
    id: 'cs-006',
    title: '新人職員研修：移乗介助技術',
    content: '新人職員向けの移乗介助技術研修を実施します。ベッドから車椅子への移乗、立位保持の介助方法を実技中心で学習します。指導職員の同席をお願いします。',
    type: 'schedule',
    priority: 'medium',
    status: 'pending',
    assignedTo: '新人職員・指導職員',
    assignedToId: 'training-group',
    dueDate: '2025-01-26T13:30:00.000Z',
    startTime: '13:30',
    endTime: '15:30',
    createdAt: '2025-01-17T14:00:00.000Z',
    updatedAt: '2025-01-19T10:20:00.000Z',
    createdBy: 'staff-004',
    tags: ['研修', '新人教育', '介助技術'],
  },
  {
    id: 'cs-007',
    title: '田中花子様ご家族面会予定',
    content: '田中花子様のご長男が明日15:00頃に面会予定です。お部屋の準備と、最近の様子をお伝えできるよう準備をお願いします。車椅子での移動介助が必要な場合があります。',
    type: 'contact',
    priority: 'low',
    status: 'pending',
    assignedTo: '介護フロア A',
    assignedToId: 'group-1',
    dueDate: '2025-01-23T15:00:00.000Z',
    startTime: '15:00',
    endTime: '16:00',
    createdAt: '2025-01-22T11:45:00.000Z',
    updatedAt: '2025-01-22T11:45:00.000Z',
    createdBy: 'staff-012',
    tags: ['面会', '家族対応'],
    relatedResidentId: '2',
    relatedResidentName: '田中花子',
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