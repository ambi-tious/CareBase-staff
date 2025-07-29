/**
 * Document Validation
 *
 * Zod schemas for document forms and API requests
 */

import { z } from 'zod';

// ドキュメントフォーム用のZodスキーマ
export const documentFormSchema = z.object({
  title: z
    .string()
    .min(1, '書類タイトルは必須です')
    .max(100, '書類タイトルは100文字以内で入力してください'),
  category: z.string().min(1, 'カテゴリは必須です'),
  description: z.string(),
  status: z.enum(['draft', 'published', 'archived'], {
    errorMap: () => ({ message: 'ステータスは必須です' }),
  }),
  tags: z.string(),
  folderId: z.string().optional(),
});

export type DocumentFormData = z.infer<typeof documentFormSchema>;

// バリデーションヘルパー関数
export const validateDocumentForm = (data: unknown) => {
  return documentFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const DOCUMENT_ERROR_MESSAGES = {
  REQUIRED_TITLE: '書類タイトルは必須です',
  REQUIRED_CATEGORY: 'カテゴリは必須です',
  REQUIRED_STATUS: 'ステータスは必須です',
  TITLE_TOO_LONG: '書類タイトルは100文字以内で入力してください',
} as const;
