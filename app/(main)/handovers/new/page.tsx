'use client';

import { HandoverForm } from '@/components/2_molecules/handover/handover-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HandoverFormData } from '@/validations/handover-validation';
import { ArrowLeft, CheckCircle, MessageSquarePlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewHandoverPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: HandoverFormData, isDraft = false): Promise<boolean> => {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock API call - in production, this would call the actual API

      // Simulate occasional errors for testing
      if (Math.random() < 0.1) {
        throw new Error('ネットワークエラーが発生しました。');
      }

      if (isDraft) {
        setSuccessMessage('下書きを保存しました。');
        return true;
      } else {
        setSuccessMessage('申し送りを送信しました。');
        // Navigate back to handover list after successful submission
        setTimeout(() => {
          router.push('/handovers');
        }, 1500);
        return true;
      }
    } catch (error) {
      console.error('Failed to submit handover:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : isDraft
            ? '下書き保存に失敗しました。もう一度お試しください。'
            : '申し送りの送信に失敗しました。もう一度お試しください。'
      );
      return false;
    }
  };

  const handleCancel = () => {
    router.push('/handovers');
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href="/handovers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <MessageSquarePlus className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">新規申し送り作成</h1>
          </div>
        </div>
        <p className="text-gray-600">
          新しい申し送りを作成してください。必須項目（
          <span className="text-red-500">*</span>）は必ず入力してください。
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Error Alert */}
      {submitError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card className="max-w-6xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquarePlus className="h-5 w-5" />
            申し送り作成フォーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HandoverForm onSubmit={handleSubmit} onCancel={handleCancel} mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
