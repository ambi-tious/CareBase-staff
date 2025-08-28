import type { Absence, AbsenceStatus } from '@/types/absence';

export const absenceData: Absence[] = [
  {
    id: 'absence-001',
    residentId: '1',
    startDateTime: '2025-01-25T14:00:00.000Z',
    endDateTime: '2025-01-25T16:30:00.000Z',
    reason: 'hospital_visit',
    notes: '神戸総合病院での定期受診。血圧管理のため内科受診予定。',
    status: 'completed',
    createdAt: '2025-01-20T10:00:00.000Z',
    updatedAt: '2025-01-25T16:45:00.000Z',
    createdBy: 'staff-001',
    createdByName: '田中 花子',
    approvedBy: 'staff-011',
    approvedByName: '管理者 太郎',
    approvedAt: '2025-01-20T14:30:00.000Z',
  },
  {
    id: 'absence-002',
    residentId: '1',
    startDateTime: '2025-01-28T10:00:00.000Z',
    endDateTime: '2025-01-28T15:00:00.000Z',
    reason: 'family_visit',
    notes: 'ご長男との外食。お気に入りのレストランでの昼食予定。',
    status: 'scheduled',
    createdAt: '2025-01-22T09:00:00.000Z',
    updatedAt: '2025-01-22T09:00:00.000Z',
    createdBy: 'staff-002',
    createdByName: '佐藤 太郎',
  },
  {
    id: 'absence-003',
    residentId: '2',
    startDateTime: '2025-01-26T09:00:00.000Z',
    endDateTime: '2025-01-26T17:00:00.000Z',
    reason: 'home_visit',
    notes: '自宅での一時帰宅。ご家族との時間を過ごされる予定。',
    status: 'ongoing',
    createdAt: '2025-01-24T16:00:00.000Z',
    updatedAt: '2025-01-26T08:30:00.000Z',
    createdBy: 'staff-004',
    createdByName: '鈴木 一郎',
    approvedBy: 'staff-011',
    approvedByName: '管理者 太郎',
    approvedAt: '2025-01-24T18:00:00.000Z',
  },
  {
    id: 'absence-004',
    residentId: '3',
    startDateTime: '2025-01-23T13:00:00.000Z',
    endDateTime: '2025-01-23T15:30:00.000Z',
    reason: 'hospital_visit',
    notes: '京都第一赤十字病院での心房細動フォロー受診。',
    status: 'completed',
    createdAt: '2025-01-18T11:00:00.000Z',
    updatedAt: '2025-01-23T16:00:00.000Z',
    createdBy: 'staff-005',
    createdByName: '高橋 恵子',
    approvedBy: 'staff-011',
    approvedByName: '管理者 太郎',
    approvedAt: '2025-01-18T15:00:00.000Z',
  },
  {
    id: 'absence-005',
    residentId: '2',
    startDateTime: '2025-01-20T11:00:00.000Z',
    endDateTime: '2025-01-20T14:00:00.000Z',
    reason: 'outing',
    notes: 'ご家族との散歩とお買い物。近所の商店街を予定。',
    status: 'completed',
    createdAt: '2025-01-18T14:00:00.000Z',
    updatedAt: '2025-01-20T14:30:00.000Z',
    createdBy: 'staff-003',
    createdByName: '山田 美咲',
  },
  {
    id: 'absence-006',
    residentId: '1',
    startDateTime: '2025-01-30T08:00:00.000Z',
    endDateTime: '2025-01-30T18:00:00.000Z',
    reason: 'other',
    customReason: '美容院での髪のカット',
    notes: '月1回の美容院での髪のカット。いつもの美容師さんにお願いする予定。',
    status: 'scheduled',
    createdAt: '2025-01-25T10:00:00.000Z',
    updatedAt: '2025-01-25T10:00:00.000Z',
    createdBy: 'staff-001',
    createdByName: '田中 花子',
  },
];

// Helper functions
export const getAbsenceById = (id: string): Absence | undefined => {
  return absenceData.find((absence) => absence.id === id);
};

export const getAbsencesByResident = (residentId: string): Absence[] => {
  return absenceData
    .filter((absence) => absence.residentId === residentId)
    .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());
};

export const getAbsencesByStatus = (status: AbsenceStatus): Absence[] => {
  return absenceData.filter((absence) => absence.status === status);
};

export const getCurrentAbsences = (): Absence[] => {
  const now = new Date();
  return absenceData.filter((absence) => {
    const start = new Date(absence.startDateTime);
    const end = new Date(absence.endDateTime);
    return absence.status === 'ongoing' || (start <= now && end >= now);
  });
};

export const searchAbsences = (query: string): Absence[] => {
  const lowercaseQuery = query.toLowerCase();
  return absenceData.filter(
    (absence) =>
      absence.notes?.toLowerCase().includes(lowercaseQuery) ||
      absence.customReason?.toLowerCase().includes(lowercaseQuery) ||
      absence.createdByName.toLowerCase().includes(lowercaseQuery)
  );
};
