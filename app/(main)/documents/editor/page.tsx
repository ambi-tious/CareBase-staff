'use client';

import { useState } from 'react';
import { DocumentForm } from '@/components/3_organisms/documents/document-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DocumentEditorPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // 文書保存処理のモック
  const handleSaveDocument = async (document: { title: string; content: string }) => {
    setIsSaving(true);

    try {
      // 実際のアプリケーションではAPIを呼び出して保存します

      // 保存処理をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 500));

      return true;
    } catch (error) {
      console.error('Failed to save document:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-carebase-text-primary">書類作成</h1>
          </div>
        </div>
        <p className="text-gray-600">
          書類の内容を入力してください。ツールバーを使用して文字の書式を変更できます。
        </p>
      </div>

      {/* 文書フォーム */}
      <DocumentForm
        initialDocument={{
          title: '',
          content: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        }}
        onSave={handleSaveDocument}
      />
    </div>
  );
}
