'use client';

import { HandoverForm } from '@/components/2_molecules/handover/handover-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getHandoverById } from '@/mocks/handover-data';
import type { Handover, HandoverFormData } from '@/types/handover';
import { ArrowLeft, CheckCircle, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EditHandoverPageProps {
  params: Promise<{ handoverId: string }>;
}

export default function EditHandoverPage({ params }: EditHandoverPageProps) {
  const router = useRouter();
  const [handover, setHandover] = useState<Handover | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load handover data
  useEffect(() => {
    const loadHandover = async () => {
      const resolvedParams = await params;
      const foundHandover = getHandoverById(resolvedParams.handoverId);
      setHandover(foundHandover || null);
      setIsLoading(false);
    };

    loadHandover();
  }, [params]);

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
        setSuccessMessage('申し送りを更新しました。');
        // Navigate back to handover detail after successful submission
        setTimeout(() => {
          router.push(`/handovers/${handover?.id}`);
        }, 1500);
        return true;
      }
    } catch (error) {
      console.error('Failed to update handover:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : isDraft
            ? '下書き保存に失敗しました。もう一度お試しください。'
            : '申し送りの更新に失敗しました。もう一度お試しください。'
      );
      return false;
    }
  };

  const handleCancel = () => {
    router.push(`/handovers/${handover?.id}`);
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

  if (!handover) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">申し送りが見つかりません。</p>
        </div>
      </div>
    );
  }

  // Convert handover to form data
  const initialData: Partial<HandoverFormData> = {
    title: handover.title,
    content: handover.content,
    category: handover.category,
    priority: handover.priority,
    targetStaffIds: handover.targetStaffIds,
    residentId: handover.residentId || '',
    scheduledDate: handover.scheduledDate || '',
    scheduledTime: handover.scheduledTime || '',
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href={`/handovers/${handover.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">申し送り編集</h1>
          </div>
        </div>
        <p className="text-gray-600">
          申し送り内容を編集してください。必須項目（
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
            <Edit3 className="h-5 w-5" />
            申し送り編集フォーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <HandoverForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={initialData}
            mode="edit"
          />
        </CardContent>
      </Card>
    </div>
  );
}
