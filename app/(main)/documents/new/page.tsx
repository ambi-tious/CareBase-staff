'use client';

import { DocumentFormEditor } from '@/components/3_organisms/documents/document-form-editor';
import { useDocumentSave } from '@/hooks/useDocumentSave';
import { useSearchParams } from 'next/navigation';

export default function DocumentNewPage() {
  const searchParams = useSearchParams();

  // URLクエリパラメータからフォルダIDを取得
  const folderId = searchParams.get('folder') || searchParams.get('folderId');

  // 保存処理フックを使用
  const { saveDocument } = useDocumentSave({ folderId });

  return <DocumentFormEditor onSave={saveDocument} />;
}
