'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMedicationForm } from '@/hooks/useMedicationForm';
import type { MedicationFormData } from '@/validations/medication-validation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface MedicationFormProps {
  onSubmit: (data: MedicationFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<MedicationFormData>;
  className?: string;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const { formData, updateField, isSubmitting, error, fieldErrors, handleSubmit, retry } =
    useMedicationForm({ onSubmit, initialData });

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
            label="薬剤名"
            id="medicationName"
            value={formData.medicationName}
            onChange={(value) => updateField('medicationName', value)}
            placeholder="例：アムロジピン錠5mg"
            required
            error={fieldErrors.medicationName}
            disabled={isSubmitting}
          />

          <div className="space-y-2">
            <label htmlFor="dosageInstructions" className="text-sm font-medium text-gray-700">
              用法・用量 <span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              id="dosageInstructions"
              value={formData.dosageInstructions}
              onChange={(e) => updateField('dosageInstructions', e.target.value)}
              placeholder="例：1日1回 朝食後 1錠"
              disabled={isSubmitting}
              rows={3}
            />
            {fieldErrors.dosageInstructions && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.dosageInstructions}
              </p>
            )}
          </div>

          <FormField
            label="処方医療機関"
            id="prescribingInstitution"
            value={formData.prescribingInstitution}
            onChange={(value) => updateField('prescribingInstitution', value)}
            placeholder="例：○○内科クリニック"
            required
            error={fieldErrors.prescribingInstitution}
            disabled={isSubmitting}
          />
        </div>

        {/* 服用期間・メモ */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">服用期間・メモ</h3>

          <FormField
            label="服用開始日"
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(value) => updateField('startDate', value)}
            required
            error={fieldErrors.startDate}
            disabled={isSubmitting}
          />

          <FormField
            label="服用終了日"
            id="endDate"
            type="date"
            value={formData.endDate || ''}
            onChange={(value) => updateField('endDate', value)}
            error={fieldErrors.endDate}
            disabled={isSubmitting}
          />

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-gray-700">
              メモ
            </label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="副作用や注意事項などがあれば記入してください"
              disabled={isSubmitting}
              rows={3}
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
