'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DocumentFormFields, type DocumentFormData } from '@/components/2_molecules/documents/document-form-fields';
import { useDocumentForm } from '@/hooks/useDocumentForm';

interface DocumentEditPageProps {
  params: {
    id: string;
  };
}

export default function DocumentEditPage({ params }: DocumentEditPageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [initialData, setInitialData] = useState<Partial<DocumentFormData>>({});

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
        setInitialData({
          title: 'サンプル文書',
          category: '議事録',
          description: 'これはサンプル文書の説明です。',
          status: 'draft',
          tags: '会議,報告,サンプル',
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

  const {
    formData,
    updateField,
    isSubmitting,
    error: formError,
    fieldErrors,
    handleSubmit,
  } = useDocumentForm({
    initialData,
    onSubmit: async (data) => {
      setIsSaving(true);
      
      try {
        // 実際のアプリケーションではAPIを呼び出して保存します
        console.log('Updating document metadata:', { id: params.id, ...data });
        
        // 保存処理をシミュレート
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // 保存成功後、エディタ画面に遷移
        router.push(`/documents/editor/${params.id}`);
        
        return true;
      } catch (error) {
        console.error('Failed to update document:', error);
        return false;
      } finally {
        setIsSaving(false);
      }
    },
  });

  const handleCancel = () => {
    router.back();
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

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
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
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">書類編集</h1>
          </div>
        </div>
        <p className="text-gray-600">
          書類の基本情報を編集してください。必須項目（<span className="text-red-500">*</span>）は必ず入力してください。
        </p>
      </div>

      {/* フォーム */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            書類情報
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DocumentFormFields
            formData={formData}
            updateField={updateField}
            isSubmitting={isSubmitting}
            error={formError}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}