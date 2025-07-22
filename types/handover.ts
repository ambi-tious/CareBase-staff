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

// Handover form data schema
export const handoverFormSchema = z.object({
  title: z.string().min(1, '件名は必須です').max(100, '件名は100文字以内で入力してください'),
  content: z.string().min(1, '内容は必須です').max(1000, '内容は1000文字以内で入力してください'),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: '重要度は必須です',
  }),
  targetStaffIds: z.array(z.string()).min(1, '申し送り先を選択してください'),
  residentId: z.string().optional(),
});

export type HandoverFormData = z.infer<typeof handoverFormSchema>;

// Handover entity type
export interface Handover {
  id: string;
  title: string;
  content: string;
  priority: HandoverPriority;
  status: HandoverStatus;
  createdBy: string;
  createdByName: string;
  targetStaffIds: string[];
  residentId?: string;
  residentName?: string;
  createdAt: string;
  updatedAt: string;
  readAt?: string;
  completedAt?: string;
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