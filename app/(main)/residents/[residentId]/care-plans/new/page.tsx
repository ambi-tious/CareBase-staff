'use client';

import { CarePlanForm } from '@/components/2_molecules/care-plan/care-plan-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getResidentById } from '@/mocks/care-board-data';
import { carePlanService } from '@/services/carePlanService';
import type { CarePlanFormData } from '@/validations/care-plan-validation';
import { ArrowLeft, CheckCircle, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface NewCarePlanPageProps {
  params: Promise<{ residentId: string }>;
}

export default function NewCarePlanPage({ params }: NewCarePlanPageProps) {
  const router = useRouter();
  const [residentId, setResidentId] = useState<string>('');
  const [residentName, setResidentName] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load resident information
  useEffect(() => {
    const loadResident = async () => {
      const resolvedParams = await params;
      const residentIdNum = Number.parseInt(resolvedParams.residentId, 10);
      const resident = getResidentById(residentIdNum);

      if (resident) {
        setResidentId(resolvedParams.residentId);
        setResidentName(resident.name);
      }
    };

    loadResident();
  }, [params]);

  const handleSubmit = async (data: CarePlanFormData, isDraft = false): Promise<boolean> => {
    try {
      setSubmitError(null);
      setSuccessMessage(null);

      const newCarePlan = await carePlanService.createCarePlan(residentId, data);

      if (isDraft) {
        setSuccessMessage('下書きを保存しました。');
        return true;
      } else {
        setSuccessMessage('ケアプランを作成しました。');
        // Navigate to the new care plan detail page
        setTimeout(() => {
          router.push(`/residents/${residentId}/care-plans/${newCarePlan.id}`);
        }, 1500);
        return true;
      }
    } catch (error) {
      console.error('Failed to create care plan:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : isDraft
            ? '下書き保存に失敗しました。もう一度お試しください。'
            : 'ケアプランの作成に失敗しました。もう一度お試しください。'
      );
      return false;
    }
  };

  const handleCancel = () => {
    router.push(`/residents/${residentId}/care-plans`);
  };

  if (!residentId || !residentName) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href={`/residents/${residentId}/care-plans`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">新規ケアプラン作成</h1>
          </div>
        </div>
        <p className="text-gray-600">
          {residentName}様の新しいケアプランを作成してください。必須項目（
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
            <FileText className="h-5 w-5" />
            ケアプラン作成フォーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CarePlanForm onSubmit={handleSubmit} onCancel={handleCancel} mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
