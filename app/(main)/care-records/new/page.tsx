'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CareRecordFormData } from '@/types/care-record';
import { categoryOptions, priorityOptions } from '@/types/care-record';
import { careBoardData } from '@/mocks/care-board-data';
import { ArrowLeft, Save, FileText, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function NewCareRecordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CareRecordFormData>({
    residentId: '',
    category: 'meal',
    title: '',
    content: '',
    recordedAt: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    priority: 'medium',
    status: 'completed',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const residentOptions = careBoardData
    .filter(resident => resident.admissionStatus === '入居中')
    .map(resident => ({
      value: resident.id.toString(),
      label: `${resident.name} (${resident.careLevel})`,
    }));

  const updateField = (field: keyof CareRecordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // バリデーション
      if (!formData.residentId) {
        throw new Error('利用者を選択してください');
      }
      if (!formData.title.trim()) {
        throw new Error('タイトルを入力してください');
      }
      if (!formData.content.trim()) {
        throw new Error('記録内容を入力してください');
      }

      // APIコール（モック）
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 成功処理
      setSuccess(true);
      setTimeout(() => {
        router.push('/care-records');
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : '記録の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/care-records');
  };

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* ヘッダー */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" asChild>
            <Link href="/care-records">
              <ArrowLeft className="h-4 w-4 mr-2" />
              戻る
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">新規介護記録作成</h1>
          </div>
        </div>
        <p className="text-gray-600">
          新しい介護記録を作成してください。必須項目（
          <span className="text-red-500">*</span>）は必ず入力してください。
        </p>
      </div>

      {/* 成功メッセージ */}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            介護記録を作成しました。一覧画面に戻ります...
          </AlertDescription>
        </Alert>
      )}

      {/* エラーアラート */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* フォーム */}
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            介護記録作成フォーム
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 左列 - 基本情報 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                  基本情報
                </h3>

                <FormSelect
                  label="対象利用者"
                  id="residentId"
                  value={formData.residentId}
                  onChange={(value) => updateField('residentId', value)}
                  options={residentOptions}
                  placeholder="利用者を選択してください"
                  required
                  disabled={isSubmitting}
                />

                <FormSelect
                  label="記録種別"
                  id="category"
                  value={formData.category}
                  onChange={(value) => updateField('category', value)}
                  options={categoryOptions.map(cat => ({ value: cat.value, label: cat.label }))}
                  required
                  disabled={isSubmitting}
                />

                <FormField
                  label="記録日時"
                  id="recordedAt"
                  type="datetime-local"
                  value={formData.recordedAt}
                  onChange={(value) => updateField('recordedAt', value)}
                  required
                  disabled={isSubmitting}
                />

                <FormSelect
                  label="重要度"
                  id="priority"
                  value={formData.priority}
                  onChange={(value) => updateField('priority', value)}
                  options={priorityOptions.map(pri => ({ value: pri.value, label: pri.label }))}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* 右列 - 記録内容 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
                  記録内容
                </h3>

                <FormField
                  label="タイトル"
                  id="title"
                  value={formData.title}
                  onChange={(value) => updateField('title', value)}
                  placeholder="例：朝食摂取記録"
                  required
                  disabled={isSubmitting}
                />

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                    記録内容 <span className="text-red-500 ml-1">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => updateField('content', e.target.value)}
                    placeholder="詳細な記録内容を入力してください&#10;&#10;例：&#10;・朝食を8割程度摂取&#10;・食欲良好で、特に問題なし&#10;・水分摂取も十分"
                    disabled={isSubmitting}
                    className="min-h-32"
                    rows={8}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.content.length}/1000文字
                  </div>
                </div>
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? '作成中...' : '記録を作成'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}