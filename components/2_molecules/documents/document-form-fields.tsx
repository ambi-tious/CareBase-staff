'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getFolderPath } from '@/mocks/hierarchical-documents';
import type { DocumentFormData } from '@/validations/document-validation';
import { Folder } from 'lucide-react';
import type React from 'react';

interface DocumentFormFieldsProps {
  formData: DocumentFormData;
  updateField: (field: keyof DocumentFormData, value: string) => void;
  isSubmitting: boolean;
  error: string | null;
  fieldErrors: Partial<Record<keyof DocumentFormData, string>>;
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
  className?: string;
  folderId?: string; // フォルダID
  folderName?: string; // フォルダ名（表示用）
}

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
  folderId,
  folderName,
}) => {
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  // フォルダパスを取得して表示文字列を生成
  const getFolderPathDisplay = () => {
    if (!folderId) return 'ルート';

    try {
      const folderPath = getFolderPath(folderId);
      return (
        folderPath
          .filter((item) => item.id !== 'root')
          .map((item) => item.name)
          .join(' > ') || 'ルート'
      );
    } catch (error) {
      console.error('Failed to get folder path:', error);
      return folderName || 'ルート';
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className={`space-y-4 ${className}`}>
      {/* Folder Location Info */}
      {folderId && (
        <Alert className="border-blue-200 bg-blue-50">
          <Folder className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            保存場所: {getFolderPathDisplay()}
          </AlertDescription>
        </Alert>
      )}

      {/* 基本情報 */}
      <div className="space-y-4">
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

        {/* 保存場所表示フィールド */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">保存場所</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={getFolderPathDisplay()}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
            <Folder className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500">書類が保存されるフォルダの場所です</p>
        </div>

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
    </form>
  );
};
