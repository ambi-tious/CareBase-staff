'use client';

import { CareRecordForm } from '@/components/2_molecules/care-record/care-record-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { careRecordService } from '@/services/careRecordService';
import type { CareRecord } from '@/types/care-record';
import type { CareRecordFormData } from '@/validations/care-record-validation';
import { ArrowLeft, CheckCircle, Edit3, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EditCareRecordPageProps {
  params: Promise<{ recordId: string }>;
}

export default function EditCareRecordPage({ params }: EditCareRecordPageProps) {
  const router = useRouter();
  const [record, setRecord] = useState<CareRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load care record data
  useEffect(() => {
    const loadRecord = async () => {
      const resolvedParams = await params;
      try {
        const foundRecord = await careRecordService.getCareRecord(resolvedParams.recordId);
        setRecord(foundRecord);
      } catch (error) {
        console.error('Failed to load care record:', error);
        setSubmitError('介護記録の読み込みに失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    loadRecord();
  }, [params]);

  const handleSubmit = async (data: CareRecordFormData, isDraft = false): Promise<boolean> => {
    if (!record) return false;

    try {
      setSubmitError(null);
      setSuccessMessage(null);

      const updatedRecord = await careRecordService.updateCareRecord(record.id, data);

      if (isDraft) {
        setSuccessMessage('下書きを保存しました。');
        return true;
      } else {
        setSuccessMessage('介護記録を更新しました。');
        // Navigate back to record detail after successful submission
        setTimeout(() => {
          router.push(`/care-records/${record.id}`);
        }, 1500);
        return true;
      }
    } catch (error) {
      console.error('Failed to update care record:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : isDraft
            ? '下書き保存に失敗しました。もう一度お試しください。'
            : '介護記録の更新に失敗しました。もう一度お試しください。'
      );
      return false;
    }
  };

  const handleDelete = async () => {
    if (!record) return;

    setIsDeleting(true);
    try {
      await careRecordService.deleteCareRecord(record.id);
      router.push('/care-records');
    } catch (error) {
      console.error('Failed to delete care record:', error);
      setSubmitError('介護記録の削除に失敗しました。もう一度お試しください。');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancel = () => {
    router.push(`/care-records/${record?.id}`);
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

  if (!record) {
    return (
      <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">介護記録が見つかりません。</p>
        </div>
      </div>
    );
  }

  // Convert record to form data
  const initialData: Partial<CareRecordFormData> = {
    residentId: record.residentId,
    category: record.category,
    title: record.title,
    content: record.content,
    recordedAt: record.recordedAt.slice(0, 16), // Convert to datetime-local format
    priority: record.priority,
    status: record.status,
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href={`/care-records/${record.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">介護記録編集</h1>
          </div>
          <div className="ml-auto">
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="border-red-300 text-red-600 hover:bg-red-50"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
          </div>
        </div>
        <p className="text-gray-600">
          介護記録の内容を編集してください。必須項目（
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
            介護記録編集フォーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CareRecordForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            initialData={initialData}
            mode="edit"
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              記録の削除
            </h3>
            <p className="text-gray-700 mb-6">
              この介護記録を削除してもよろしいですか？
              <br />
              <strong>「{record.title}」</strong>
              <br />
              削除されたデータは復元できません。
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? '削除中...' : '削除する'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
