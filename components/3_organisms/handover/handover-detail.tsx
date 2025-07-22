'use client';

import { CategoryBadge } from '@/components/1_atoms/handover/category-badge';
import { PriorityBadge } from '@/components/1_atoms/handover/priority-badge';
import { StatusBadge } from '@/components/1_atoms/handover/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Handover } from '@/types/handover';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ArrowLeft, Calendar, Edit3, MessageCircle, User } from 'lucide-react';
import Link from 'next/link';
import type React from 'react';
import { useState } from 'react';

interface HandoverDetailProps {
  handover: Handover;
  onUpdate?: (updatedHandover: Handover) => void;
}

export const HandoverDetail: React.FC<HandoverDetailProps> = ({ handover, onUpdate }) => {
  const [currentHandover, setCurrentHandover] = useState(handover);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" asChild>
            <Link href="/handovers">
              <ArrowLeft className="h-4 w-4 mr-2" />
              申し送り一覧に戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">申し送り詳細</h1>
          </div>
        </div>
      </div>

      {/* Detail Card */}
      <Card className="max-w-4xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl text-carebase-text-primary">
                {currentHandover.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>ID: {currentHandover.id}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(currentHandover.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                asChild
                className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
              >
                <Link href={`/handovers/edit/${currentHandover.id}`}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  編集
                </Link>
              </Button>
              <PriorityBadge priority={currentHandover.priority} />
              <StatusBadge status={currentHandover.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">カテゴリ:</span>
            <CategoryBadge category={currentHandover.category} />
          </div>

          {/* Creator Info */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <span className="text-sm font-medium">申し送り者: </span>
              <span className="text-sm">{currentHandover.createdByName}</span>
            </div>
          </div>

          {/* Resident Info */}
          {currentHandover.residentName && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">対象利用者: </span>
              <Link
                href={`/residents/${currentHandover.residentId}`}
                className="text-sm text-carebase-blue hover:underline"
              >
                {currentHandover.residentName}
              </Link>
            </div>
          )}

          {/* Scheduled Date/Time */}
          {(currentHandover.scheduledDate || currentHandover.scheduledTime) && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <span className="text-sm font-medium text-yellow-800">実施予定: </span>
              <span className="text-sm text-yellow-700">
                {currentHandover.scheduledDate &&
                  format(new Date(currentHandover.scheduledDate), 'yyyy年MM月dd日', {
                    locale: ja,
                  })}
                {currentHandover.scheduledTime && ` ${currentHandover.scheduledTime}`}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-carebase-text-primary">内容</h3>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {currentHandover.content}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-sm">
              <span className="font-medium text-gray-500">作成日時:</span>
              <div className="mt-1">{formatDateTime(currentHandover.createdAt)}</div>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-500">更新日時:</span>
              <div className="mt-1">{formatDateTime(currentHandover.updatedAt)}</div>
            </div>
            {currentHandover.readAt && (
              <div className="text-sm">
                <span className="font-medium text-gray-500">既読日時:</span>
                <div className="mt-1">{formatDateTime(currentHandover.readAt)}</div>
              </div>
            )}
            {currentHandover.completedAt && (
              <div className="text-sm">
                <span className="font-medium text-gray-500">対応完了日時:</span>
                <div className="mt-1">{formatDateTime(currentHandover.completedAt)}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
