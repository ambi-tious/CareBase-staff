/**
 * Contact Schedule Validation
 *
 * Zod schemas for contact schedule forms and API requests
 */

import { z } from 'zod';

// Contact schedule form data schema
export const contactScheduleFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
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
  category: z.string({ required_error: 'カテゴリは必須です' }),
});

export type ContactScheduleFormData = z.infer<typeof contactScheduleFormSchema>;

// バリデーションヘルパー関数
export const validateContactScheduleForm = (data: unknown) => {
  return contactScheduleFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const CONTACT_SCHEDULE_ERROR_MESSAGES = {
  REQUIRED_TITLE: 'タイトルは必須です',
  REQUIRED_CONTENT: '内容は必須です',
  REQUIRED_TYPE: '種別は必須です',
  REQUIRED_PRIORITY: '重要度は必須です',
  REQUIRED_ASSIGNED_TO: '対象者は必須です',
  REQUIRED_DUE_DATE: '実施日は必須です',
  TITLE_TOO_LONG: 'タイトルは100文字以内で入力してください',
  CONTENT_TOO_LONG: '内容は1000文字以内で入力してください',
  REQUIRED_CATEGORY: 'カテゴリは必須です',
} as const;
