import { getCareRecordById } from '@/mocks/care-record-data';
import { CategoryBadge } from '@/components/1_atoms/care-record/category-badge';
import { PriorityBadge } from '@/components/1_atoms/care-record/priority-badge';
import { StatusBadge } from '@/components/1_atoms/care-record/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, FileText, User, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

export default async function CareRecordDetailPage({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const resolvedParams = await params;
  const record = getCareRecordById(resolvedParams.recordId);

  if (!record) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">介護記録が見つかりません。</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" asChild>
            <Link href="/care-records">
              <ArrowLeft className="h-4 w-4 mr-2" />
              記録一覧に戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">介護記録詳細</h1>
          </div>
        </div>
      </div>

      {/* 詳細カード */}
      <Card className="max-w-4xl">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl text-carebase-text-primary">
                {record.title}
              </CardTitle>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>記録ID: {record.id}</span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(record.recordedAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                asChild
                className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
              >
                <Link href={`/care-records/${record.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  編集
                </Link>
              </Button>
              <PriorityBadge priority={record.priority} />
              <StatusBadge status={record.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* カテゴリ */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">記録種別:</span>
            <CategoryBadge category={record.category} />
          </div>

          {/* 利用者情報 */}
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <span className="text-sm font-medium">対象利用者: </span>
              <Link
                href={`/residents/${record.residentId}`}
                className="text-sm text-carebase-blue hover:underline"
              >
                {record.residentName}
              </Link>
            </div>
          </div>

          {/* 担当職員情報 */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <span className="text-sm font-medium">担当職員: </span>
              <span className="text-sm">{record.createdByName}</span>
            </div>
          </div>

          {/* 記録内容 */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-carebase-text-primary">記録内容</h3>
            <div className="p-4 bg-white border border-gray-200 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {record.content}
              </p>
            </div>
          </div>

          {/* タイムスタンプ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-sm">
              <span className="font-medium text-gray-500">記録日時:</span>
              <div className="mt-1">{formatDateTime(record.recordedAt)}</div>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-500">作成日時:</span>
              <div className="mt-1">{formatDateTime(record.createdAt)}</div>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-500">更新日時:</span>
              <div className="mt-1">{formatDateTime(record.updatedAt)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}