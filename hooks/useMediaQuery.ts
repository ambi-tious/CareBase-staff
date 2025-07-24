'use client';

import { useEffect, useState } from 'react';

/**
 * メディアクエリの状態を監視するカスタムフック
 * @param query - メディアクエリ文字列
 * @returns マッチ状態のboolean値
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // サーバーサイドレンダリング時は false を返す
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // 初期状態を設定
    setMatches(mediaQuery.matches);

    // リスナーを追加
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // クリーンアップ
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};