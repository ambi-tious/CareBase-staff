'use client';

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PriorityBadge } from '@/components/1_atoms/handover/priority-badge';
import { StatusBadge } from '@/components/1_atoms/handover/status-badge';
import type { Handover } from '@/types/handover';
import { ArrowLeft, User, Calendar, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface HandoverDetailProps {
  handover: Handover;
}

export const HandoverDetail: React.FC<HandoverDetailProps> = ({ handover }) => {
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
                {handover.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>ID: {handover.id}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(handover.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={handover.priority} />
              <StatusBadge status={handover.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Creator Info */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <span className="text-sm font-medium">申し送り者: </span>
              <span className="text-sm">{handover.createdByName}</span>
            </div>
          </div>

          {/* Resident Info */}
          {handover.residentName && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium">対象利用者: </span>
              <Link
                href={`/residents/${handover.residentId}`}
                className="text-sm text-carebase-blue hover:underline"
              >
                {handover.residentName}
              </Link>
            </div>
          )}

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-carebase-text-primary">内容</h3>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {handover.content}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-sm">
              <span className="font-medium text-gray-500">作成日時:</span>
              <div className="mt-1">{formatDateTime(handover.createdAt)}</div>
            </div>
            {handover.readAt && (
              <div className="text-sm">
                <span className="font-medium text-gray-500">既読日時:</span>
                <div className="mt-1">{formatDateTime(handover.readAt)}</div>
              </div>
            )}
            {handover.completedAt && (
              <div className="text-sm">
                <span className="font-medium text-gray-500">対応完了日時:</span>
                <div className="mt-1">{formatDateTime(handover.completedAt)}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};