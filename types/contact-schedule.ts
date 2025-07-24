/**
 * Contact Schedule Types
 *
 * Types for contact schedule functionality
 */

import { z } from 'zod';

// Contact schedule types
export type ContactScheduleType = 'contact' | 'schedule' | 'handover';
export type ContactSchedulePriority = 'high' | 'medium' | 'low';
export type ContactScheduleStatus = 'pending' | 'confirmed' | 'completed';

// Contact schedule form data schema
export const contactScheduleFormSchema = z.object({
  title: z.string().min(1, 'タイトルは必須です').max(100, 'タイトルは100文字以内で入力してください'),
  content: z.string().min(1, '内容は必須です').max(1000, '内容は1000文字以内で入力してください'),
  type: z.enum(['contact', 'schedule', 'handover'], {
    required_error: '種別は必須です',
  }),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: '重要度は必須です',
  }),
  assignedTo: z.string().min(1, '対象者は必須です'),
  dueDate: z.string().min(1, '実施日は必須です'),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  relatedResidentId: z.string().optional(),
  tags: z.string().optional(),
});

export type ContactScheduleFormData = z.infer<typeof contactScheduleFormSchema>;

// Type options
export const typeOptions = [
  { value: 'contact', label: '連絡事項', icon: 'MessageCircle', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'schedule', label: '予定', icon: 'Calendar', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'handover', label: '申し送り', icon: 'MessageSquare', color: 'bg-purple-100 text-purple-700 border-purple-200' },
] as const;

export const priorityOptions = [
  { value: 'high', label: '高', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'medium', label: '中', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'low', label: '低', color: 'bg-blue-100 text-blue-700 border-blue-200' },
] as const;

export const statusOptions = [
  { value: 'pending', label: '未対応', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'confirmed', label: '確認済み', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'completed', label: '完了', color: 'bg-green-100 text-green-700 border-green-200' },
] as const;

// Assignment target options
export const assignmentOptions = [
  { value: 'all-staff', label: '全職員' },
  { value: 'group-1', label: '介護フロア A' },
  { value: 'group-2', label: '介護フロア B' },
  { value: 'group-3', label: '管理部門' },
  { value: 'recreation-team', label: 'レクリエーション担当' },
  { value: 'training-group', label: '研修担当' },
] as const;