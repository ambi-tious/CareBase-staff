'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DocumentFormFields,
  type DocumentFormData,
} from '@/components/2_molecules/documents/document-form-fields';
import { useDocumentForm } from '@/hooks/useDocumentForm';

export default function DocumentEditPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const { formData, updateField, isSubmitting, error, fieldErrors, handleSubmit } = useDocumentForm(
    {
      onSubmit: async (data) => {
        setIsSaving(true);

        try {
          // 実際のアプリケーションではAPIを呼び出して保存します
          console.log('Saving document metadata:', data);

          // 保存処理をシミュレート
          await new Promise((resolve) => setTimeout(resolve, 500));

          // 保存成功後、エディタ画面に遷移
          // 実際のアプリケーションでは、APIからIDを取得して使用します
          const mockId = `doc-${Date.now()}`;
          router.push(`/documents/editor/${mockId}`);

          return true;
        } catch (error) {
          console.error('Failed to save document:', error);
          return false;
        } finally {
          setIsSaving(false);
        }
      },
    }
  );

  const handleCancel = () => {
    router.back();
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
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">新規書類作成</h1>
          </div>
        </div>
        <p className="text-gray-600">
          書類の基本情報を入力してください。必須項目（<span className="text-red-500">*</span>
          ）は必ず入力してください。
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
            error={error}
            fieldErrors={fieldErrors}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
