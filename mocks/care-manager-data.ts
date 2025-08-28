import type { CareManager } from '@/types/care-manager';

/**
 * ケアマネージャーマスタのモックデータ
 */
export const careManagerMasterData: CareManager[] = [
  {
    id: 'cm-001',
    name: '田中太郎',
    officeName: '渋谷ケアプランセンター',
    phone: '03-1234-5678',
    fax: '03-1234-5679',
    email: 'tanaka@shibuya-care.co.jp',
    address: '東京都渋谷区渋谷1-1-1',
    notes: '渋谷エリア専門のケアプランセンター',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'cm-002',
    name: '佐藤花子',
    officeName: '新宿ケアステーション',
    phone: '03-2345-6789',
    fax: '03-2345-6780',
    email: 'sato@shinjuku-care.co.jp',
    address: '東京都新宿区新宿2-2-2',
    notes: '新宿区全域対応可能',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-11-15T00:00:00Z',
  },
  {
    id: 'cm-003',
    name: '鈴木一郎',
    officeName: 'こうべケアプランセンター',
    phone: '078-3456-7890',
    fax: '078-3456-7891',
    email: 'suzuki@kobe-care.co.jp',
    address: '兵庫県神戸市中央区港町3-3-3',
    notes: '神戸市中央区・灘区対応',
    isActive: true,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'cm-004',
    name: '高橋美咲',
    officeName: '大阪中央居宅介護支援センター',
    phone: '06-4567-8901',
    fax: '06-4567-8902',
    email: 'takahashi@osaka-central.co.jp',
    address: '大阪府大阪市中央区本町4-4-4',
    notes: '大阪市内全域対応',
    isActive: true,
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-11-30T00:00:00Z',
  },
  {
    id: 'cm-005',
    name: '渡辺健太',
    officeName: '京都在宅支援センター',
    phone: '075-5678-9012',
    fax: '075-5678-9013',
    email: 'watanabe@kyoto-home.co.jp',
    address: '京都府京都市中京区烏丸通5-5-5',
    notes: '京都市内および周辺地域対応',
    isActive: true,
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'cm-006',
    name: '山田太郎',
    officeName: 'こうべケアプランセンター',
    phone: '078-6789-0123',
    fax: '078-6789-0124',
    email: 'yamada@kobe-care.co.jp',
    address: '兵庫県神戸市中央区港町3-3-3',
    notes: '神戸市須磨区・垂水区担当',
    isActive: true,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'cm-007',
    name: '松本花',
    officeName: '大阪中央居宅介護支援センター',
    phone: '06-7890-1234',
    fax: '06-7890-1235',
    email: 'matsumoto@osaka-central.co.jp',
    address: '大阪府大阪市中央区本町4-4-4',
    notes: '大阪市南部エリア担当',
    isActive: true,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-11-30T00:00:00Z',
  },
  {
    id: 'cm-008',
    name: '木村和子',
    officeName: '京都在宅支援センター',
    phone: '075-8901-2345',
    fax: '075-8901-2346',
    email: 'kimura@kyoto-home.co.jp',
    address: '京都府京都市中京区烏丸通5-5-5',
    notes: '京都市北部エリア担当',
    isActive: true,
    createdAt: '2024-04-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
  {
    id: 'cm-009',
    name: '中村秀樹',
    officeName: '横浜ケアサポート',
    phone: '045-9012-3456',
    fax: '045-9012-3457',
    email: 'nakamura@yokohama-care.co.jp',
    address: '神奈川県横浜市西区みなとみらい6-6-6',
    notes: '横浜市西区・中区対応',
    isActive: false,
    createdAt: '2024-05-01T00:00:00Z',
    updatedAt: '2024-10-01T00:00:00Z',
  },
  {
    id: 'cm-010',
    name: '小林真理',
    officeName: '川崎ライフサポート',
    phone: '044-0123-4567',
    fax: '044-0123-4568',
    email: 'kobayashi@kawasaki-life.co.jp',
    address: '神奈川県川崎市川崎区駅前7-7-7',
    notes: '川崎市全域対応',
    isActive: true,
    createdAt: '2024-05-15T00:00:00Z',
    updatedAt: '2024-12-01T00:00:00Z',
  },
];

/**
 * ケアマネージャー検索関数
 */
export const searchCareManagers = (
  data: CareManager[],
  keyword?: string,
  isActive?: boolean,
  officeName?: string
): CareManager[] => {
  return data.filter((manager) => {
    // アクティブフラグでのフィルタ
    if (isActive !== undefined && manager.isActive !== isActive) {
      return false;
    }

    // 事業所名でのフィルタ
    if (officeName && !manager.officeName.includes(officeName)) {
      return false;
    }

    // キーワード検索
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      return (
        manager.name.toLowerCase().includes(lowerKeyword) ||
        manager.officeName.toLowerCase().includes(lowerKeyword) ||
        (manager.email && manager.email.toLowerCase().includes(lowerKeyword)) ||
        (manager.address && manager.address.toLowerCase().includes(lowerKeyword))
      );
    }

    return true;
  });
};
