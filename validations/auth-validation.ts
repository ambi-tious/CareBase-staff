/**
 * Authentication Validation
 *
 * Zod schemas for authentication forms and API requests
 * Compatible with CareBase-api validation requirements
 */

import { z } from 'zod';

// ログイン認証情報のスキーマ
export const loginCredentialsSchema = z.object({
  login_id: z.string().min(1, 'ログインIDは必須です').trim(),
  password: z.string().min(1, 'パスワードは必須です').trim(),
});

// ログインフォームの状態スキーマ
export const loginFormStateSchema = z.object({
  facilityId: z.string(),
  password: z.string(),
  isLoading: z.boolean(),
  error: z.string().nullable(),
  success: z.boolean(),
});

// 型定義は @/types/auth からインポート

// バリデーション関数
export const validateLoginForm = (data: unknown) => {
  return loginCredentialsSchema.safeParse(data);
};

// 個別フィールドのバリデーション関数
export const validateLoginId = (value: string) => {
  const result = loginCredentialsSchema.shape.login_id.safeParse(value);
  return {
    success: result.success,
    error: result.success ? null : result.error.errors[0]?.message || 'ログインIDが無効です',
  };
};

export const validatePassword = (value: string) => {
  const result = loginCredentialsSchema.shape.password.safeParse(value);
  return {
    success: result.success,
    error: result.success ? null : result.error.errors[0]?.message || 'パスワードが無効です',
  };
};

// 認証エラーメッセージ
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: '施設IDまたはパスワードが正しくありません',
  NETWORK_ERROR: 'ネットワークエラーが発生しました。インターネット接続を確認してください',
  STAFF_NOT_FOUND: '指定されたスタッフが見つかりません',
  TOKEN_EXPIRED: 'セッションが期限切れです。再度ログインしてください',
  UNAUTHORIZED: '認証が必要です',
  SERVER_ERROR: 'サーバーエラーが発生しました。しばらく時間をおいて再度お試しください',
} as const;
