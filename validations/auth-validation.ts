/**
 * Authentication Validation
 *
 * Zod schemas for authentication forms and API requests
 * Compatible with CareBase-api validation requirements
 */

import { z } from 'zod';

// Common validation schemas
const facilityIdSchema = z
  .string()
  .min(1, '施設IDは必須です')
  .max(50, '施設IDは50文字以内で入力してください')
  .regex(/^[a-zA-Z0-9_-]+$/, '施設IDは英数字、アンダースコア、ハイフンのみ使用可能です');

const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上で入力してください')
  .max(128, 'パスワードは128文字以内で入力してください')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'パスワードは大文字、小文字、数字をそれぞれ1文字以上含む必要があります'
  );

const staffIdSchema = z
  .string()
  .min(1, '職員IDは必須です')
  .max(50, '職員IDは50文字以内で入力してください');

const tokenSchema = z
  .string()
  .min(1, 'トークンは必須です')
  .regex(/^[A-Za-z0-9._-]+$/, '無効なトークン形式です');

// Login form validation
export const loginFormSchema = z.object({
  facilityId: facilityIdSchema,
  password: passwordSchema,
});

export type LoginFormData = z.infer<typeof loginFormSchema>;

// Relaxed validation for development/testing
export const loginFormSchemaRelaxed = z.object({
  facilityId: z.string().min(1, '施設IDは必須です'),
  password: z.string().min(1, 'パスワードは必須です'),
});

// Staff selection validation
export const staffSelectionSchema = z.object({
  staffId: staffIdSchema,
  token: tokenSchema,
});

export type StaffSelectionData = z.infer<typeof staffSelectionSchema>;

// Password reset validation
export const passwordResetRequestSchema = z.object({
  facilityId: facilityIdSchema,
  email: z.string().email('有効なメールアドレスを入力してください'),
});

export const passwordResetSchema = z
  .object({
    token: tokenSchema,
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'パスワードが一致しません',
    path: ['confirmPassword'],
  });

// Authentication API request validation
export const authRequestSchema = z.object({
  facilityId: facilityIdSchema,
  password: passwordSchema,
});

export const authResponseSchema = z.object({
  success: z.boolean(),
  token: z.string().optional(),
  user: z
    .object({
      id: z.string(),
      facilityId: z.string(),
      role: z.enum(['staff', 'admin']),
      permissions: z.array(z.string()),
    })
    .optional(),
  error: z.string().optional(),
});

// Validation helper functions
export const validateLoginForm = (data: unknown) => {
  return loginFormSchema.safeParse(data);
};

export const validateLoginFormRelaxed = (data: unknown) => {
  return loginFormSchemaRelaxed.safeParse(data);
};

export const validateStaffSelection = (data: unknown) => {
  return staffSelectionSchema.safeParse(data);
};

export const validatePasswordResetRequest = (data: unknown) => {
  return passwordResetRequestSchema.safeParse(data);
};

export const validatePasswordReset = (data: unknown) => {
  return passwordResetSchema.safeParse(data);
};

export const validateAuthRequest = (data: unknown) => {
  return authRequestSchema.safeParse(data);
};

export const validateAuthResponse = (data: unknown) => {
  return authResponseSchema.safeParse(data);
};

// Field-specific validation functions
export const validateFacilityId = (facilityId: string) => {
  const result = facilityIdSchema.safeParse(facilityId);
  return {
    isValid: result.success,
    error: result.success ? null : result.error.errors[0]?.message || '無効な施設IDです',
  };
};

export const validatePassword = (password: string) => {
  const result = passwordSchema.safeParse(password);
  return {
    isValid: result.success,
    error: result.success ? null : result.error.errors[0]?.message || '無効なパスワードです',
  };
};

export const validateStaffId = (staffId: string) => {
  const result = staffIdSchema.safeParse(staffId);
  return {
    isValid: result.success,
    error: result.success ? null : result.error.errors[0]?.message || '無効な職員IDです',
  };
};

// Error message translations
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: '施設IDまたはパスワードが正しくありません',
  FACILITY_NOT_FOUND: '指定された施設が見つかりません',
  ACCOUNT_LOCKED: 'アカウントがロックされています。管理者にお問い合わせください',
  PASSWORD_EXPIRED: 'パスワードが期限切れです。新しいパスワードを設定してください',
  INVALID_TOKEN: '無効なトークンです',
  TOKEN_EXPIRED: 'セッションが期限切れです。再度ログインしてください',
  STAFF_NOT_FOUND: '指定された職員が見つかりません',
  INSUFFICIENT_PERMISSIONS: '権限が不足しています',
  NETWORK_ERROR: 'ネットワークエラーが発生しました。しばらく時間をおいてからお試しください',
  SERVER_ERROR: 'サーバーエラーが発生しました。しばらく時間をおいてからお試しください',
} as const;
