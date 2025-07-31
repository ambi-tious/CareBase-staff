'use client';

import { StatusBadge } from '@/components/1_atoms/care-plan/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CarePlan } from '@/types/care-plan';
import { serviceTypeOptions, planTypeOptions, certificationStatusOptions } from '@/types/care-plan';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArrowLeft, Calendar, Edit3, FileText, Target, User, Building2, Clock, CheckCircle, MessageSquare, Users, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface CarePlanDetailProps {
  carePlan: CarePlan;
  residentId: string;
}

export const CarePlanDetail: React.FC<CarePlanDetailProps> = ({ carePlan, residentId }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  const getServiceTypeLabel = (type: string) => {
    const serviceType = serviceTypeOptions.find(option => option.value === type);
    return serviceType?.label || type;
  };

  const getPlanTypeLabel = (type: string) => {
    const planType = planTypeOptions.find(option => option.value === type);
    return planType?.label || type;
  };

  const getCertificationStatusLabel = (status: string) => {
    const certStatus = certificationStatusOptions.find(option => option.value === status);
    return certStatus?.label || status;
  };

  const isExpiringSoon = () => {
    const endDate = new Date(carePlan.certValidityEnd);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = () => {
    const endDate = new Date(carePlan.certValidityEnd);
    const today = new Date();
    return endDate < today;
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" asChild>
            <Link href={`/residents/${residentId}/care-plans`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              ケアプラン一覧に戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">ケアプラン詳細</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <StatusBadge status={carePlan.status} />
                  {isExpiringSoon() && (
                    <span className="bg-orange-100 text-orange-700 border-orange-200 px-2 py-1 rounded-full text-xs font-medium border">
                      期限間近
                    </span>
                  )}
                  {isExpired() && (
                    <span className="bg-red-100 text-red-700 border-red-200 px-2 py-1 rounded-full text-xs font-medium border">
                      期限切れ
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl text-carebase-text-primary">
                  {carePlan.planTitle}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>プランID: {carePlan.id}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>作成日: {formatDateTime(carePlan.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  asChild
                  className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
                >
                  <Link href={`/residents/${residentId}/care-plans/${carePlan.id}/edit`}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    編集
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 認定情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">認定情報</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">要介護度:</span>
                    <span className="ml-2 font-semibold text-carebase-blue">{carePlan.careLevel}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">認定日:</span>
                    <span className="ml-2">{formatDate(carePlan.certificationDate)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">有効期間:</span>
                    <div className="ml-2">
                      {formatDate(carePlan.certValidityStart)} 〜<br />
                      {formatDate(carePlan.certValidityEnd)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">ケアマネージャー</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{carePlan.careManager}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span>{carePlan.careManagerOffice}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-700 border-b pb-1">見直し予定</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">{formatDate(carePlan.nextReviewDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 作成者情報 */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">作成者: {carePlan.createdByName}</span>
                <span className="text-sm text-gray-500">
                  (最終更新: {formatDateTime(carePlan.updatedAt)})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Care Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              ケア目標
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {carePlan.goals.map((goal, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-carebase-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{goal}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              利用サービス ({carePlan.services.length}件)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {carePlan.services.map((service, index) => (
                <div key={service.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-base font-semibold text-carebase-text-primary mb-1">
                          {service.serviceName}
                        </h4>
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                          {getServiceTypeLabel(service.serviceType)}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">頻度:</span>
                          <span className="ml-2">{service.frequency}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">時間:</span>
                          <span className="ml-2">{service.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">提供事業者:</span>
                          <span className="ml-2">{service.provider}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">開始日:</span>
                          <span className="ml-2">{formatDate(service.startDate)}</span>
                        </div>
                        {service.endDate && (
                          <div>
                            <span className="font-medium text-gray-600">終了日:</span>
                            <span className="ml-2">{formatDate(service.endDate)}</span>
                          </div>
                        )}
                      </div>
                      {service.notes && (
                        <div className="p-2 bg-gray-50 rounded text-sm">
                          <span className="font-medium text-gray-600">メモ:</span>
                          <p className="mt-1 text-gray-700">{service.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {carePlan.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                備考
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {carePlan.notes}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};