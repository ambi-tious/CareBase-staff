import type { MonthlyData, RecordDataItem, MonthlyStats } from '@/types/record-data';

// Mock data for daily record data
export const mockRecordData: Record<string, RecordDataItem[]> = {
  '2025-01-21': [
    {
      id: 'rd-001',
      type: 'care',
      time: '08:30',
      title: '朝食介助',
      content:
        '朝食を8割程度摂取。食欲良好で、特に問題なし。水分摂取も十分。普段より会話も多く、表情も明るい。',
      staffName: '田中 花子',
      category: '食事',
      priority: 'medium',
      status: 'completed',
    },
    {
      id: 'rd-002',
      type: 'nursing',
      time: '09:00',
      title: '服薬管理',
      content:
        '朝食後の処方薬を確実に服薬確認。副作用の症状は見られず。血圧測定も実施済み（120/80）。',
      staffName: '佐藤 太郎',
      category: '服薬',
      priority: 'high',
      notes: '血圧値が安定している',
      status: 'completed',
    },
    {
      id: 'rd-003',
      type: 'handover',
      time: '10:00',
      title: '家族面会予定',
      content: '本日15:00頃に長男様が面会予定。最近の様子をお伝えする準備をお願いします。',
      staffName: '山田 美咲',
      priority: 'medium',
      status: 'pending',
    },
    {
      id: 'rd-004',
      type: 'care',
      time: '14:00',
      title: '入浴介助',
      content: '一般浴を実施。入浴中の体調変化なし。皮膚状態良好。リラックスして入浴できた。',
      staffName: '鈴木 一郎',
      category: '入浴',
      priority: 'medium',
      status: 'completed',
    },
    {
      id: 'rd-005',
      type: 'nursing',
      time: '18:30',
      title: 'バイタルチェック',
      content: '夕方のバイタル測定。体温36.5℃、血圧118/75、脈拍72回/分。すべて正常範囲内。',
      staffName: '高橋 美香',
      category: 'バイタル',
      priority: 'medium',
      status: 'completed',
    },
  ],
  '2025-01-20': [
    {
      id: 'rd-006',
      type: 'care',
      time: '08:45',
      title: '朝食介助',
      content: '朝食を7割程度摂取。少し食欲が落ちている様子。水分摂取は普通。',
      staffName: '田中 花子',
      category: '食事',
      priority: 'medium',
      status: 'completed',
    },
    {
      id: 'rd-007',
      type: 'nursing',
      time: '12:00',
      title: '排泄介助',
      content: 'トイレ介助実施。自立度高く、介助は最小限。便秘の傾向なし。',
      staffName: '佐藤 太郎',
      category: '排泄',
      priority: 'low',
      status: 'completed',
    },
    {
      id: 'rd-008',
      type: 'handover',
      time: '16:00',
      title: '医師往診予定',
      content: '明日10:00から主治医の往診予定。血圧の薬について相談予定。',
      staffName: '山田 美咲',
      priority: 'high',
      status: 'completed',
    },
  ],
};

// Mock data for monthly statistics
export const mockMonthlyStats: MonthlyStats[] = [
  {
    date: '2025-01-01',
    careRecordCount: 12,
    nursingRecordCount: 8,
    handoverCount: 3,
    totalRecords: 23,
    averageTime: 15,
    completionRate: 95,
  },
  {
    date: '2025-01-02',
    careRecordCount: 10,
    nursingRecordCount: 7,
    handoverCount: 2,
    totalRecords: 19,
    averageTime: 18,
    completionRate: 100,
  },
  {
    date: '2025-01-03',
    careRecordCount: 14,
    nursingRecordCount: 9,
    handoverCount: 4,
    totalRecords: 27,
    averageTime: 12,
    completionRate: 92,
  },
  {
    date: '2025-01-04',
    careRecordCount: 11,
    nursingRecordCount: 6,
    handoverCount: 2,
    totalRecords: 19,
    averageTime: 16,
    completionRate: 98,
  },
  {
    date: '2025-01-05',
    careRecordCount: 13,
    nursingRecordCount: 8,
    handoverCount: 3,
    totalRecords: 24,
    averageTime: 14,
    completionRate: 96,
  },
  {
    date: '2025-01-06',
    careRecordCount: 15,
    nursingRecordCount: 10,
    handoverCount: 5,
    totalRecords: 30,
    averageTime: 13,
    completionRate: 93,
  },
  {
    date: '2025-01-07',
    careRecordCount: 9,
    nursingRecordCount: 5,
    handoverCount: 1,
    totalRecords: 15,
    averageTime: 20,
    completionRate: 100,
  },
  {
    date: '2025-01-08',
    careRecordCount: 12,
    nursingRecordCount: 7,
    handoverCount: 3,
    totalRecords: 22,
    averageTime: 17,
    completionRate: 95,
  },
  {
    date: '2025-01-09',
    careRecordCount: 11,
    nursingRecordCount: 8,
    handoverCount: 2,
    totalRecords: 21,
    averageTime: 15,
    completionRate: 97,
  },
  {
    date: '2025-01-10',
    careRecordCount: 14,
    nursingRecordCount: 9,
    handoverCount: 4,
    totalRecords: 27,
    averageTime: 11,
    completionRate: 94,
  },
  {
    date: '2025-01-11',
    careRecordCount: 10,
    nursingRecordCount: 6,
    handoverCount: 2,
    totalRecords: 18,
    averageTime: 19,
    completionRate: 100,
  },
  {
    date: '2025-01-12',
    careRecordCount: 13,
    nursingRecordCount: 8,
    handoverCount: 3,
    totalRecords: 24,
    averageTime: 14,
    completionRate: 96,
  },
  {
    date: '2025-01-13',
    careRecordCount: 16,
    nursingRecordCount: 11,
    handoverCount: 5,
    totalRecords: 32,
    averageTime: 12,
    completionRate: 91,
  },
  {
    date: '2025-01-14',
    careRecordCount: 8,
    nursingRecordCount: 4,
    handoverCount: 1,
    totalRecords: 13,
    averageTime: 22,
    completionRate: 100,
  },
  {
    date: '2025-01-15',
    careRecordCount: 12,
    nursingRecordCount: 7,
    handoverCount: 3,
    totalRecords: 22,
    averageTime: 16,
    completionRate: 95,
  },
  {
    date: '2025-01-16',
    careRecordCount: 11,
    nursingRecordCount: 8,
    handoverCount: 2,
    totalRecords: 21,
    averageTime: 17,
    completionRate: 98,
  },
  {
    date: '2025-01-17',
    careRecordCount: 15,
    nursingRecordCount: 10,
    handoverCount: 4,
    totalRecords: 29,
    averageTime: 13,
    completionRate: 93,
  },
  {
    date: '2025-01-18',
    careRecordCount: 9,
    nursingRecordCount: 5,
    handoverCount: 2,
    totalRecords: 16,
    averageTime: 21,
    completionRate: 100,
  },
  {
    date: '2025-01-19',
    careRecordCount: 13,
    nursingRecordCount: 8,
    handoverCount: 3,
    totalRecords: 24,
    averageTime: 15,
    completionRate: 96,
  },
  {
    date: '2025-01-20',
    careRecordCount: 12,
    nursingRecordCount: 7,
    handoverCount: 3,
    totalRecords: 22,
    averageTime: 16,
    completionRate: 95,
  },
  {
    date: '2025-01-21',
    careRecordCount: 14,
    nursingRecordCount: 9,
    handoverCount: 4,
    totalRecords: 27,
    averageTime: 14,
    completionRate: 94,
  },
];

// Mock data for monthly view
export const mockMonthlyData: MonthlyData = {
  month: '2025-01',
  stats: mockMonthlyStats,
  summary: {
    totalRecords: 487,
    averageDaily: 23.2,
    topCategory: 'ケア記録',
    completionRate: 95.8,
    trends: {
      care: [12, 10, 14, 11, 13, 15, 9, 12, 11, 14, 10, 13, 16, 8, 12, 11, 15, 9, 13, 12, 14],
      nursing: [8, 7, 9, 6, 8, 10, 5, 7, 8, 9, 6, 8, 11, 4, 7, 8, 10, 5, 8, 7, 9],
      handover: [3, 2, 4, 2, 3, 5, 1, 3, 2, 4, 2, 3, 5, 1, 3, 2, 4, 2, 3, 3, 4],
    },
  },
};

// Function to get record data for a specific date
export const getRecordDataByDate = (date: string): RecordDataItem[] => {
  return mockRecordData[date] || [];
};

// Function to get record data for a specific resident and date
export const getResidentRecordData = (residentId: string, date: string): RecordDataItem[] => {
  // In a real app, this would filter by residentId
  return getRecordDataByDate(date);
};

// Function to get monthly data for a specific resident and month
export const getResidentMonthlyData = (residentId: string, month: string): MonthlyData => {
  // In a real app, this would filter by residentId and month
  return mockMonthlyData;
};

// Function to search record data
export const searchRecordData = (
  records: RecordDataItem[],
  query: string,
  recordTypes: string[]
): RecordDataItem[] => {
  if (!query && recordTypes.length === 0) return records;

  return records.filter((record) => {
    const matchesQuery =
      !query ||
      record.title.toLowerCase().includes(query.toLowerCase()) ||
      record.content.toLowerCase().includes(query.toLowerCase()) ||
      record.staffName.toLowerCase().includes(query.toLowerCase());

    const matchesType = recordTypes.length === 0 || recordTypes.includes(record.type);

    return matchesQuery && matchesType;
  });
};
