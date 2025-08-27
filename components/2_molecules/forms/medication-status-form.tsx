'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMedicationStatusForm } from '@/hooks/useMedicationStatusForm';
import type { MedicationStatusFormData } from '@/validations/medication-status-validation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface MedicationStatusFormProps {
  onSubmit: (data: MedicationStatusFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<MedicationStatusFormData>;
  className?: string;
}

export const MedicationStatusForm: React.FC<MedicationStatusFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const { formData, updateField, isSubmitting, error, fieldErrors, handleSubmit, retry } =
    useMedicationStatusForm({ onSubmit, initialData });

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      onCancel(); // Close modal on success
    }
  };

  const isNetworkError = error?.includes('ネットワークエラー');

  return (
    <form onSubmit={onFormSubmit} className={`space-y-4 ${className}`}>
      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700 flex items-center justify-between">
            <span>{error}</span>
            {isNetworkError && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={retry}
                disabled={isSubmitting}
                className="ml-2"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                リトライ
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 基本情報 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">基本情報</h3>

          <FormField
            label="登録日"
            id="date"
            type="date"
            value={formData.date}
            onChange={(value) => updateField('date', value)}
            required
            error={fieldErrors.date}
            disabled={isSubmitting}
          />

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-gray-700">
              内容 <span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => updateField('content', e.target.value)}
              placeholder="例：朝食後の薬を服用済み、副作用なし"
              disabled={isSubmitting}
              rows={4}
            />
            {fieldErrors.content && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.content}
              </p>
            )}
          </div>
        </div>

        {/* メモ */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">メモ</h3>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              メモ
            </label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="特記事項や観察内容があれば記入してください"
              disabled={isSubmitting}
              rows={6}
            />
            {fieldErrors.notes && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-carebase-blue hover:bg-carebase-blue-dark"
        >
          {isSubmitting ? '登録中...' : '登録'}
        </Button>
      </div>
    </form>
  );
};
