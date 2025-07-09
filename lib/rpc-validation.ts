/**
 * RPC Validation
 * 
 * Common validation schemas for RPC communication
 * Ensures consistent validation between frontend and backend
 */

import { z } from 'zod';

// Common validation schemas
export const facilityIdSchema = z.string()
  .min(1, '施設IDは必須です')
  .max(50, '施設IDは50文字以内で入力してください')
  .regex(/^[a-zA-Z0-9_-]+$/, '施設IDは英数字、アンダースコア、ハイフンのみ使用可能です');

export const passwordSchema = z.string()
  .min(8, 'パスワードは8文字以上で入力してください')
  .max(128, 'パスワードは128文字以内で入力してください')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'パスワードは大文字、小文字、数字をそれぞれ1文字以上含む必要があります');

export const staffIdSchema = z.string()
  .min(1, '職員IDは必須です')
  .max(50, '職員IDは50文字以内で入力してください');

export const tokenSchema = z.string()
  .min(1, 'トークンは必須です')
  .regex(/^[A-Za-z0-9._-]+$/, '無効なトークン形式です');

// RPC request/response validation
export const rpcRequestSchema = z.object({
  method: z.string().min(1, 'メソッドは必須です'),
  params: z.any(),
  id: z.string().optional(),
  timestamp: z.string().optional(),
});

export const rpcResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.any()).optional(),
  }).optional(),
  id: z.string().optional(),
  timestamp: z.string().optional(),
});

// Common field validation
export const nameSchema = z.string()
  .min(1, '名前は必須です')
  .max(100, '名前は100文字以内で入力してください')
  .regex(/^[ぁ-んァ-ヶ一-龯々a-zA-Z\s]+$/, '名前は日本語、英字、スペースのみ使用可能です');

export const furiganaSchema = z.string()
  .min(1, 'フリガナは必須です')
  .max(100, 'フリガナは100文字以内で入力してください')
  .regex(/^[ァ-ヶ\s]+$/, 'フリガナはカタカナとスペースのみ使用可能です');

export const emailSchema = z.string()
  .email('有効なメールアドレスを入力してください')
  .max(254, 'メールアドレスは254文字以内で入力してください');

export const phoneSchema = z.string()
  .regex(/^[0-9\-\+\(\)\s]+$/, '電話番号は数字、ハイフン、括弧、スペースのみ使用可能です')
  .min(10, '電話番号は10文字以上で入力してください')
  .max(20, '電話番号は20文字以内で入力してください');

// Pagination validation
export const paginationSchema = z.object({
  page: z.number().min(1, 'ページ番号は1以上である必要があります').default(1),
  limit: z.number().min(1, '取得件数は1以上である必要があります').max(100, '取得件数は100以下である必要があります').default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  filters: z.record(z.any()).optional(),
});

// Date validation
export const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '日付はYYYY-MM-DD形式で入力してください')
  .refine((date) => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, '有効な日付を入力してください');

export const datetimeSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, '日時はISO8601形式で入力してください')
  .refine((datetime) => {
    const parsed = new Date(datetime);
    return !isNaN(parsed.getTime());
  }, '有効な日時を入力してください');

// Validation helper functions
export const validateRPCRequest = (data: unknown) => {
  return rpcRequestSchema.safeParse(data);
};

export const validateRPCResponse = (data: unknown) => {
  return rpcResponseSchema.safeParse(data);
};

export const validatePagination = (data: unknown) => {
  return paginationSchema.safeParse(data);
};