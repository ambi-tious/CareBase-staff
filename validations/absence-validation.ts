/**
 * Absence Validation
 *
 * Zod schemas for absence forms and API requests
 */

import { z } from 'zod';

// Absence form data schema
export const absenceFormSchema = z
  .object({
    startDateTime: z
      .string()
      .min(1, '開始日時は必須です')
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, '有効な日時を入力してください'),
    endDateTime: z
      .string()
      .min(1, '終了日時は必須です')
      .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, '有効な日時を入力してください'),
    reason: z.enum(
      ['hospital_visit', 'family_visit', 'outing', 'home_visit', 'emergency', 'other'],
      {
        required_error: '不在理由は必須です',
      }
    ),
    customReason: z.string().max(100, 'カスタム理由は100文字以内で入力してください').optional(),
    notes: z.string().max(500, '備考は500文字以内で入力してください').optional(),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDateTime);
      const endDate = new Date(data.endDateTime);
      return endDate > startDate;
    },
    {
      message: '終了日時は開始日時より後の時刻を入力してください',
      path: ['endDateTime'],
    }
  )
  .refine(
    (data) => {
      if (data.reason === 'other') {
        return data.customReason && data.customReason.trim().length > 0;
      }
      return true;
    },
    {
      message: 'その他を選択した場合は、カスタム理由の入力が必要です',
      path: ['customReason'],
    }
  );

export type AbsenceFormData = z.infer<typeof absenceFormSchema>;

// バリデーションヘルパー関数
export const validateAbsenceForm = (data: unknown) => {
  return absenceFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const ABSENCE_ERROR_MESSAGES = {
  REQUIRED_START_DATETIME: '開始日時は必須です',
  REQUIRED_END_DATETIME: '終了日時は必須です',
  REQUIRED_REASON: '不在理由は必須です',
  REQUIRED_CUSTOM_REASON: 'その他を選択した場合は、カスタム理由の入力が必要です',
  INVALID_START_DATETIME: '有効な開始日時を入力してください',
  INVALID_END_DATETIME: '有効な終了日時を入力してください',
  INVALID_DATE_RANGE: '終了日時は開始日時より後の時刻を入力してください',
  CUSTOM_REASON_TOO_LONG: 'カスタム理由は100文字以内で入力してください',
  NOTES_TOO_LONG: '備考は500文字以内で入力してください',
} as const;