'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CareRecordForm } from '@/components/2_molecules/care-record/care-record-form';
import type { CareRecordFormData } from '@/types/care-record';
import { careRecordService } from '@/services/careRecordService';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewCareRecordPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: CareRecordFormData, isDraft = false): Promise<boolean> => {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      const newRecord = await careRecordService.createCareRecord(data);

      if (isDraft) {
        setSuccessMessage('下書きを保存しました。');
        return true;
      } else {
        setSuccessMessage('介護記録を作成しました。');
        // Navigate to the new record detail page
        setTimeout(() => {
          router.push(`/care-records/${newRecord.id}`);
        }, 1500);
        return true;
      }
    } catch (err) {
      console.error('Failed to create care record:', err);
      setSubmitError(
        err instanceof Error
          ? err.message
          : isDraft
            ? '下書き保存に失敗しました。もう一度お試しください。'
            : '介護記録の作成に失敗しました。もう一度お試しください。'
      );
      return false;
    }
  };

  const handleCancel = () => {
    router.push('/care-records');
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href="/care-records">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">新規介護記録作成</h1>
          </div>
        </div>
        <p className="text-gray-600">
          新しい介護記録を作成してください。必須項目（
          <span className="text-red-500">*</span>）は必ず入力してください。
        </p>
      </div>

      {/* 成功メッセージ */}
      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* エラーアラート */}
      {submitError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{submitError}</AlertDescription>
        </Alert>
      )}

      {/* フォーム */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            介護記録作成フォーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CareRecordForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            mode="create"
          />
        </CardContent>
      </Card>
    </div>
  );
}
