'use client';

import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useResidentFileForm } from '@/hooks/useResidentFileForm';
import { fileCategoryOptions } from '@/types/resident-file';
import type { ResidentFileFormData } from '@/validations/resident-file-validation';
import { AlertCircle, FileText, Image, Upload, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useRef, useState } from 'react';

interface FileUploadFormProps {
  onSubmit: (data: ResidentFileFormData, file: File) => Promise<boolean>;
  onCancel: () => void;
  className?: string;
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  onSubmit,
  onCancel,
  className = '',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { formData, updateField, isSubmitting, error, fieldErrors, handleSubmit } =
    useResidentFileForm({
      onSubmit: async (data) => {
        if (!selectedFile) {
          throw new Error('ファイルを選択してください');
        }
        return onSubmit(data, selectedFile);
      },
    });

  const categorySelectOptions = fileCategoryOptions.map((cat) => ({
    value: cat.value,
    label: cat.label,
  }));

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // File size validation (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('ファイルサイズは10MB以下にしてください');
      return;
    }

    setSelectedFile(file);

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview('');
    }

    // Auto-set category based on file type
    if (file.type.startsWith('image/')) {
      updateField('category', 'photo');
    } else if (file.type === 'application/pdf' || file.type.includes('document')) {
      updateField('category', 'medical_record');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('ファイルを選択してください');
      return;
    }
    const success = await handleSubmit();
    if (success) {
      onCancel();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <form onSubmit={onFormSubmit} className={`space-y-6 ${className}`}>
      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* File Upload Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
          ファイル選択
        </h3>

        {!selectedFile ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              ファイルをドラッグ＆ドロップするか、クリックして選択してください
            </p>
            <p className="text-xs text-gray-500">
              対応形式: 画像ファイル（JPG, PNG, GIF）、PDFファイル、Word文書 | 最大10MB
            </p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-4">
              {/* File preview */}
              <div className="flex-shrink-0">
                {filePreview ? (
                  <div className="w-24 h-24 rounded-lg overflow-hidden border">
                    <Image
                      src={filePreview}
                      alt="プレビュー"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg border bg-white flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 truncate">{selectedFile.name}</h4>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>サイズ: {formatFileSize(selectedFile.size)}</p>
                  <p>形式: {selectedFile.type}</p>
                  <p>
                    種類: {selectedFile.type.startsWith('image/') ? '画像ファイル' : '文書ファイル'}
                  </p>
                </div>
              </div>

              {/* Remove button */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemoveFile}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isSubmitting}
        />
      </div>

      {/* File Metadata Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
          ファイル情報
        </h3>

        <FormSelect
          label="カテゴリ"
          id="category"
          value={formData.category}
          onChange={(value) => updateField('category', value)}
          options={categorySelectOptions}
          required
          error={fieldErrors.category}
          disabled={isSubmitting}
        />

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">
            説明
          </Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="ファイルの内容や用途について説明してください"
            disabled={isSubmitting}
            rows={3}
          />
          {fieldErrors.description && (
            <p className="text-sm text-red-600" role="alert">
              {fieldErrors.description}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags" className="text-sm font-medium text-gray-700">
            タグ
          </Label>
          <Input
            id="tags"
            value={formData.tags || ''}
            onChange={(e) => updateField('tags', e.target.value)}
            placeholder="カンマ区切りでタグを入力（例: 医療記録,2019年度,重要）"
            disabled={isSubmitting}
          />
          {fieldErrors.tags && (
            <p className="text-sm text-red-600" role="alert">
              {fieldErrors.tags}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          キャンセル
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !selectedFile}
          className="bg-carebase-blue hover:bg-carebase-blue-dark"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isSubmitting ? 'アップロード中...' : 'アップロード'}
        </Button>
      </div>
    </form>
  );
};