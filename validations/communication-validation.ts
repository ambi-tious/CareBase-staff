/**
 * Communication Validation
 *
 * Zod schemas for communication record forms and API requests
 */

import { z } from 'zod';

// Communication record form data schema
export const communicationFormSchema = z.object({
  datetime: z
    .string()
    .min(1, '日時は必須です')
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, '有効な日時を入力してください'),
  staffId: z.string().min(1, '対応者（職員）は必須です'),
  contactPersonId: z.string().optional(),
  contactPersonName: z
    .string()
    .min(1, '連絡者は必須です')
    .max(50, '連絡者名は50文字以内で入力してください'),
  contactPersonType: z.enum(['family', 'manual'], {
    required_error: '連絡者タイプは必須です',
  }),
  communicationContent: z
    .string()
    .min(1, 'コミュニケーション内容は必須です')
    .max(2000, 'コミュニケーション内容は2000文字以内で入力してください'),
  responseContent: z
    .string()
    .min(1, '対応内容・備考は必須です')
    .max(2000, '対応内容・備考は2000文字以内で入力してください'),
  isImportant: z.boolean(),
  threadId: z.string().optional(),
  parentId: z.string().optional(),
});

export type CommunicationFormData = z.infer<typeof communicationFormSchema>;

// バリデーションヘルパー関数
export const validateCommunicationForm = (data: unknown) => {
  return communicationFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const COMMUNICATION_ERROR_MESSAGES = {
  REQUIRED_DATETIME: '日時は必須です',
  REQUIRED_STAFF_ID: '対応者（職員）は必須です',
  REQUIRED_CONTACT_PERSON_NAME: '連絡者は必須です',
  REQUIRED_COMMUNICATION_CONTENT: 'コミュニケーション内容は必須です',
  REQUIRED_RESPONSE_CONTENT: '対応内容・備考は必須です',
  INVALID_DATETIME: '有効な日時を入力してください',
  CONTACT_PERSON_NAME_TOO_LONG: '連絡者名は50文字以内で入力してください',
  COMMUNICATION_CONTENT_TOO_LONG: 'コミュニケーション内容は2000文字以内で入力してください',
  RESPONSE_CONTENT_TOO_LONG: '対応内容・備考は2000文字以内で入力してください',
} as const;
