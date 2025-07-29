'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useMedicalInstitutionForm } from '@/hooks/useResidentDataForm';
import type { MedicalInstitutionFormData } from '@/validations/resident-data-validation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type React from 'react';

interface MedicalInstitutionFormProps {
  onSubmit: (data: MedicalInstitutionFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<MedicalInstitutionFormData>;
  className?: string;
}

export const MedicalInstitutionForm: React.FC<MedicalInstitutionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const { formData, updateField, isSubmitting, error, fieldErrors, handleSubmit } =
    useMedicalInstitutionForm({ onSubmit, initialData });

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
            label="医療機関名"
            id="institutionName"
            value={formData.institutionName}
            onChange={(value) => updateField('institutionName', value)}
            placeholder="松本内科クリニック"
            required
            error={fieldErrors.institutionName}
            disabled={isSubmitting}
          />

          <FormField
            label="医師名"
            id="doctorName"
            value={formData.doctorName}
            onChange={(value) => updateField('doctorName', value)}
            placeholder="松本医師"
            required
            error={fieldErrors.doctorName}
            disabled={isSubmitting}
          />

          <FormField
            label="電話番号"
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(value) => updateField('phone', value)}
            placeholder="078-000-0000"
            required
            error={fieldErrors.phone}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">連絡先情報</h3>

          <FormField
            label="FAX"
            id="fax"
            type="tel"
            value={formData.fax || ''}
            onChange={(value) => updateField('fax', value)}
            placeholder="078-0000-0000"
            error={fieldErrors.fax}
            disabled={isSubmitting}
          />

          <FormField
            label="住所"
            id="address"
            value={formData.address}
            onChange={(value) => updateField('address', value)}
            placeholder="兵庫県神戸市西区新川1名ヶ原4-5-1"
            required
            error={fieldErrors.address}
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
          placeholder="診療科目や特記事項があれば記入してください"
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
