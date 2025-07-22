import { getFolderPath } from '@/mocks/hierarchical-documents';

/**
 * フォルダIDからカテゴリを自動判定する関数
 */
export const getCategoryFromFolderId = (folderId: string | null): string => {
  if (!folderId) return 'その他';

  try {
    // フォルダパスを取得
    const folderPath = getFolderPath(folderId);

    // ルートフォルダ（最初の階層）からカテゴリを判定
    const rootFolder = folderPath.find((item) => item.id !== 'root');

    if (!rootFolder) return 'その他';

    // フォルダ名とカテゴリのマッピング
    const folderCategoryMap: Record<string, string> = {
      議事録: '議事録',
      ヒヤリハット: 'ヒヤリハット',
      事故報告書: '事故報告書',
      行事企画書: '行事企画書',
    };

    return folderCategoryMap[rootFolder.name] || 'その他';
  } catch (error) {
    console.error('Failed to get category from folder:', error);
    return 'その他';
  }
};

/**
 * URLパラメータからフォルダIDを取得する関数
 */
export const getFolderIdFromSearchParams = (searchParams: URLSearchParams): string | null => {
  return searchParams.get('folder') || searchParams.get('folderId') || null;
};

/**
 * カテゴリ表示名を取得する関数
 */
export const getCategoryDisplayName = (category: string): string => {
  const categoryDisplayMap: Record<string, string> = {
    議事録: '議事録',
    ヒヤリハット: 'ヒヤリハット',
    事故報告書: '事故報告書',
    行事企画書: '行事企画書',
    その他: 'その他',
  };

  return categoryDisplayMap[category] || category;
};
