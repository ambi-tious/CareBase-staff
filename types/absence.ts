/**
 * Absence Types
 *
 * Types for resident absence management system
 */

// Absence status
export type AbsenceStatus = 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

// Absence reason categories
export type AbsenceReason =
  | 'hospital_visit'
  | 'family_visit'
  | 'outing'
  | 'home_visit'
  | 'emergency'
  | 'other';

// Absence entity type
export interface Absence {
  id: string;
  residentId: string;
  startDateTime: string;
  endDateTime: string;
  reason: AbsenceReason;
  customReason?: string;
  notes?: string;
  status: AbsenceStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
}

// API response types
export interface AbsenceListResponse {
  absences: Absence[];
  total: number;
  page: number;
  limit: number;
}

export interface AbsenceCreateResponse {
  success: boolean;
  absence?: Absence;
  error?: string;
}

// Search and filter types
export interface AbsenceSearchParams {
  query?: string;
  status?: AbsenceStatus;
  reason?: AbsenceReason;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Reason options
export const absenceReasonOptions = [
  {
    value: 'hospital_visit',
    label: '通院・受診',
    icon: 'Stethoscope',
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'family_visit',
    label: '家族との外出',
    icon: 'Users',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    value: 'outing',
    label: '外出・散歩',
    icon: 'MapPin',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  {
    value: 'home_visit',
    label: '一時帰宅',
    icon: 'Home',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    value: 'emergency',
    label: '緊急対応',
    icon: 'AlertTriangle',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  {
    value: 'other',
    label: 'その他',
    icon: 'FileText',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
] as const;

// Status options
export const absenceStatusOptions = [
  {
    value: 'scheduled',
    label: '予定',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    value: 'ongoing',
    label: '不在中',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  {
    value: 'completed',
    label: '帰所済み',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  {
    value: 'cancelled',
    label: 'キャンセル',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
] as const;
