'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useContactForm } from '@/hooks/useContactForm';
import { contactTypeOptions, relationshipOptions } from '@/types/contact';
import type { ContactFormData } from '@/validations/contact-validation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type React from 'react';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<ContactFormData>;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const { formData, updateField, isSubmitting, error, fieldErrors, handleSubmit, retry } =
    useContactForm({ onSubmit, initialData });

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
            <span className="h-3">{error}</span>
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

          <FormSelect
            label="種別"
            id="type"
            value={formData.type}
            onChange={(value) => updateField('type', value)}
            options={Array.from(contactTypeOptions)}
            required
            error={fieldErrors.type}
            disabled={isSubmitting}
          />

          <FormField
            label="氏名"
            id="name"
            value={formData.name}
            onChange={(value) => updateField('name', value)}
            placeholder="山田 太郎"
            required
            error={fieldErrors.name}
            disabled={isSubmitting}
          />

          <FormField
            label="フリガナ"
            id="furigana"
            value={formData.furigana || ''}
            onChange={(value) => updateField('furigana', value)}
            placeholder="ヤマダ タロウ"
            error={fieldErrors.furigana}
            disabled={isSubmitting}
          />

          <FormSelect
            label="続柄"
            id="relationship"
            value={formData.relationship || ''}
            onChange={(value) => updateField('relationship', value)}
            options={Array.from(relationshipOptions)}
            error={fieldErrors.relationship}
            disabled={isSubmitting}
          />
        </div>

        {/* 連絡先情報 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">連絡先情報</h3>

          <FormField
            label="電話番号1"
            id="phone1"
            type="tel"
            value={formData.phone1 || ''}
            onChange={(value) => updateField('phone1', value)}
            placeholder="078-000-0000"
            error={fieldErrors.phone1}
            disabled={isSubmitting}
          />

          <FormField
            label="電話番号2"
            id="phone2"
            type="tel"
            value={formData.phone2 || ''}
            onChange={(value) => updateField('phone2', value)}
            placeholder="080-0000-0000"
            error={fieldErrors.phone2}
            disabled={isSubmitting}
          />

          <FormField
            label="メールアドレス"
            id="email"
            type="email"
            value={formData.email || ''}
            onChange={(value) => updateField('email', value)}
            placeholder="example@email.com"
            error={fieldErrors.email}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* 住所・備考 */}
      <div className="space-y-4">
        <FormField
          label="住所"
          id="address"
          value={formData.address || ''}
          onChange={(value) => updateField('address', value)}
          placeholder="東京都渋谷区..."
          error={fieldErrors.address}
          disabled={isSubmitting}
        />

        {/* アラート設定 */}
        <div className="space-y-3 p-4 border border-orange-200 bg-orange-50 rounded-lg">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="hasAlert"
              checked={formData.hasAlert || false}
              onChange={(e) => updateField('hasAlert', e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="hasAlert" className="text-sm font-medium text-orange-800">
              対応注意の場合はチェックを入れてください
            </label>
          </div>

          {formData.hasAlert && (
            <div className="space-y-2">
              <label htmlFor="alertReason" className="text-sm font-medium text-orange-800">
                注意理由
              </label>
              <textarea
                id="alertReason"
                value={formData.alertReason || ''}
                onChange={(e) => updateField('alertReason', e.target.value)}
                placeholder="例：面会NG、連絡NG、特定の時間帯のみ連絡可能など"
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-50 disabled:text-gray-500"
                rows={2}
              />
              {fieldErrors.alertReason && (
                <p className="text-sm text-red-600" role="alert">
                  {fieldErrors.alertReason}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium text-gray-700">
            備考
          </label>
          <textarea
            id="notes"
            value={formData.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="その他の情報があれば記入してください"
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
