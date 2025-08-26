/**
 * Contact Validation
 *
 * Zod schemas for contact forms and API requests
 */

import { z } from 'zod';

// Contact form data schema
export const contactFormSchema = z.object({
  name: z.string().min(1, '氏名は必須です').max(50, '氏名は50文字以内で入力してください'),
  furigana: z.string().optional(),
  relationship: z.string().optional(),
  phone1: z.string().optional(),
  phone2: z.string().optional(),
  email: z.string().email('有効なメールアドレスを入力してください').optional().or(z.literal('')),
  address: z.string().optional(),
  notes: z.string().optional(),
  type: z.enum(['緊急連絡先', '連絡先', 'その他']),
  hasAlert: z.boolean().optional(),
  alertReason: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// バリデーションヘルパー関数
export const validateContactForm = (data: unknown) => {
  return contactFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const CONTACT_ERROR_MESSAGES = {
  REQUIRED_NAME: '氏名は必須です',
  REQUIRED_RELATIONSHIP: '続柄は必須です',
  REQUIRED_PHONE1: '連絡先は必須です',
  NAME_TOO_LONG: '氏名は50文字以内で入力してください',
  RELATIONSHIP_TOO_LONG: '続柄は30文字以内で入力してください',
  INVALID_PHONE: '有効な電話番号を入力してください',
  INVALID_EMAIL: '有効なメールアドレスを入力してください',
} as const;
