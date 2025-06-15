import { AxiosError } from 'axios';
import type { ApiError } from '@/types/api';

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    
    if (apiError?.error) {
      return apiError.error;
    }
    
    switch (error.response?.status) {
      case 401:
        return '認証が必要です。ログインしてください。';
      case 403:
        return 'アクセス権限がありません。';
      case 404:
        return 'リソースが見つかりません。';
      case 500:
        return 'サーバーエラーが発生しました。';
      default:
        return 'ネットワークエラーが発生しました。';
    }
  }
  
  return '予期しないエラーが発生しました。';
}

export function isNetworkError(error: unknown): boolean {
  return error instanceof AxiosError && !error.response;
}

export function getErrorStatus(error: unknown): number | null {
  if (error instanceof AxiosError && error.response) {
    return error.response.status;
  }
  return null;
}
