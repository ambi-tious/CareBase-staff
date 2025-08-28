/**
 * Individual Point Validation
 *
 * Zod schemas for individual point forms and API requests
 */

import { z } from 'zod';

// Individual point form data schema
export const individualPointFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(100, 'タイトルは100文字以内で入力してください'),
  content: z.string().min(1, '内容は必須です').max(1000, '内容は1000文字以内で入力してください'),
  category: z.enum(
    ['meal', 'bathing', 'medication', 'excretion', 'vital', 'exercise', 'communication', 'other'],
    {
      required_error: 'カテゴリは必須です',
    }
  ),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: '優先度は必須です',
  }),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

export type IndividualPointFormData = z.infer<typeof individualPointFormSchema>;

// Category form data schema
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名は必須です')
    .max(50, 'カテゴリ名は50文字以内で入力してください'),
  description: z.string().max(200, '説明は200文字以内で入力してください').optional(),
  icon: z.string().min(1, 'アイコンは必須です'),
  color: z.string().min(1, '色は必須です'),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

// バリデーションヘルパー関数
export const validateIndividualPointForm = (data: unknown) => {
  return individualPointFormSchema.safeParse(data);
};

export const validateCategoryForm = (data: unknown) => {
  return categoryFormSchema.safeParse(data);
};

// エラーメッセージ定数
export const INDIVIDUAL_POINT_ERROR_MESSAGES = {
  REQUIRED_TITLE: 'タイトルは必須です',
  REQUIRED_CONTENT: '内容は必須です',
  REQUIRED_CATEGORY: 'カテゴリは必須です',
  REQUIRED_PRIORITY: '優先度は必須です',
  TITLE_TOO_LONG: 'タイトルは100文字以内で入力してください',
  CONTENT_TOO_LONG: '内容は1000文字以内で入力してください',
  REQUIRED_CATEGORY_NAME: 'カテゴリ名は必須です',
  REQUIRED_ICON: 'アイコンは必須です',
  REQUIRED_COLOR: '色は必須です',
  CATEGORY_NAME_TOO_LONG: 'カテゴリ名は50文字以内で入力してください',
  DESCRIPTION_TOO_LONG: '説明は200文字以内で入力してください',
} as const;
