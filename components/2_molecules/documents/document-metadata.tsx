'use client';

import { DocumentInfoRow } from '@/components/1_atoms/documents/document-info-row';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFolderPath } from '@/mocks/hierarchical-documents';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type React from 'react';

interface DocumentMetadataProps {
  documentId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  category: string;
  tags?: string[];
  className?: string;
  folderId?: string | null; // 書類が保存されているフォルダID
}

export const DocumentMetadata: React.FC<DocumentMetadataProps> = ({
  documentId,
  createdAt,
  updatedAt,
  createdBy,
  category,
  tags = [],
  className,
  folderId,
}) => {
  const formatDate = (date: Date) => {
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  // フォルダパスを取得して表示文字列を生成
  const getFolderPathDisplay = () => {
    if (!folderId) return 'ルート';

    try {
      const folderPath = getFolderPath(folderId);
      return (
        folderPath
          .filter((item) => item.id !== 'root')
          .map((item) => item.name)
          .join(' > ') || 'ルート'
      );
    } catch (error) {
      console.error('Failed to get folder path:', error);
      return 'ルート';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">文書情報</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-0">
          <DocumentInfoRow label="書類番号" value={documentId} />
          <DocumentInfoRow label="保存場所" value={getFolderPathDisplay()} />
          <DocumentInfoRow label="カテゴリ" value={category} />
          <DocumentInfoRow label="作成者" value={`${createdBy.name} (${createdBy.role})`} />
          <DocumentInfoRow label="作成日時" value={formatDate(createdAt)} />
          <DocumentInfoRow label="最終更新" value={formatDate(updatedAt)} />
          <DocumentInfoRow
            label="タグ"
            value={
              tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                '設定なし'
              )
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
