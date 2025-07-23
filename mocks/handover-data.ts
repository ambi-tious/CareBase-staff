import type { Handover } from '@/types/handover';

export const handoverData: Handover[] = [
  {
    id: 'handover-001',
    title: '佐藤清様の血圧について',
    content:
      '本日朝のバイタル測定時に血圧が156/110と高値でした。かかりつけ医への連絡を検討してください。',
    category: 'medical',
    priority: 'high',
    status: 'unread',
    createdBy: 'staff-001',
    createdByName: '田中 花子',
    targetStaffIds: ['staff-002', 'staff-004'],
    residentId: '1',
    residentName: '佐藤清',
    scheduledDate: '2025-01-21',
    scheduledTime: '09:00',
    createdAt: '2025-01-20T08:30:00.000Z',
    updatedAt: '2025-01-20T08:30:00.000Z',
  },
  {
    id: 'handover-002',
    title: '鈴木幸子様の食事摂取量低下',
    content:
      '昨日から食事摂取量が普段の半分程度になっています。体調確認と栄養補助食品の検討をお願いします。',
    category: 'care',
    priority: 'medium',
    status: 'read',
    createdBy: 'staff-003',
    createdByName: '山田 美咲',
    targetStaffIds: ['staff-005', 'staff-007'],
    residentId: '5',
    residentName: '鈴木幸子',
    scheduledDate: '2025-01-20',
    scheduledTime: '12:00',
    createdAt: '2025-01-19T14:15:00.000Z',
    updatedAt: '2025-01-19T14:15:00.000Z',
    readAt: '2025-01-19T16:20:00.000Z',
  },
  {
    id: 'handover-003',
    title: '夜勤帯の見回り強化について',
    content:
      '最近、夜間の転倒リスクが高い利用者様が増えています。22時と2時の見回りを強化してください。',
    category: 'communication',
    priority: 'medium',
    status: 'completed',
    createdBy: 'staff-006',
    createdByName: '伊藤 健太',
    targetStaffIds: ['staff-007'],
    scheduledDate: '2025-01-19',
    scheduledTime: '22:00',
    createdAt: '2025-01-18T20:45:00.000Z',
    updatedAt: '2025-01-18T20:45:00.000Z',
    readAt: '2025-01-18T21:00:00.000Z',
    completedAt: '2025-01-19T06:00:00.000Z',
  },
  {
    id: 'handover-004',
    title: '薬剤変更の連絡',
    content: '高橋茂様の降圧剤が変更になりました。新しい薬剤の副作用に注意して観察をお願いします。',
    category: 'medical',
    priority: 'high',
    status: 'read',
    createdBy: 'staff-005',
    createdByName: '高橋 恵子',
    targetStaffIds: ['staff-001', 'staff-002', 'staff-003'],
    residentId: '6',
    residentName: '高橋茂',
    scheduledDate: '2025-01-18',
    scheduledTime: '08:00',
    createdAt: '2025-01-17T11:20:00.000Z',
    updatedAt: '2025-01-17T11:20:00.000Z',
    readAt: '2025-01-17T13:45:00.000Z',
  },
  {
    id: 'handover-005',
    title: '面会予定の連絡',
    content: '田中三郎様のご家族が明日15時頃に面会予定です。お部屋の準備をお願いします。',
    category: 'family',
    priority: 'low',
    status: 'unread',
    createdBy: 'staff-012',
    createdByName: '事務 花子',
    targetStaffIds: ['staff-004', 'staff-010'],
    residentId: '7',
    residentName: '田中三郎',
    scheduledDate: '2025-01-21',
    scheduledTime: '15:00',
    createdAt: '2025-01-20T16:30:00.000Z',
    updatedAt: '2025-01-20T16:30:00.000Z',
  },
];

// Helper functions
export const getHandoverById = (id: string): Handover | undefined => {
  return handoverData.find((handover) => handover.id === id);
};

export const getHandoversByStatus = (status: string): Handover[] => {
  return handoverData.filter((handover) => handover.status === status);
};

export const getHandoversByPriority = (priority: string): Handover[] => {
  return handoverData.filter((handover) => handover.priority === priority);
};

export const searchHandovers = (query: string): Handover[] => {
  const lowercaseQuery = query.toLowerCase();
  return handoverData.filter(
    (handover) =>
      handover.title.toLowerCase().includes(lowercaseQuery) ||
      handover.content.toLowerCase().includes(lowercaseQuery) ||
      handover.createdByName.toLowerCase().includes(lowercaseQuery) ||
      handover.residentName?.toLowerCase().includes(lowercaseQuery)
  );
};
