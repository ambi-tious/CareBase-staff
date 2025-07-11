'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useMedicalHistoryForm } from '@/hooks/useResidentDataForm';
import type { MedicalHistoryFormData } from '@/types/resident-data';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type React from 'react';

interface MedicalHistoryFormProps {
  onSubmit: (data: MedicalHistoryFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<MedicalHistoryFormData>;
  className?: string;
}

const treatmentStatusOptions = [
  { value: '治療中', label: '治療中' },
  { value: '完治', label: '完治' },
  { value: '経過観察', label: '経過観察' },
  { value: 'その他', label: 'その他' },
];

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const { formData, updateField, isSubmitting, error, fieldErrors, handleSubmit } =
    useMedicalHistoryForm({ onSubmit, initialData });

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      onCancel();
    }
  };

  const isNetworkError = error?.includes('ネットワークエラー');

  return (
    <form onSubmit={onFormSubmit} className={`space-y-4 ${className}`}>
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
                onClick={handleSubmit}
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
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">基本情報</h3>

          <FormField
            label="病名"
            id="diseaseName"
            value={formData.diseaseName}
            onChange={(value) => updateField('diseaseName', value)}
            placeholder="高血圧症"
            required
            error={fieldErrors.diseaseName}
            disabled={isSubmitting}
          />

          <FormField
            label="発症年月"
            id="onsetDate"
            type="month"
            value={formData.onsetDate}
            onChange={(value) => updateField('onsetDate', value)}
            required
            error={fieldErrors.onsetDate}
            disabled={isSubmitting}
          />

          <FormSelect
            label="治療状況"
            id="treatmentStatus"
            value={formData.treatmentStatus}
            onChange={(value) => updateField('treatmentStatus', value)}
            options={treatmentStatusOptions}
            required
            error={fieldErrors.treatmentStatus}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">治療情報</h3>

          <FormField
            label="治療機関名"
            id="treatmentInstitution"
            value={formData.treatmentInstitution || ''}
            onChange={(value) => updateField('treatmentInstitution', value)}
            placeholder="○○病院"
            error={fieldErrors.treatmentInstitution}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
          備考
        </label>
        <textarea
          id="notes"
          value={formData.notes || ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="症状の詳細や治療経過などがあれば記入してください"
          disabled={isSubmitting}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-carebase-blue focus:border-carebase-blue disabled:bg-gray-50 disabled:text-gray-500"
          rows={3}
        />
        {fieldErrors.notes && (
          <p className="text-sm text-red-600" role="alert">
            {fieldErrors.notes}
          </p>
        )}
      </div>

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
