'use client';

import React, { useState, useEffect } from 'react';
import { DocumentForm } from '@/components/3_organisms/documents/document-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DocumentEditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DocumentEditorPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const router = useRouter();
  const [document, setDocument] = useState<{
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 文書データの取得
  useEffect(() => {
    const fetchDocument = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 実際のアプリケーションではAPIを呼び出してデータを取得します
        // ここではモックデータを使用
        await new Promise((resolve) => setTimeout(resolve, 500));

        // モックデータ
        setDocument({
          id: params.id,
          title: 'サンプル文書',
          content: '<p>これはサンプル文書の内容です。</p><p>編集して保存してください。</p>',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1週間前
          updatedAt: new Date(),
        });
      } catch (error) {
        console.error('Failed to fetch document:', error);
        setError('文書の読み込みに失敗しました。もう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [params.id]);

  // 文書保存処理のモック
  const handleSaveDocument = async (documentData: { title: string; content: string }) => {
    if (!document) return false;

    setIsSaving(true);

    try {
      // 実際のアプリケーションではAPIを呼び出して保存します

      // 保存処理をシミュレート
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 成功したら文書を更新
      setDocument({
        ...document,
        ...documentData,
        updatedAt: new Date(),
      });

      return true;
    } catch (error) {
      console.error('Failed to save document:', error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || '文書が見つかりませんでした'}</p>
            <Button onClick={() => router.back()}>戻る</Button>
          </div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold text-carebase-text-primary">書類編集</h1>
          </div>
        </div>
        <p className="text-gray-600">
          書類の内容を編集してください。ツールバーを使用して文字の書式を変更できます。
        </p>
      </div>

      {/* 文書フォーム */}
      <DocumentForm initialDocument={document} onSave={handleSaveDocument} />
    </div>
  );
}
