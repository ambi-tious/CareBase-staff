'use client';

import { CarePlanForm } from '@/components/2_molecules/care-plan/care-plan-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCarePlanById } from '@/mocks/care-plan-data';
import { getResidentById } from '@/mocks/care-board-data';
import { carePlanService } from '@/services/carePlanService';
import type { CarePlan } from '@/types/care-plan';
import type { CarePlanFormData } from '@/validations/care-plan-validation';
import { ArrowLeft, CheckCircle, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EditCarePlanPageProps {
  params: Promise<{ residentId: string; planId: string }>;
}

export default function EditCarePlanPage({ params }: EditCarePlanPageProps) {
  const router = useRouter();
  const [residentId, setResidentId] = useState<string>('');
  const [planId, setPlanId] = useState<string>('');
  const [residentName, setResidentName] = useState<string>('');
  const [carePlan, setCarePlan] = useState<CarePlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load care plan data
  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      const residentIdNum = Number.parseInt(resolvedParams.residentId, 10);
      const resident = getResidentById(residentIdNum);
      const foundCarePlan = getCarePlanById(resolvedParams.planId);

      if (resident && foundCarePlan) {
        setResidentId(resolvedParams.residentId);
        setPlanId(resolvedParams.planId);
        setResidentName(resident.name);
        setCarePlan(foundCarePlan);
      }
      setIsLoading(false);
    };

    loadData();
  }, [params]);

  const handleSubmit = async (data: CarePlanFormData, isDraft = false): Promise<boolean> => {
    if (!carePlan) return false;

    try {
      setSubmitError(null);
      setSuccessMessage(null);

      const updatedCarePlan = await carePlanService.updateCarePlan(residentId, planId, data);

      if (isDraft) {
        setSuccessMessage('下書きを保存しました。');
        return true;
      } else {
        setSuccessMessage('ケアプランを更新しました。');
        // Navigate back to detail page after successful submission
        setTimeout(() => {
          router.push(`/residents/${residentId}/care-plans/${planId}`);
        }, 1500);
        return true;
      }
    } catch (error) {
      console.error('Failed to update care plan:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : isDraft
            ? '下書き保存に失敗しました。もう一度お試しください。'
            : 'ケアプランの更新に失敗しました。もう一度お試しください。'
      );
      return false;
    }
  };

  const handleCancel = () => {
    router.push(`/residents/${residentId}/care-plans/${planId}`);
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

  if (!carePlan) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">ケアプランが見つかりません。</p>
        </div>
      </div>
    );
  }

  // Convert care plan to form data
  const initialData: Partial<CarePlanFormData> = {
    planTitle: carePlan.planTitle,
    planType: carePlan.planType,
    careLevel: carePlan.careLevel,
    certificationDate: carePlan.certificationDate,
    certValidityStart: carePlan.certValidityStart,
    certValidityEnd: carePlan.certValidityEnd,
    certificationStatus: carePlan.certificationStatus,
    careManager: carePlan.careManager,
    careManagerOffice: carePlan.careManagerOffice,
    nextReviewDate: carePlan.nextReviewDate,
    referralInfo: carePlan.referralInfo || '',
    residentIntention: carePlan.residentIntention,
    familyIntention: carePlan.familyIntention,
    assessmentCommitteeOpinion: carePlan.assessmentCommitteeOpinion,
    comprehensiveGuidance: carePlan.comprehensiveGuidance,
    consentObtained: carePlan.consentObtained,
    goals: carePlan.goals,
    services: carePlan.services.map((service) => ({
      serviceName: service.serviceName,
      serviceType: service.serviceType,
      frequency: service.frequency,
      duration: service.duration,
      provider: service.provider,
      startDate: service.startDate,
      endDate: service.endDate || '',
      notes: service.notes || '',
    })),
    notes: carePlan.notes || '',
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href={`/residents/${residentId}/care-plans/${planId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">ケアプラン編集</h1>
          </div>
        </div>
        <p className="text-gray-600">
          {residentName}様のケアプラン「{carePlan.planTitle}」を編集してください。必須項目（
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
            ケアプラン編集フォーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CarePlanForm
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
