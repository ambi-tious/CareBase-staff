'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DocumentFormFields,
  type DocumentFormData,
} from '@/components/2_molecules/documents/document-form-fields';
import { useDocumentForm } from '@/hooks/useDocumentForm';
import { DocumentEditor } from '@/components/2_molecules/editor/document-editor';
import { DocumentToolbar } from '@/components/2_molecules/editor/document-toolbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function DocumentEditPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState('');
  const [fontFamily, setFontFamily] = useState('Arial, sans-serif');
  const [fontSize, setFontSize] = useState('16px');
  const [textColor, setTextColor] = useState('#000000');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { formData, updateField, isSubmitting, error, fieldErrors, handleSubmit } = useDocumentForm(
    {
      onSubmit: async (data) => {
        setIsSaving(true);

        try {
          // 実際のアプリケーションではAPIを呼び出して保存します

          // 保存処理をシミュレート
          await new Promise((resolve) => setTimeout(resolve, 500));

          // 保存成功を表示
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);

          return true;
        } catch (error) {
          console.error('Failed to save document:', error);
          setSaveError('保存に失敗しました。もう一度お試しください。');
          return false;
        } finally {
          setIsSaving(false);
        }
      },
    }
  );

  // 文書フォーマット処理
  const handleFormatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  // 統合保存処理
  const handleSaveAll = async () => {
    // フォーム情報とエディタ内容を一括保存
    const success = await handleSubmit();
    if (success) {
      // 保存成功時の処理
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError('保存に失敗しました。もう一度お試しください。');
    }
    return success;
  };

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
      <Card className="max-w-4xl mb-4">
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

      {/* エディタ */}
      <Card className="max-w-4xl mb-4">
        <DocumentToolbar
          onFormatText={handleFormatText}
          fontFamily={fontFamily}
          fontSize={fontSize}
          textColor={textColor}
          disabled={isSubmitting}
        />
        <CardContent className="p-4">
          <DocumentEditor
            content={content}
            onContentChange={setContent}
            fontFamily={fontFamily}
            fontSize={fontSize}
            disabled={isSubmitting}
          />
        </CardContent>
      </Card>

      {/* 保存ボタン */}
      <div className="max-w-4xl space-y-2">
        <div className="flex gap-2">
          <Button
            onClick={handleSaveAll}
            disabled={isSubmitting}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? '保存中...' : '一括保存'}
          </Button>
        </div>

        {saveSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              文書が正常に保存されました
            </AlertDescription>
          </Alert>
        )}

        {saveError && !error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">{saveError}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
