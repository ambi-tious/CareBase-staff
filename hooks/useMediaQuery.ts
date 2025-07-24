import { useState, useEffect } from 'react';

/**
 * メディアクエリの状態を監視するカスタムフック
 * @param query - CSSメディアクエリ文字列
 * @returns boolean - メディアクエリにマッチするかどうか
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // サーバーサイドレンダリング時は false を返す
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);

    // 初期値を設定
    setMatches(mediaQuery.matches);

    // リスナーを追加
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 新しいブラウザ
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // 古いブラウザ対応
      mediaQuery.addListener(handleChange);
    }

    // クリーンアップ
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [query]);

  return matches;
}

/**
 * よく使用されるブレークポイント用のプリセットフック
 */
export const useBreakpoint = () => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // 便利なヘルパー
    isMobileOrTablet: isMobile || isTablet,
    isTabletOrDesktop: isTablet || isDesktop,
  };
};

/**
 * デバイスの向きを監視するフック
 */
export const useOrientation = () => {
  const isPortrait = useMediaQuery('(orientation: portrait)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return {
    isPortrait,
    isLandscape,
  };
};

/**
 * ユーザーの設定を監視するフック
 */
export const useUserPreferences = () => {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const prefersHighContrast = useMediaQuery('(prefers-contrast: high)');
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  return {
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode,
  };
};
