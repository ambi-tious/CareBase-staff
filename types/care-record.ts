/**
 * Care Record Types
 *
 * Types for care record management
 */

import { z } from 'zod';

// Care record categories
export type CareRecordCategory =
  | 'meal'
  | 'bathing'
  | 'medication'
  | 'excretion'
  | 'vital'
  | 'exercise'
  | 'communication'
  | 'other';

// Care record status
export type CareRecordStatus = 'draft' | 'completed' | 'reviewed';

// Care record priority
export type CareRecordPriority = 'high' | 'medium' | 'low';

// Care record form data schema
export const careRecordFormSchema = z.object({
  residentId: z.string().min(1, '利用者を選択してください'),
  category: z.enum(
    ['meal', 'bathing', 'medication', 'excretion', 'vital', 'exercise', 'communication', 'other'],
    {
      required_error: '記録種別は必須です',
    }
  ),
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  content: z.string().min(1, '内容は必須です').max(1000, '内容は1000文字以内で入力してください'),
  recordedAt: z.string().min(1, '記録日時は必須です'),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: '重要度は必須です',
  }),
  status: z.enum(['draft', 'completed', 'reviewed']).default('completed'),
});

export type CareRecordFormData = z.infer<typeof careRecordFormSchema>;

// Care record entity type
export interface CareRecord {
  id: string;
  residentId: string;
  residentName: string;
  category: CareRecordCategory;
  title: string;
  content: string;
  summary: string; // 概要（50文字程度）
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  createdByName: string;
  priority: CareRecordPriority;
  status: CareRecordStatus;
}

// API response types
export interface CareRecordListResponse {
  records: CareRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CareRecordCreateResponse {
  success: boolean;
  record?: CareRecord;
  error?: string;
}

// Search and filter types
export interface CareRecordSearchParams {
  query?: string;
  residentName?: string;
  category?: CareRecordCategory;
  priority?: CareRecordPriority;
  status?: CareRecordStatus;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Category options
export const categoryOptions = [
  {
    value: 'meal',
    label: '食事',
    icon: 'Utensils',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  {
    value: 'bathing',
    label: '入浴',
    icon: 'Bath',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  {
    value: 'medication',
    label: '服薬',
    icon: 'Pill',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  {
    value: 'excretion',
    label: '排泄',
    icon: 'ExcretionIcon',
    color: 'bg-brown-100 text-brown-700 border-brown-200',
  },
  {
    value: 'vital',
    label: 'バイタル',
    icon: 'Activity',
    color: 'bg-red-100 text-red-700 border-red-200',
  },
  {
    value: 'exercise',
    label: '運動',
    icon: 'Dumbbell',
    color: 'bg-green-100 text-green-700 border-green-200',
  },
  {
    value: 'communication',
    label: 'コミュニケーション',
    icon: 'MessageCircle',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
  {
    value: 'other',
    label: 'その他',
    icon: 'FileText',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
  },
] as const;

// Priority options
export const priorityOptions = [
  { value: 'high', label: '高', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'low', label: '低', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;

// Status options
export const statusOptions = [
  { value: 'draft', label: '下書き', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'completed', label: '完了', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'reviewed', label: '確認済み', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;
