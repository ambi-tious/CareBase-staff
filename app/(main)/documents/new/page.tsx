'use client';

import { DocumentFormEditor } from '@/components/3_organisms/documents/document-form-editor';
import { useAuth } from '@/hooks/useAuth';
import type { DocumentFormData } from '@/validations/document-validation';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function DocumentNewContent() {
  const searchParams = useSearchParams();
  const { selectedStaff } = useAuth();

  // URLクエリパラメータからフォルダIDを取得
  const folderId = searchParams.get('folder') || searchParams.get('folderId');

  // 保存処理
  const handleSave = async (data: {
    formData: DocumentFormData;
    content: string;
    attachedFile?: File;
  }) => {
    try {
      // 実際のアプリケーションではAPIに送信
      const saveData = {
        folderId: data.formData.folderId === 'root' ? null : data.formData.folderId, // フォルダIDも保存データに含める
        createdBy: selectedStaff?.name || '現在のユーザー',
        ...data,
      };

      // 保存処理をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  };

  return <DocumentFormEditor onSave={handleSave} />;
}

export default function DocumentNewPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <DocumentNewContent />
    </Suspense>
  );
}
