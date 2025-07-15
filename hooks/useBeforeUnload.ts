'use client';

import { useEffect } from 'react';

/**
 * ページ離脱時に確認ダイアログを表示するフック
 * @param shouldPrompt 確認ダイアログを表示するかどうか
 * @param message 確認ダイアログに表示するメッセージ
 */
export const useBeforeUnload = (shouldPrompt: boolean, message: string) => {
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!shouldPrompt) return;

      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldPrompt, message]);
};
