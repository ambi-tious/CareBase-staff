'use client';

import type React from 'react';
import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export interface DocumentFormData {
  title: string;
  category: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  tags: string;
}

interface DocumentFormFieldsProps {
  formData: DocumentFormData;
  updateField: (field: keyof DocumentFormData, value: string) => void;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof DocumentFormData, string>>;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
  className?: string;
}

const categoryOptions = [
  { value: '議事録', label: '議事録' },
  { value: 'ヒヤリハット', label: 'ヒヤリハット' },
  { value: '事故報告書', label: '事故報告書' },
  { value: '行事企画書', label: '行事企画書' },
  { value: 'その他', label: 'その他' },
];

const statusOptions = [
  { value: 'draft', label: '下書き' },
  { value: 'published', label: '公開済み' },
  { value: 'archived', label: 'アーカイブ' },
];

export const DocumentFormFields: React.FC<DocumentFormFieldsProps> = ({
  formData,
  updateField,
  isSubmitting,
  error,
  fieldErrors,
  onSubmit,
  onCancel,
  className = '',
}) => {
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  const isNetworkError = error?.includes('ネットワークエラー');

  return (
    <form onSubmit={handleFormSubmit} className={`space-y-4 ${className}`}>
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
                onClick={onSubmit}
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
            label="書類タイトル"
            id="title"
            value={formData.title}
            onChange={(value) => updateField('title', value)}
            placeholder="書類のタイトルを入力してください"
            required
            error={fieldErrors.title}
            disabled={isSubmitting}
          />

          <FormSelect
            label="カテゴリ"
            id="category"
            value={formData.category}
            onChange={(value) => updateField('category', value)}
            options={categoryOptions}
            required
            error={fieldErrors.category}
            disabled={isSubmitting}
          />

          <FormSelect
            label="ステータス"
            id="status"
            value={formData.status}
            onChange={(value) => updateField('status', value as 'draft' | 'published' | 'archived')}
            options={statusOptions}
            required
            error={fieldErrors.status}
            disabled={isSubmitting}
          />
        </div>

        {/* 詳細情報 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">詳細情報</h3>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-gray-700">
              説明
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="書類の説明を入力してください"
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-carebase-blue focus:border-carebase-blue disabled:bg-gray-50 disabled:text-gray-500"
              rows={4}
            />
            {fieldErrors.description && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.description}
              </p>
            )}
          </div>

          <FormField
            label="タグ"
            id="tags"
            value={formData.tags}
            onChange={(value) => updateField('tags', value)}
            placeholder="カンマ区切りでタグを入力（例: 会議,報告,2025年度）"
            error={fieldErrors.tags}
            disabled={isSubmitting}
          />
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
          {isSubmitting ? '保存中...' : '保存して次へ'}
        </Button>
      </div>
    </form>
  );
};