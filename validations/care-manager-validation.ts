import { z } from 'zod';

/**
 * ケアマネージャーフォームのバリデーションスキーマ
 */
export const careManagerFormSchema = z.object({
  name: z
    .string()
    .min(1, 'ケアマネージャー名は必須です')
    .max(50, 'ケアマネージャー名は50文字以内で入力してください'),
  officeName: z
    .string()
    .min(1, '事業所名は必須です')
    .max(100, '事業所名は100文字以内で入力してください'),
  phone: z
    .string()
    .max(20, '電話番号は20文字以内で入力してください')
    .optional()
    .or(z.literal('')),
  fax: z
    .string()
    .max(20, 'FAX番号は20文字以内で入力してください')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('正しいメールアドレスを入力してください')
    .max(100, 'メールアドレスは100文字以内で入力してください')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, '住所は200文字以内で入力してください')
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(500, '備考は500文字以内で入力してください')
    .optional()
    .or(z.literal('')),
});

/**
 * ケアマネージャー検索のバリデーションスキーマ
 */
export const careManagerSearchSchema = z.object({
  keyword: z.string().max(100, '検索キーワードは100文字以内で入力してください').optional(),
  isActive: z.boolean().optional(),
  officeName: z.string().max(100, '事業所名は100文字以内で入力してください').optional(),
});

/**
 * ケアマネージャーフォームのデータ型
 */
export type CareManagerFormData = z.infer<typeof careManagerFormSchema>;

/**
 * ケアマネージャー検索のデータ型
 */
export type CareManagerSearchData = z.infer<typeof careManagerSearchSchema>;

/**
 * エラーメッセージ定数
 */
export const CARE_MANAGER_VALIDATION_MESSAGES = {
  // 必須項目
  REQUIRED_NAME: 'ケアマネージャー名は必須です',
  REQUIRED_OFFICE_NAME: '事業所名は必須です',
  
  // 文字数制限
  NAME_TOO_LONG: 'ケアマネージャー名は50文字以内で入力してください',
  OFFICE_NAME_TOO_LONG: '事業所名は100文字以内で入力してください',
  PHONE_TOO_LONG: '電話番号は20文字以内で入力してください',
  FAX_TOO_LONG: 'FAX番号は20文字以内で入力してください',
  EMAIL_TOO_LONG: 'メールアドレスは100文字以内で入力してください',
  ADDRESS_TOO_LONG: '住所は200文字以内で入力してください',
  NOTES_TOO_LONG: '備考は500文字以内で入力してください',
  KEYWORD_TOO_LONG: '検索キーワードは100文字以内で入力してください',
  
  // フォーマット
  INVALID_EMAIL: '正しいメールアドレスを入力してください',
} as const;
