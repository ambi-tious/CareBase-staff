/**
 * Handover Types
 *
 * Types for handover (申し送り) functionality
 */

import { z } from 'zod';

// Handover priority levels
export type HandoverPriority = 'high' | 'medium' | 'low';

// Handover status
export type HandoverStatus = 'unread' | 'read' | 'completed';

// Handover categories
export type HandoverCategory = 'medical' | 'care' | 'communication' | 'emergency' | 'family' | 'other';

// Category options
export const categoryOptions = [
  { value: 'medical', label: '医療', icon: 'Stethoscope', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'care', label: '介護', icon: 'Heart', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'communication', label: '連絡事項', icon: 'MessageCircle', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'emergency', label: '緊急', icon: 'AlertTriangle', color: 'bg-orange-100 text-orange-700 border-orange-200' },
  { value: 'family', label: '家族対応', icon: 'Users', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'other', label: 'その他', icon: 'FileText', color: 'bg-gray-100 text-gray-700 border-gray-200' },
] as const;

// Handover read status determination
export const isHandoverUnread = (handover: Handover): boolean => {
  return handover.status === 'unread' && !handover.readAt;
};

export const isHandoverRead = (handover: Handover): boolean => {
  return handover.status === 'read' && !!handover.readAt;
};

export const isHandoverCompleted = (handover: Handover): boolean => {
  return handover.status === 'completed' && !!handover.completedAt;
};

// Handover form data schema
export const handoverFormSchema = z.object({
  title: z.string().min(1, '件名は必須です').max(100, '件名は100文字以内で入力してください'),
  content: z.string().min(1, '内容は必須です').max(1000, '内容は1000文字以内で入力してください'),
  category: z.enum(['medical', 'care', 'communication', 'emergency', 'family', 'other'], {
    required_error: 'カテゴリは必須です',
  }),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: '重要度は必須です',
  }),
  targetStaffIds: z.array(z.string()).min(1, '申し送り先を選択してください'),
  residentId: z.string().optional(),
  scheduledDate: z.string().optional(),
  scheduledTime: z.string().optional(),
});

export type HandoverFormData = z.infer<typeof handoverFormSchema>;

// Handover entity type
export interface Handover {
  id: string;
  title: string;
  content: string;
  category: HandoverCategory;
  priority: HandoverPriority;
  status: HandoverStatus;
  createdBy: string;
  createdByName: string;
  targetStaffIds: string[];
  residentId?: string;
  residentName?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  completedAt?: string;
  isDraft?: boolean;
}

// API response types
export interface HandoverListResponse {
  handovers: Handover[];
  total: number;
  page: number;
  limit: number;
}

export interface HandoverCreateResponse {
  success: boolean;
  handover?: Handover;
  error?: string;
}

// Search and filter types
export interface HandoverSearchParams {
  query?: string;
  priority?: HandoverPriority;
  status?: HandoverStatus;
  createdBy?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Priority and status options
export const priorityOptions = [
  { value: 'high', label: '高', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'low', label: '低', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;

export const statusOptions = [
  { value: 'unread', label: '未読', color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'read', label: '既読', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'completed', label: '対応済み', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;