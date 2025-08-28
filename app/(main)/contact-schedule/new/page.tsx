'use client';

import { ContactScheduleForm } from '@/components/2_molecules/contact-schedule/contact-schedule-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ContactScheduleFormData } from '@/validations/contact-schedule-validation';
import { ArrowLeft, CheckCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// プッシュ通知送信ヘルパー関数
const sendPushNotification = async (data: ContactScheduleFormData) => {
  const response = await fetch('/api/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `新しい${data.type === 'contact' ? '連絡' : data.type === 'schedule' ? '予定' : '申し送り'}`,
      body: `${data.title} - ${data.content.length > 50 ? data.content.substring(0, 50) + '...' : data.content}`,
      url: '/contact-schedule',
      icon: '/icons/icon-192x192.png',
    }),
  });

  if (!response.ok) {
    throw new Error(`プッシュ通知の送信に失敗しました: ${response.statusText}`);
  }

  return response.json();
};

export default function NewContactSchedulePage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (data: ContactScheduleFormData, isDraft = false): Promise<boolean> => {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock API call - in production, this would call the actual API
      // console.log('Submitting contact schedule:', { ...data, isDraft });

      if (isDraft) {
        setSuccessMessage('下書きを保存しました。');
        return true;
      } else {
        setSuccessMessage('連絡・予定を作成しました。');

        // プッシュ通知を送信
        try {
          await sendPushNotification(data);
        } catch (notificationError) {
          console.error('プッシュ通知の送信に失敗しました:', notificationError);
          // プッシュ通知の失敗は全体の処理をブロックしない
        }

        // Navigate back to contact schedule list after successful submission
        setTimeout(() => {
          router.push('/contact-schedule');
        }, 1500);
        return true;
      }
    } catch (error) {
      console.error('Failed to submit contact schedule:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : isDraft
            ? '下書き保存に失敗しました。もう一度お試しください。'
            : '連絡・予定の作成に失敗しました。もう一度お試しください。'
      );
      return false;
    }
  };

  const handleCancel = () => {
    router.push('/contact-schedule');
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href="/contact-schedule">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Plus className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">新規連絡・予定作成</h1>
          </div>
        </div>
        <p className="text-gray-600">
          新しい連絡・予定を作成してください。必須項目（
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
            <Plus className="h-5 w-5" />
            連絡・予定作成フォーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ContactScheduleForm onSubmit={handleSubmit} onCancel={handleCancel} mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
