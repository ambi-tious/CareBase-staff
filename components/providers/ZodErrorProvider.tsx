'use client';

import { setupZodErrorMap } from '@/lib/zod-error-map';
import { useEffect } from 'react';

/**
 * Zodのエラーメッセージを日本語に設定するプロバイダー
 */
export const ZodErrorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // アプリケーション起動時にZodエラーマップを設定
    setupZodErrorMap();
  }, []);

  return <>{children}</>;
};
