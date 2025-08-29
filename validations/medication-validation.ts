/**
 * Medication Validation
 *
 * Zod schemas for medication forms and API requests
 */

import { z } from 'zod';

// Medication form data schema
export const medicationFormSchema = z
  .object({
    medicationName: z
      .string()
      .min(1, '薬剤名は必須です')
      .max(100, '薬剤名は100文字以内で入力してください'),
    dosageInstructions: z.string().max(200, '用法・用量は200文字以内で入力してください').optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）')
      .optional()
      .or(z.literal('')),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, '有効な日付を入力してください（YYYY-MM-DD）')
      .optional()
      .or(z.literal('')),
    prescribingInstitution: z
      .string()
      .max(100, '処方医療機関は100文字以内で入力してください')
      .optional(),
    notes: z.string().max(500, 'メモは500文字以内で入力してください').optional(),
    thumbnailUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      return endDate >= startDate;
    },
    {
      message: '服用終了日は服用開始日以降の日付を入力してください',
      path: ['endDate'],
    }
  );

export type MedicationFormData = z.infer<typeof medicationFormSchema>;

// バリデーションヘルパー関数
export const validateMedicationForm = (data: unknown) => {
  return medicationFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const MEDICATION_ERROR_MESSAGES = {
  REQUIRED_MEDICATION_NAME: '薬剤名は必須です',
  MEDICATION_NAME_TOO_LONG: '薬剤名は100文字以内で入力してください',
  DOSAGE_INSTRUCTIONS_TOO_LONG: '用法・用量は200文字以内で入力してください',
  PRESCRIBING_INSTITUTION_TOO_LONG: '処方医療機関は100文字以内で入力してください',
  NOTES_TOO_LONG: 'メモは500文字以内で入力してください',
  INVALID_START_DATE: '有効な日付を入力してください（YYYY-MM-DD）',
  INVALID_END_DATE: '有効な日付を入力してください（YYYY-MM-DD）',
  INVALID_DATE_RANGE: '服用終了日は服用開始日以降の日付を入力してください',
} as const;
