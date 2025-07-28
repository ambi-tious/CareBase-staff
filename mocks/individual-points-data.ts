import type { IndividualPoint, PointCategory } from '@/types/individual-point';

export const individualPointsData: IndividualPoint[] = [
  {
    id: 'point-001',
    residentId: '1',
    title: 'とろみスプーン大を使用',
    content: '食事の際は、誤嚥防止のためとろみスプーン大を使用してください。水分摂取時も同様です。',
    category: 'meal',
    priority: 'high',
    status: 'active',
    tags: ['誤嚥防止', '食事介助', 'とろみ'],
    notes: '家族からの要望により導入。効果的に誤嚥を防げています。',
    mediaAttachments: [
      {
        id: 'media-001',
        fileName: 'とろみスプーン使用例.jpg',
        fileType: 'image',
        fileSize: 1024000,
        url: '/placeholder.svg?height=200&width=300&query=spoon',
        thumbnailUrl: '/placeholder.svg?height=100&width=150&query=spoon',
        uploadedAt: '2025-01-20T10:00:00.000Z',
        uploadedBy: 'staff-001',
      },
    ],
    createdAt: '2025-01-15T09:00:00.000Z',
    updatedAt: '2025-01-20T10:00:00.000Z',
    createdBy: 'staff-001',
    createdByName: '田中 花子',
    isSystemDefault: false,
  },
  {
    id: 'point-002',
    residentId: '1',
    title: '血圧測定は左腕で実施',
    content: '右腕に古い骨折歴があるため、血圧測定は必ず左腕で実施してください。',
    category: 'vital',
    priority: 'high',
    status: 'active',
    tags: ['血圧測定', '左腕', '骨折歴'],
    notes: '医師からの指示により左腕での測定を徹底。',
    mediaAttachments: [],
    createdAt: '2025-01-10T14:30:00.000Z',
    updatedAt: '2025-01-10T14:30:00.000Z',
    createdBy: 'staff-002',
    createdByName: '佐藤 太郎',
    isSystemDefault: false,
  },
  {
    id: 'point-003',
    residentId: '1',
    title: '入浴時の座位保持に注意',
    content:
      'バランス感覚が低下しているため、入浴時は必ず介助者が付き添い、座位保持に注意してください。',
    category: 'bathing',
    priority: 'medium',
    status: 'active',
    tags: ['入浴介助', '座位保持', 'バランス'],
    notes: '転倒リスクが高いため、常に見守りが必要です。',
    mediaAttachments: [
      {
        id: 'media-002',
        fileName: '入浴介助手順.mp4',
        fileType: 'video',
        fileSize: 5120000,
        url: '/placeholder.svg?height=200&width=300&query=bathing',
        thumbnailUrl: '/placeholder.svg?height=100&width=150&query=bathing',
        uploadedAt: '2025-01-18T16:00:00.000Z',
        uploadedBy: 'staff-003',
      },
    ],
    createdAt: '2025-01-12T11:15:00.000Z',
    updatedAt: '2025-01-18T16:00:00.000Z',
    createdBy: 'staff-003',
    createdByName: '山田 美咲',
    isSystemDefault: false,
  },
  {
    id: 'point-004',
    residentId: '2',
    title: '認知症による服薬拒否への対応',
    content: '服薬を拒否される場合は、無理強いせず時間をおいて再度声かけを行ってください。',
    category: 'medication',
    priority: 'high',
    status: 'active',
    tags: ['認知症', '服薬拒否', '声かけ'],
    notes: 'ご家族と相談の上、対応方法を決定しました。',
    mediaAttachments: [],
    createdAt: '2025-01-08T13:45:00.000Z',
    updatedAt: '2025-01-08T13:45:00.000Z',
    createdBy: 'staff-004',
    createdByName: '鈴木 一郎',
    isSystemDefault: false,
  },
  {
    id: 'point-005',
    residentId: '3',
    title: '車椅子移乗時の注意点',
    content:
      '左半身麻痺があるため、車椅子移乗時は右側からアプローチし、十分な時間をかけて行ってください。',
    category: 'exercise',
    priority: 'high',
    status: 'active',
    tags: ['車椅子', '移乗', '左半身麻痺'],
    notes: 'リハビリ担当者からの指導内容です。',
    mediaAttachments: [
      {
        id: 'media-003',
        fileName: '移乗介助マニュアル.pdf',
        fileType: 'document',
        fileSize: 2048000,
        url: '/placeholder.svg?height=200&width=300&query=wheelchair',
        uploadedAt: '2025-01-14T09:30:00.000Z',
        uploadedBy: 'staff-005',
      },
    ],
    createdAt: '2025-01-14T09:30:00.000Z',
    updatedAt: '2025-01-14T09:30:00.000Z',
    createdBy: 'staff-005',
    createdByName: '高橋 恵子',
    isSystemDefault: false,
  },
];

export const pointCategoriesData: PointCategory[] = [
  {
    id: 'cat-001',
    name: '食事',
    description: '食事に関する個別ポイント',
    icon: 'Utensils',
    color: '#f97316',
    isSystemDefault: true,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-002',
    name: '入浴',
    description: '入浴に関する個別ポイント',
    icon: 'Bath',
    color: '#3b82f6',
    isSystemDefault: true,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-003',
    name: '服薬',
    description: '服薬に関する個別ポイント',
    icon: 'Pill',
    color: '#8b5cf6',
    isSystemDefault: true,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-004',
    name: 'バイタル',
    description: 'バイタルサインに関する個別ポイント',
    icon: 'Activity',
    color: '#ef4444',
    isSystemDefault: true,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'cat-005',
    name: '運動・リハビリ',
    description: '運動・リハビリに関する個別ポイント',
    icon: 'Dumbbell',
    color: '#10b981',
    isSystemDefault: false,
    isActive: true,
    createdAt: '2025-01-10T10:00:00.000Z',
    updatedAt: '2025-01-10T10:00:00.000Z',
  },
];

// Helper functions
export const getIndividualPointById = (id: string): IndividualPoint | undefined => {
  return individualPointsData.find((point) => point.id === id);
};

export const getIndividualPointsByResident = (residentId: string): IndividualPoint[] => {
  return individualPointsData.filter((point) => point.residentId === residentId);
};

export const getIndividualPointsByCategory = (category: string): IndividualPoint[] => {
  return individualPointsData.filter((point) => point.category === category);
};

export const getCategoryById = (id: string): PointCategory | undefined => {
  return pointCategoriesData.find((category) => category.id === id);
};

export const getActiveCategories = (): PointCategory[] => {
  return pointCategoriesData.filter((category) => category.isActive);
};

export const searchIndividualPoints = (query: string): IndividualPoint[] => {
  const lowercaseQuery = query.toLowerCase();
  return individualPointsData.filter(
    (point) =>
      point.title.toLowerCase().includes(lowercaseQuery) ||
      point.content.toLowerCase().includes(lowercaseQuery) ||
      point.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
};
