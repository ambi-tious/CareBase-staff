'use client';

import { DocumentFormEditor } from '@/components/3_organisms/documents/document-form-editor';
import { useAuth } from '@/hooks/useAuth';
import type { DocumentFormData } from '@/validations/document-validation';
import { useSearchParams } from 'next/navigation';

export default function DocumentNewPage() {
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
      console.log('Saving new document with data:', data);

      // 実際のアプリケーションではAPIに送信
      const saveData = {
        folderId, // フォルダIDも保存データに含める
        createdBy: selectedStaff?.name || '現在のユーザー',
        ...data,
      };
      console.log('Saving new document:', saveData);

      // 保存処理をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('New document saved successfully');
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  };

  return <DocumentFormEditor onSave={handleSave} />;
}
