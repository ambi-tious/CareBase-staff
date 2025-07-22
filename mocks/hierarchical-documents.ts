import type { Document, DocumentItem, Folder } from '@/types/document';

// ルートフォルダ
export const rootFolders: Folder[] = [
  {
    id: 'folder-1',
    name: '議事録',
    type: 'folder',
    parentId: null,
    path: ['folder-1'],
    createdAt: '2025-01-15',
    updatedAt: '2025-01-20',
    createdBy: '管理者',
  },
  {
    id: 'folder-2',
    name: 'ヒヤリハット',
    type: 'folder',
    parentId: null,
    path: ['folder-2'],
    createdAt: '2025-01-10',
    updatedAt: '2025-01-18',
    createdBy: '管理者',
  },
  {
    id: 'folder-3',
    name: '事故報告書',
    type: 'folder',
    parentId: null,
    path: ['folder-3'],
    createdAt: '2025-01-05',
    updatedAt: '2025-01-15',
    createdBy: '管理者',
  },
  {
    id: 'folder-4',
    name: '行事企画書',
    type: 'folder',
    parentId: null,
    path: ['folder-4'],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-10',
    createdBy: '管理者',
  },
];

// サブフォルダ
export const subFolders: Folder[] = [
  // 議事録のサブフォルダ
  {
    id: 'folder-1-1',
    name: '2025年度会議',
    type: 'folder',
    parentId: 'folder-1',
    path: ['folder-1', 'folder-1-1'],
    createdAt: '2025-01-15',
    updatedAt: '2025-01-20',
    createdBy: '管理者',
  },
  {
    id: 'folder-1-2',
    name: 'スタッフ会議',
    type: 'folder',
    parentId: 'folder-1',
    path: ['folder-1', 'folder-1-2'],
    createdAt: '2025-01-10',
    updatedAt: '2025-01-18',
    createdBy: '管理者',
  },

  // 2025年度会議のサブフォルダ
  {
    id: 'folder-1-1-1',
    name: '第1四半期',
    type: 'folder',
    parentId: 'folder-1-1',
    path: ['folder-1', 'folder-1-1', 'folder-1-1-1'],
    createdAt: '2025-01-15',
    updatedAt: '2025-01-20',
    createdBy: '管理者',
  },
  {
    id: 'folder-1-1-2',
    name: '第2四半期',
    type: 'folder',
    parentId: 'folder-1-1',
    path: ['folder-1', 'folder-1-1', 'folder-1-1-2'],
    createdAt: '2025-01-10',
    updatedAt: '2025-01-18',
    createdBy: '管理者',
  },

  // ヒヤリハットのサブフォルダ
  {
    id: 'folder-2-1',
    name: '2025年1月',
    type: 'folder',
    parentId: 'folder-2',
    path: ['folder-2', 'folder-2-1'],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-20',
    createdBy: '管理者',
  },
];

// 文書
export const documents: Document[] = [
  // ルートフォルダの文書
  {
    id: 'doc-1',
    name: '文書管理規定.pdf',
    type: 'document',
    size: '1.5 MB',
    fileType: 'pdf',
    category: 'その他',
    status: 'published',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15',
    createdBy: '管理者',
  },

  // 議事録フォルダの文書
  {
    id: 'doc-2',
    name: '議事録テンプレート.docx',
    type: 'document',
    size: '0.8 MB',
    fileType: 'doc',
    category: '議事録',
    status: 'published',
    createdAt: '2025-01-10',
    updatedAt: '2025-01-10',
    createdBy: '管理者',
  },

  // 2025年度会議フォルダの文書
  {
    id: 'doc-3',
    name: '第1回運営会議議事録.pdf',
    type: 'document',
    size: '2.3 MB',
    fileType: 'pdf',
    category: '議事録',
    status: 'published',
    createdAt: '2025-01-20',
    updatedAt: '2025-01-20',
    createdBy: '田中 花子',
  },
  {
    id: 'doc-4',
    name: '月次報告会議事録.docx',
    type: 'document',
    size: '1.8 MB',
    fileType: 'doc',
    category: '議事録',
    status: 'published',
    createdAt: '2025-01-18',
    updatedAt: '2025-01-18',
    createdBy: '佐藤 太郎',
  },

  // 第1四半期フォルダの文書
  {
    id: 'doc-5',
    name: '4月定例会議.pdf',
    type: 'document',
    size: '1.2 MB',
    fileType: 'pdf',
    category: '議事録',
    status: 'published',
    createdAt: '2025-04-10',
    updatedAt: '2025-04-10',
    createdBy: '山田 美咲',
  },
  {
    id: 'doc-6',
    name: '5月定例会議.pdf',
    type: 'document',
    size: '1.3 MB',
    fileType: 'pdf',
    category: '議事録',
    status: 'published',
    createdAt: '2025-05-10',
    updatedAt: '2025-05-10',
    createdBy: '山田 美咲',
  },
  {
    id: 'doc-7',
    name: '6月定例会議.pdf',
    type: 'document',
    size: '1.4 MB',
    fileType: 'pdf',
    category: '議事録',
    status: 'published',
    createdAt: '2025-06-10',
    updatedAt: '2025-06-10',
    createdBy: '山田 美咲',
  },

  // ヒヤリハットフォルダの文書
  {
    id: 'doc-8',
    name: 'ヒヤリハット報告書テンプレート.xlsx',
    type: 'document',
    size: '0.5 MB',
    fileType: 'xlsx',
    category: 'ヒヤリハット',
    status: 'published',
    createdAt: '2025-01-05',
    updatedAt: '2025-01-05',
    createdBy: '管理者',
  },

  // 2025年1月フォルダの文書
  {
    id: 'doc-9',
    name: 'ヒヤリハット報告_転倒リスク.pdf',
    type: 'document',
    size: '1.2 MB',
    fileType: 'pdf',
    category: 'ヒヤリハット',
    status: 'published',
    createdAt: '2025-01-19',
    updatedAt: '2025-01-19',
    createdBy: '山田 美咲',
  },
  {
    id: 'doc-10',
    name: 'ヒヤリハット報告_薬剤管理.pdf',
    type: 'document',
    size: '0.9 MB',
    fileType: 'pdf',
    category: 'ヒヤリハット',
    status: 'published',
    createdAt: '2025-01-17',
    updatedAt: '2025-01-17',
    createdBy: '鈴木 一郎',
  },
];

// 指定されたフォルダIDに基づいてフォルダとドキュメントを取得する関数
export const getFolderContents = (folderId: string | null): DocumentItem[] => {
  // ルートフォルダの場合
  if (folderId === null) {
    return [
      ...rootFolders,
      ...documents.filter((doc) => !doc.category || doc.category === 'その他'),
    ];
  }

  // サブフォルダとドキュメントを取得
  const childFolders = subFolders.filter((folder) => folder.parentId === folderId);
  const folderDocs = documents.filter((doc) => {
    // フォルダに対応するカテゴリの文書を取得
    // 実際のアプリケーションでは、文書に親フォルダIDを持たせるべき
    const folder = [...rootFolders, ...subFolders].find((f) => f.id === folderId);
    if (!folder) return false;

    // ここでは簡易的にフォルダ名とカテゴリ名が一致する文書を返す
    // 実際のアプリケーションでは、文書に親フォルダIDを持たせるべき
    if (folder.name === doc.category) return true;

    // 特定のフォルダIDに対応する文書を手動で返す
    if ((folderId === 'folder-1-1' && doc.id === 'doc-3') || doc.id === 'doc-4') return true;
    if (
      folderId === 'folder-1-1-1' &&
      (doc.id === 'doc-5' || doc.id === 'doc-6' || doc.id === 'doc-7')
    )
      return true;
    if (folderId === 'folder-2-1' && (doc.id === 'doc-9' || doc.id === 'doc-10')) return true;

    return false;
  });

  return [...childFolders, ...folderDocs];
};

// フォルダパスを取得する関数
export const getFolderPath = (folderId: string | null): { id: string; name: string }[] => {
  if (folderId === null) {
    return [{ id: 'root', name: 'ホーム' }];
  }

  const folder = [...rootFolders, ...subFolders].find((f) => f.id === folderId);
  if (!folder) return [{ id: 'root', name: 'ホーム' }];

  const path = [{ id: 'root', name: 'ホーム' }];

  for (const id of folder.path) {
    const pathFolder = [...rootFolders, ...subFolders].find((f) => f.id === id);
    if (pathFolder) {
      path.push({ id: pathFolder.id, name: pathFolder.name });
    }
  }

  return path;
};

// フォルダを取得する関数
export const getFolder = (folderId: string | null): Folder | null => {
  if (folderId === null) return null;

  return [...rootFolders, ...subFolders].find((f) => f.id === folderId) || null;
};

// フォルダ作成関数
export const createFolder = (name: string, parentId: string | null): Folder => {
  const newFolderId = `folder-${Date.now()}`;
  const parentFolder = parentId ? getFolder(parentId) : null;
  const path = parentFolder ? [...parentFolder.path, newFolderId] : [newFolderId];

  const newFolder: Folder = {
    id: newFolderId,
    name,
    type: 'folder',
    parentId,
    path,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0],
    createdBy: '現在のユーザー',
  };

  // 親フォルダに応じて適切な配列に追加
  if (parentId === null) {
    rootFolders.push(newFolder);
  } else {
    subFolders.push(newFolder);
  }

  return newFolder;
};

// フォルダ更新関数
export const updateFolder = (folderId: string, name: string): boolean => {
  // ルートフォルダから検索
  const rootIndex = rootFolders.findIndex((f) => f.id === folderId);
  if (rootIndex !== -1) {
    rootFolders[rootIndex] = {
      ...rootFolders[rootIndex],
      name,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return true;
  }

  // サブフォルダから検索
  const subIndex = subFolders.findIndex((f) => f.id === folderId);
  if (subIndex !== -1) {
    subFolders[subIndex] = {
      ...subFolders[subIndex],
      name,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return true;
  }

  return false;
};

// フォルダ削除関数
export const deleteFolder = (folderId: string): boolean => {
  // 子フォルダとドキュメントがあるかチェック
  const hasChildren = subFolders.some((f) => f.parentId === folderId);
  const hasDocuments = documents.some((doc) => {
    const folder = [...rootFolders, ...subFolders].find((f) => f.id === folderId);
    return folder && doc.category === folder.name;
  });

  if (hasChildren || hasDocuments) {
    // 子要素がある場合は削除できない（実際のアプリケーションでは警告を表示）
    console.warn('フォルダに子要素があるため削除できません');
  }

  // ルートフォルダから削除
  const rootIndex = rootFolders.findIndex((f) => f.id === folderId);
  if (rootIndex !== -1) {
    rootFolders.splice(rootIndex, 1);
    return true;
  }

  // サブフォルダから削除
  const subIndex = subFolders.findIndex((f) => f.id === folderId);
  if (subIndex !== -1) {
    subFolders.splice(subIndex, 1);
    return true;
  }

  return false;
};

// 現在のフォルダ内の既存フォルダ名一覧を取得
export const getExistingFolderNames = (parentId: string | null): string[] => {
  if (parentId === null) {
    return rootFolders.map((f) => f.name);
  }

  return subFolders.filter((f) => f.parentId === parentId).map((f) => f.name);
};
