/**
 * Handover Validation
 *
 * Zod schemas for handover forms and API requests
 */

import { z } from 'zod';

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

// バリデーションヘルパー関数
export const validateHandoverForm = (data: unknown) => {
  return handoverFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const HANDOVER_ERROR_MESSAGES = {
  REQUIRED_TITLE: '件名は必須です',
  REQUIRED_CONTENT: '内容は必須です',
  REQUIRED_CATEGORY: 'カテゴリは必須です',
  REQUIRED_PRIORITY: '重要度は必須です',
  REQUIRED_TARGET_STAFF: '申し送り先を選択してください',
  TITLE_TOO_LONG: '件名は100文字以内で入力してください',
  CONTENT_TOO_LONG: '内容は1000文字以内で入力してください',
} as const;
