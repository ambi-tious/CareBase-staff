'use client';

import { StatusBadge } from '@/components/1_atoms/care-plan/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { CarePlan } from '@/types/care-plan';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Edit3, Eye, FileText, User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';

interface CarePlanCardProps {
  carePlan: CarePlan;
  className?: string;
}

export const CarePlanCard: React.FC<CarePlanCardProps> = ({ carePlan, className = '' }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja });
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
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <StatusBadge status={carePlan.status} />
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {carePlan.careLevel}
              </Badge>
              {isExpiringSoon() && (
                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                  期限間近
                </Badge>
              )}
              {isExpired() && (
                <Badge variant="outline" className="text-xs bg-red-100 text-red-700 border-red-200">
                  期限切れ
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-carebase-text-primary mb-1 line-clamp-1">
              {carePlan.planTitle}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{carePlan.careManager}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>更新: {formatDate(carePlan.updatedAt.split('T')[0])}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
            >
              <Link href={`/residents/${carePlan.residentId}/care-plans/${carePlan.id}`}>
                <Eye className="h-3 w-3 mr-1" />
                詳細
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-green-300 text-green-600 hover:bg-green-50"
            >
              <Link href={`/residents/${carePlan.residentId}/care-plans/${carePlan.id}/edit`}>
                <Edit3 className="h-3 w-3 mr-1" />
                編集
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* 認定情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">認定日:</span>
              <span className="ml-2">{formatDate(carePlan.certificationDate)}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">有効期間:</span>
              <span className="ml-2">
                {formatDate(carePlan.certValidityStart)} 〜 {formatDate(carePlan.certValidityEnd)}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">事業所:</span>
              <span className="ml-2">{carePlan.careManagerOffice}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">次回見直し:</span>
              <span className="ml-2">{formatDate(carePlan.nextReviewDate)}</span>
            </div>
          </div>
        </div>

        {/* ケア目標 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">ケア目標</h4>
          <div className="space-y-1">
            {carePlan.goals.slice(0, 2).map((goal, index) => (
              <div key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-carebase-blue">•</span>
                <span className="line-clamp-1">{goal}</span>
              </div>
            ))}
            {carePlan.goals.length > 2 && (
              <div className="text-xs text-gray-500">他 {carePlan.goals.length - 2} 項目</div>
            )}
          </div>
        </div>

        {/* サービス概要 */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">利用サービス</h4>
          <div className="flex flex-wrap gap-2">
            {carePlan.services.map((service) => (
              <Badge
                key={service.id}
                variant="outline"
                className="text-xs bg-gray-50 text-gray-700 border-gray-300"
              >
                {service.serviceName}
              </Badge>
            ))}
          </div>
        </div>

        {/* 備考 */}
        {carePlan.notes && (
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
              <p className="text-sm text-gray-600 line-clamp-2">{carePlan.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};