import type { CommunicationRecord, CommunicationThread } from '@/types/communication';

export const communicationRecordsData: CommunicationRecord[] = [
  {
    id: 'comm-001',
    residentId: '1',
    datetime: '2025-01-25T14:30:00.000Z',
    staffId: 'staff-001',
    staffName: '田中 花子',
    contactPersonId: 'contact-1-1',
    contactPersonName: '佐藤健太',
    contactPersonType: 'family',
    communicationContent:
      'お父様の血圧が少し高めになっているとのご連絡をいただきました。最近の食事や水分摂取について心配されています。',
    responseContent:
      '血圧については主治医と相談し、塩分制限を強化しています。水分摂取量も記録を取り、適切な量を維持しています。次回受診時に詳しく相談予定です。',
    isImportant: true,
    threadId: 'thread-001',
    createdAt: '2025-01-25T14:30:00.000Z',
    updatedAt: '2025-01-25T14:30:00.000Z',
    createdBy: 'staff-001',
    createdByName: '田中 花子',
  },
  {
    id: 'comm-002',
    residentId: '1',
    datetime: '2025-01-26T10:15:00.000Z',
    staffId: 'staff-002',
    staffName: '佐藤 太郎',
    contactPersonId: 'contact-1-1',
    contactPersonName: '佐藤健太',
    contactPersonType: 'family',
    communicationContent:
      '昨日の血圧の件で追加のご質問をいただきました。薬の調整について主治医からの説明を求められています。',
    responseContent:
      '主治医の田中先生から、現在の薬で様子を見ることになったとお伝えしました。1週間後に再度血圧測定を行い、必要に応じて薬の調整を検討する予定です。',
    isImportant: false,
    threadId: 'thread-001',
    parentId: 'comm-001',
    createdAt: '2025-01-26T10:15:00.000Z',
    updatedAt: '2025-01-26T10:15:00.000Z',
    createdBy: 'staff-002',
    createdByName: '佐藤 太郎',
  },
  {
    id: 'comm-003',
    residentId: '2',
    datetime: '2025-01-24T16:45:00.000Z',
    staffId: 'staff-004',
    staffName: '鈴木 一郎',
    contactPersonId: 'contact-2-1',
    contactPersonName: '田中佐助',
    contactPersonType: 'family',
    communicationContent:
      'お母様の認知症の症状について、最近物忘れが増えているのではないかとご心配のお電話をいただきました。',
    responseContent:
      '確かに最近、日付や時間の認識に混乱が見られることがあります。しかし、ご家族のお顔は覚えていらっしゃいます。認知症専門医との相談を提案し、ご家族も同意されました。',
    isImportant: true,
    threadId: 'thread-002',
    createdAt: '2025-01-24T16:45:00.000Z',
    updatedAt: '2025-01-24T16:45:00.000Z',
    createdBy: 'staff-004',
    createdByName: '鈴木 一郎',
  },
  {
    id: 'comm-004',
    residentId: '3',
    datetime: '2025-01-23T11:20:00.000Z',
    staffId: 'staff-005',
    staffName: '高橋 恵子',
    contactPersonName: '鈴木花子（近所の方）',
    contactPersonType: 'manual',
    communicationContent:
      '近所の方から、鈴木様が最近散歩中に転倒しそうになったとのご連絡をいただきました。歩行状態について確認を求められています。',
    responseContent:
      '歩行器の使用を徹底し、外出時は必ず職員が付き添うようにしています。理学療法士とも相談し、バランス訓練を強化する予定です。ご近所の方にもお礼をお伝えしました。',
    isImportant: true,
    threadId: 'thread-003',
    createdAt: '2025-01-23T11:20:00.000Z',
    updatedAt: '2025-01-23T11:20:00.000Z',
    createdBy: 'staff-005',
    createdByName: '高橋 恵子',
  },
  {
    id: 'comm-005',
    residentId: '1',
    datetime: '2025-01-22T09:30:00.000Z',
    staffId: 'staff-003',
    staffName: '山田 美咲',
    contactPersonId: 'contact-1-2',
    contactPersonName: '佐藤美香',
    contactPersonType: 'family',
    communicationContent:
      'お義父様の最近の様子について、食事の摂取量が気になるとのお電話をいただきました。',
    responseContent:
      '食事摂取量は記録を取っており、平均して7-8割程度です。好みの食事を提供し、食事時間も調整しています。栄養士とも相談し、栄養バランスは問題ありません。',
    isImportant: false,
    threadId: 'thread-004',
    createdAt: '2025-01-22T09:30:00.000Z',
    updatedAt: '2025-01-22T09:30:00.000Z',
    createdBy: 'staff-003',
    createdByName: '山田 美咲',
  },
];

export const communicationThreadsData: CommunicationThread[] = [
  {
    id: 'thread-001',
    title: '血圧管理について',
    residentId: '1',
    records: communicationRecordsData.filter((r) => r.threadId === 'thread-001'),
    lastActivity: '2025-01-26T10:15:00.000Z',
    isImportant: true,
    participantStaff: ['staff-001', 'staff-002'],
    participantContacts: ['contact-1-1'],
  },
  {
    id: 'thread-002',
    title: '認知症症状について',
    residentId: '2',
    records: communicationRecordsData.filter((r) => r.threadId === 'thread-002'),
    lastActivity: '2025-01-24T16:45:00.000Z',
    isImportant: true,
    participantStaff: ['staff-004'],
    participantContacts: ['contact-2-1'],
  },
  {
    id: 'thread-003',
    title: '歩行状態・転倒リスクについて',
    residentId: '3',
    records: communicationRecordsData.filter((r) => r.threadId === 'thread-003'),
    lastActivity: '2025-01-23T11:20:00.000Z',
    isImportant: true,
    participantStaff: ['staff-005'],
    participantContacts: [],
  },
  {
    id: 'thread-004',
    title: '食事摂取量について',
    residentId: '1',
    records: communicationRecordsData.filter((r) => r.threadId === 'thread-004'),
    lastActivity: '2025-01-22T09:30:00.000Z',
    isImportant: false,
    participantStaff: ['staff-003'],
    participantContacts: ['contact-1-2'],
  },
];

// Helper functions
export const getCommunicationRecordById = (id: string): CommunicationRecord | undefined => {
  return communicationRecordsData.find((record) => record.id === id);
};

export const getCommunicationRecordsByResident = (residentId: string): CommunicationRecord[] => {
  return communicationRecordsData
    .filter((record) => record.residentId === residentId)
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
};

export const getCommunicationThreadsByResident = (residentId: string): CommunicationThread[] => {
  return communicationThreadsData
    .filter((thread) => thread.residentId === residentId)
    .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
};

export const getCommunicationThreadById = (threadId: string): CommunicationThread | undefined => {
  return communicationThreadsData.find((thread) => thread.id === threadId);
};

export const searchCommunicationRecords = (query: string): CommunicationRecord[] => {
  const lowercaseQuery = query.toLowerCase();
  return communicationRecordsData.filter(
    (record) =>
      record.communicationContent.toLowerCase().includes(lowercaseQuery) ||
      record.responseContent.toLowerCase().includes(lowercaseQuery) ||
      record.contactPersonName.toLowerCase().includes(lowercaseQuery) ||
      record.staffName.toLowerCase().includes(lowercaseQuery)
  );
};
