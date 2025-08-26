'use client';

import { DocumentFormEditor } from '@/components/3_organisms/documents/document-form-editor';
import { useDocumentSave } from '@/hooks/useDocumentSave';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

interface PageProps {
  params: Promise<{
    id?: string[];
  }>;
}

export default function DocumentEditPage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URLパラメータからドキュメントIDを取得
  const resolvedParams = React.use(params);
  const documentId = resolvedParams.id?.[0];

  // URLクエリパラメータからフォルダIDを取得
  const folderId = searchParams.get('folder') || searchParams.get('folderId');

  // 新規作成の場合は新規作成ページにリダイレクト
  useEffect(() => {
    if (!documentId) {
      const redirectUrl = folderId ? `/documents/new?folder=${folderId}` : '/documents/new';
      router.replace(redirectUrl);
    }
  }, [documentId, folderId, router]);

  // 新規作成の場合は何も表示しない（リダイレクト中）
  if (!documentId) {
    return null;
  }

  // 保存処理フックを使用
  const { saveDocument } = useDocumentSave({ documentId, folderId });

  // 編集モードの場合のモックデータ読み込み
  // 実際のアプリケーションではAPIからデータを取得
  const initialDocument = {
    id: documentId,
    title: 'サンプル書類タイトル',
    content: '<p>ここに書類の内容が入ります。</p>',
    category: '議事録',
    description: 'サンプルの説明文です。',
    status: 'draft' as const,
    tags: '会議,報告',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <DocumentFormEditor
      documentId={documentId}
      initialDocument={initialDocument}
      onSave={saveDocument}
    />
  );
}
