/**
 * Medication Status Validation
 *
 * Zod schemas for medication status forms and API requests
 */

import { z } from 'zod';

// Medication status form data schema
export const medicationStatusFormSchema = z
  .object({
    date: z
      .string()
      .min(1, '登録日は必須です')
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）'),
    content: z.string().min(1, '内容は必須です').max(500, '内容は500文字以内で入力してください'),
    notes: z.string().max(1000, 'メモは1000文字以内で入力してください').optional(),
  })
  .refine(
    (data) => {
      // 登録日が未来の日付でないかチェック
      const registrationDate = new Date(data.date);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // 今日の終わりまでは許可
      return registrationDate <= today;
    },
    {
      message: '登録日は今日以前の日付を入力してください',
      path: ['date'],
    }
  );

export type MedicationStatusFormData = z.infer<typeof medicationStatusFormSchema>;

// バリデーションヘルパー関数
export const validateMedicationStatusForm = (data: unknown) => {
  return medicationStatusFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const MEDICATION_STATUS_ERROR_MESSAGES = {
  REQUIRED_DATE: '登録日は必須です',
  REQUIRED_CONTENT: '内容は必須です',
  INVALID_DATE: '有効な日付を入力してください（YYYY-MM-DD）',
  FUTURE_DATE: '登録日は今日以前の日付を入力してください',
  CONTENT_TOO_LONG: '内容は500文字以内で入力してください',
  NOTES_TOO_LONG: 'メモは1000文字以内で入力してください',
} as const;
