'use client';

import type { DocumentFormData } from '@/components/2_molecules/documents/document-form-fields';
import { DocumentFormEditor } from '@/components/3_organisms/documents/document-form-editor';
import { useSearchParams } from 'next/navigation';
import React from 'react';

interface PageProps {
  params: Promise<{
    id?: string[];
  }>;
}

export default function DocumentEditPage({ params }: PageProps) {
  const searchParams = useSearchParams();

  // URLパラメータからドキュメントIDを取得
  const resolvedParams = React.use(params);
  const documentId = resolvedParams.id?.[0];

  // URLクエリパラメータからフォルダIDを取得
  const folderId = searchParams.get('folder') || searchParams.get('folderId');

  // 編集モードの場合のモックデータ読み込み
  // 実際のアプリケーションではAPIからデータを取得
  const initialDocument = documentId
    ? {
        id: documentId,
        title: 'サンプル書類タイトル',
        content: '<p>ここに書類の内容が入ります。</p>',
        category: '議事録',
        description: 'サンプルの説明文です。',
        status: 'draft' as const,
        tags: '会議,報告',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : undefined;

  // 保存処理
  const handleSave = async (data: {
    formData: DocumentFormData;
    content: string;
    attachedFile?: File;
  }) => {
    try {
      // 実際のアプリケーションではAPIに送信
      const saveData = {
        documentId,
        folderId, // フォルダIDも保存データに含める
        ...data,
      };
      // console.log('Saving document:', saveData);

      // 保存処理をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 500));

      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  };

  return (
    <DocumentFormEditor
      documentId={documentId}
      initialDocument={initialDocument}
      onSave={handleSave}
    />
  );
}
