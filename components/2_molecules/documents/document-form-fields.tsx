'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getFolderPath } from '@/mocks/hierarchical-documents';
import type { DocumentFormData } from '@/validations/document-validation';
import { Folder } from 'lucide-react';
import type React from 'react';
import type { Control } from 'react-hook-form';

interface DocumentFormFieldsProps {
  control: Control<DocumentFormData>;
  isSubmitting: boolean;
  error: string | null;
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
  control,
  isSubmitting,
  error,
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
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                書類タイトル <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="書類のタイトルを入力してください"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 保存場所表示フィールド */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">保存場所</Label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={getFolderPathDisplay()}
              disabled
              className="bg-gray-50 text-gray-600"
              readOnly
            />
            <Folder className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xs text-gray-500">書類が保存されるフォルダの場所です</p>
        </div>

        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                ステータス <span className="text-red-500">*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="ステータスを選択" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>タグ</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="カンマ区切りでタグを入力（例: 会議,報告,2025年度）"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </form>
  );
};
