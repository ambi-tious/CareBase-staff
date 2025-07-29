/**
 * Care Record Validation
 *
 * Zod schemas for care record forms and API requests
 */

import { z } from 'zod';

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

// バリデーションヘルパー関数
export const validateCareRecordForm = (data: unknown) => {
  return careRecordFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const CARE_RECORD_ERROR_MESSAGES = {
  REQUIRED_RESIDENT: '利用者を選択してください',
  REQUIRED_CATEGORY: '記録種別は必須です',
  REQUIRED_TITLE: 'タイトルは必須です',
  REQUIRED_CONTENT: '内容は必須です',
  REQUIRED_RECORDED_AT: '記録日時は必須です',
  REQUIRED_PRIORITY: '重要度は必須です',
  TITLE_TOO_LONG: 'タイトルは100文字以内で入力してください',
  CONTENT_TOO_LONG: '内容は1000文字以内で入力してください',
} as const;
