import type { IconName } from '@/lib/lucide-icon-registry';
import type { ContactScheduleItem } from '@/types/contact-schedule';

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
    title: '夏季感染症対策の徹底について',
    content:
      '夏季に多発する感染性胃腸炎の予防対策を強化します。食事前後の手洗い徹底、調理器具の消毒強化、利用者様の体調観察を重点的に行ってください。症状が見られた場合は速やかに報告をお願いします。',
    type: 'contact',
    priority: 'high',
    status: 'pending',
    assignedTo: '全職員',
    assignedToId: 'all-staff',
    dueDate: '2025-07-25T08:00:00.000Z',
    startTime: '08:00',
    endTime: '08:30',
    createdAt: '2025-07-24T17:30:00.000Z',
    updatedAt: '2025-07-24T17:30:00.000Z',
    createdBy: 'staff-011',
    tags: ['感染対策', '夏季対策', '健康管理'],
  },
  {
    id: 'cs-002',
    title: '7月度スタッフ会議',
    content:
      '7月度の業務報告と8月の業務計画について話し合います。夏季の水分補給対策、熱中症予防、お盆期間の勤務体制について確認します。資料は事前に配布済みです。',
    type: 'schedule',
    priority: 'high',
    status: 'confirmed',
    assignedTo: '全職員',
    assignedToId: 'all-staff',
    dueDate: '2025-07-30T14:00:00.000Z',
    startTime: '14:00',
    endTime: '16:00',
    createdAt: '2025-07-20T10:00:00.000Z',
    updatedAt: '2025-07-22T09:00:00.000Z',
    createdBy: 'staff-011',
    tags: ['会議', '業務計画', '夏季対策'],
  },
  {
    id: 'cs-003',
    title: '佐藤清様の水分補給強化について',
    content:
      '主治医の指示により、佐藤清様の水分摂取量を1日1500mlに増量します。熱中症予防のため、定期的な水分補給の声かけと摂取量の記録をお願いします。脱水症状の兆候にも注意してください。',
    type: 'handover',
    priority: 'high',
    status: 'pending',
    assignedTo: '介護フロア A',
    assignedToId: 'group-1',
    dueDate: '2025-07-26T10:00:00.000Z',
    startTime: '10:00',
    endTime: '10:30',
    createdAt: '2025-07-24T14:20:00.000Z',
    updatedAt: '2025-07-24T14:20:00.000Z',
    createdBy: 'staff-005',
    tags: ['水分管理', '申し送り', '熱中症予防'],
    relatedResidentId: '1',
    relatedResidentName: '佐藤清',
  },
  {
    id: 'cs-004',
    title: '夏祭りイベント準備作業',
    content:
      '8月5日の夏祭りイベントに向けて準備を進めます。浴衣の準備、うちわ作り、かき氷機の点検を行います。暑さ対策として屋内での実施を予定しています。',
    type: 'schedule',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: 'レクリエーション担当',
    assignedToId: 'recreation-team',
    dueDate: '2025-08-02T15:00:00.000Z',
    startTime: '15:00',
    endTime: '17:00',
    createdAt: '2025-07-18T11:00:00.000Z',
    updatedAt: '2025-07-22T09:30:00.000Z',
    createdBy: 'staff-006',
    tags: ['行事', '夏祭り', 'レクリエーション'],
  },
  {
    id: 'cs-005',
    title: 'エアコン設備点検実施',
    content:
      'エアコン設備の定期点検を実施します。作業時間中（10:00-12:00）は一部エリアで冷房が停止します。利用者様の居室移動と水分補給の準備をお願いします。',
    type: 'contact',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: '全職員',
    assignedToId: 'all-staff',
    dueDate: '2025-07-28T10:00:00.000Z',
    startTime: '10:00',
    endTime: '12:00',
    createdAt: '2025-07-21T16:00:00.000Z',
    updatedAt: '2025-07-23T08:15:00.000Z',
    createdBy: 'staff-012',
    tags: ['設備', 'メンテナンス', '冷房'],
  },
  {
    id: 'cs-006',
    title: '熱中症予防研修',
    content:
      '夏季の熱中症予防に関する研修を実施します。症状の見分け方、応急処置、予防対策について学習します。全職員の参加をお願いします。',
    type: 'schedule',
    priority: 'medium',
    status: 'pending',
    assignedTo: '全職員',
    assignedToId: 'all-staff',
    dueDate: '2025-08-01T13:30:00.000Z',
    startTime: '13:30',
    endTime: '15:30',
    createdAt: '2025-07-19T14:00:00.000Z',
    updatedAt: '2025-07-23T10:20:00.000Z',
    createdBy: 'staff-004',
    tags: ['研修', '熱中症予防', '安全管理'],
  },
  {
    id: 'cs-007',
    title: '田中花子様ご家族面会予定',
    content:
      '田中花子様のご長男が7月27日15:00頃に面会予定です。お部屋の準備と、最近の様子をお伝えできるよう準備をお願いします。暑さ対策として冷房の調整もお願いします。',
    type: 'contact',
    priority: 'low',
    status: 'pending',
    assignedTo: '介護フロア A',
    assignedToId: 'group-1',
    dueDate: '2025-07-27T15:00:00.000Z',
    startTime: '15:00',
    endTime: '16:00',
    createdAt: '2025-07-24T11:45:00.000Z',
    updatedAt: '2025-07-24T11:45:00.000Z',
    createdBy: 'staff-012',
    tags: ['面会', '家族対応'],
    relatedResidentId: '2',
    relatedResidentName: '田中花子',
  },
  {
    id: 'cs-008',
    title: '避難訓練実施のお知らせ',
    content:
      '火災避難訓練を実施します。利用者様の安全確保を最優先に、各フロアの避難経路確認と職員の役割分担を再確認します。車椅子利用者様の避難介助についても重点的に訓練します。',
    type: 'schedule',
    priority: 'high',
    status: 'confirmed',
    assignedTo: '全職員',
    assignedToId: 'all-staff',
    dueDate: '2025-08-03T10:00:00.000Z',
    startTime: '10:00',
    endTime: '11:30',
    createdAt: '2025-07-20T09:00:00.000Z',
    updatedAt: '2025-07-23T14:00:00.000Z',
    createdBy: 'staff-011',
    tags: ['避難訓練', '安全管理', '防災'],
  },
  {
    id: 'cs-009',
    title: 'お盆期間の勤務体制について',
    content:
      'お盆期間（8月13日〜16日）の勤務体制をお知らせします。帰省される職員の代替勤務、面会時間の延長対応、お盆行事の準備について確認をお願いします。',
    type: 'contact',
    priority: 'medium',
    status: 'pending',
    assignedTo: '全職員',
    assignedToId: 'all-staff',
    dueDate: '2025-08-05T09:00:00.000Z',
    startTime: '09:00',
    endTime: '09:30',
    createdAt: '2025-07-22T16:00:00.000Z',
    updatedAt: '2025-07-23T10:00:00.000Z',
    createdBy: 'staff-011',
    tags: ['お盆', '勤務体制', '行事'],
  },
  {
    id: 'cs-010',
    title: '山田みどり様の外出支援',
    content:
      '山田みどり様の通院支援を行います。整形外科への定期受診のため、車椅子での移動介助と付き添いをお願いします。暑さ対策として日傘と冷却タオルを準備してください。',
    type: 'schedule',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: '介護フロア A',
    assignedToId: 'group-1',
    dueDate: '2025-07-29T14:00:00.000Z',
    startTime: '14:00',
    endTime: '16:30',
    createdAt: '2025-07-21T13:00:00.000Z',
    updatedAt: '2025-07-23T11:00:00.000Z',
    createdBy: 'staff-003',
    tags: ['通院支援', '外出', '医療'],
    relatedResidentId: '4',
    relatedResidentName: '山田みどり',
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
