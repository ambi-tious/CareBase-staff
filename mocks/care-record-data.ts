import type { CareRecord } from '@/types/care-record';

export const careRecordData: CareRecord[] = [
  {
    id: 'record-001',
    residentId: '1',
    residentName: '佐藤清',
    category: 'meal',
    title: '朝食摂取記録',
    content: '朝食を8割程度摂取。食欲良好で、特に問題なし。水分摂取も十分。',
    summary: '朝食8割摂取、食欲良好、水分摂取十分',
    recordedAt: '2025-01-21T08:30:00.000Z',
    createdAt: '2025-01-21T08:35:00.000Z',
    updatedAt: '2025-01-21T08:35:00.000Z',
    createdBy: 'staff-001',
    createdByName: '田中 花子',
    priority: 'medium',
    status: 'completed',
  },
  {
    id: 'record-002',
    residentId: '2',
    residentName: '田中花子',
    category: 'medication',
    title: '朝薬服薬確認',
    content: '朝食後の処方薬を確実に服薬。副作用の症状は見られず。血圧測定も実施済み。',
    summary: '朝薬服薬完了、副作用なし、血圧測定済み',
    recordedAt: '2025-01-21T09:00:00.000Z',
    createdAt: '2025-01-21T09:05:00.000Z',
    updatedAt: '2025-01-21T09:05:00.000Z',
    createdBy: 'staff-002',
    createdByName: '佐藤 太郎',
    priority: 'high',
    status: 'completed',
  },
  {
    id: 'record-003',
    residentId: '3',
    residentName: '鈴木太郎',
    category: 'bathing',
    title: '一般浴実施',
    content: '一般浴を実施。入浴中の体調変化なし。皮膚状態良好。リラックスして入浴できた。',
    summary: '一般浴実施、体調変化なし、皮膚状態良好',
    recordedAt: '2025-01-21T14:00:00.000Z',
    createdAt: '2025-01-21T14:30:00.000Z',
    updatedAt: '2025-01-21T14:30:00.000Z',
    createdBy: 'staff-003',
    createdByName: '山田 美咲',
    priority: 'medium',
    status: 'completed',
  },
  {
    id: 'record-004',
    residentId: '4',
    residentName: '山田みどり',
    category: 'vital',
    title: 'バイタルサイン測定',
    content: '体温36.5℃、血圧120/80mmHg、脈拍72回/分。すべて正常範囲内。',
    summary: '体温36.5℃、血圧120/80、脈拍72回/分',
    recordedAt: '2025-01-21T07:00:00.000Z',
    createdAt: '2025-01-21T07:10:00.000Z',
    updatedAt: '2025-01-21T07:10:00.000Z',
    createdBy: 'staff-004',
    createdByName: '鈴木 一郎',
    priority: 'medium',
    status: 'reviewed',
  },
  {
    id: 'record-005',
    residentId: '5',
    residentName: '鈴木幸子',
    category: 'excretion',
    title: '排泄介助記録',
    content: 'トイレ介助を実施。自立度は高く、見守りのみで排泄完了。',
    summary: 'トイレ介助実施、自立度高く見守りのみ',
    recordedAt: '2025-01-21T10:30:00.000Z',
    createdAt: '2025-01-21T10:35:00.000Z',
    updatedAt: '2025-01-21T10:35:00.000Z',
    createdBy: 'staff-005',
    createdByName: '高橋 恵子',
    priority: 'low',
    status: 'completed',
  },
  {
    id: 'record-006',
    residentId: '1',
    residentName: '佐藤清',
    category: 'communication',
    title: '家族面会対応',
    content: 'ご家族の面会があり、近況報告を実施。利用者様も喜んでおられた。',
    summary: '家族面会対応、近況報告実施、利用者様喜ぶ',
    recordedAt: '2025-01-20T15:00:00.000Z',
    createdAt: '2025-01-20T15:30:00.000Z',
    updatedAt: '2025-01-20T15:30:00.000Z',
    createdBy: 'staff-001',
    createdByName: '田中 花子',
    priority: 'low',
    status: 'completed',
  },
  {
    id: 'record-007',
    residentId: '2',
    residentName: '田中花子',
    category: 'exercise',
    title: 'リハビリテーション実施',
    content: '理学療法士指導のもと、歩行訓練を30分実施。意欲的に取り組まれた。',
    summary: '歩行訓練30分実施、意欲的に取り組み',
    recordedAt: '2025-01-20T11:00:00.000Z',
    createdAt: '2025-01-20T11:30:00.000Z',
    updatedAt: '2025-01-20T11:30:00.000Z',
    createdBy: 'staff-006',
    createdByName: '伊藤 健太',
    priority: 'medium',
    status: 'reviewed',
  },
  {
    id: 'record-008',
    residentId: '3',
    residentName: '鈴木太郎',
    category: 'other',
    title: '転倒リスク評価',
    content: '歩行状態を観察し、転倒リスクを評価。現在のところ大きな問題なし。',
    summary: '転倒リスク評価実施、現在問題なし',
    recordedAt: '2025-01-20T16:00:00.000Z',
    createdAt: '2025-01-20T16:15:00.000Z',
    updatedAt: '2025-01-20T16:15:00.000Z',
    createdBy: 'staff-007',
    createdByName: '渡辺 由美',
    priority: 'high',
    status: 'draft',
  },
];

// Helper functions
export const getCareRecordById = (id: string): CareRecord | undefined => {
  return careRecordData.find((record) => record.id === id);
};

export const getCareRecordsByResident = (residentId: string): CareRecord[] => {
  return careRecordData.filter((record) => record.residentId === residentId);
};

export const getCareRecordsByCategory = (category: string): CareRecord[] => {
  return careRecordData.filter((record) => record.category === category);
};

export const searchCareRecords = (query: string): CareRecord[] => {
  const lowercaseQuery = query.toLowerCase();
  return careRecordData.filter(
    (record) =>
      record.title.toLowerCase().includes(lowercaseQuery) ||
      record.content.toLowerCase().includes(lowercaseQuery) ||
      record.residentName.toLowerCase().includes(lowercaseQuery) ||
      record.createdByName.toLowerCase().includes(lowercaseQuery)
  );
};
