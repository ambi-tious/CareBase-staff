/**
 * Resident File Validation
 *
 * Zod schemas for resident file forms and API requests
 */

import { z } from 'zod';

// Resident file form data schema
export const residentFileFormSchema = z.object({
  category: z.enum(
    ['medical_record', 'care_plan', 'assessment', 'photo', 'family_document', 'insurance', 'other'],
    {
      required_error: 'カテゴリは必須です',
    }
  ),
  description: z.string().max(500, '説明は500文字以内で入力してください').optional(),
  tags: z.string().optional(),
});

export type ResidentFileFormData = z.infer<typeof residentFileFormSchema>;

// バリデーションヘルパー関数
export const validateResidentFileForm = (data: unknown) => {
  return residentFileFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const RESIDENT_FILE_ERROR_MESSAGES = {
  REQUIRED_CATEGORY: 'カテゴリは必須です',
  DESCRIPTION_TOO_LONG: '説明は500文字以内で入力してください',
  FILE_TOO_LARGE: 'ファイルサイズは10MB以下にしてください',
  UNSUPPORTED_FILE_TYPE: 'サポートされていないファイル形式です',
} as const;