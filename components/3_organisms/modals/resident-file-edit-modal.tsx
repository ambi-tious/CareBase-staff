'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useResidentFileForm } from '@/hooks/useResidentFileForm';
import type { ResidentFile } from '@/types/resident-file';
import { fileCategoryOptions } from '@/types/resident-file';
import type { ResidentFileFormData } from '@/validations/resident-file-validation';
import { AlertCircle, Edit3 } from 'lucide-react';
import type React from 'react';

interface ResidentFileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResidentFileFormData) => Promise<boolean>;
  file: ResidentFile | null;
  residentName: string;
}

export const ResidentFileEditModal: React.FC<ResidentFileEditModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  file,
  residentName,
}) => {
  if (!file) return null;

  const defaultValues: Partial<ResidentFileFormData> = {
    category: file.category,
    fileName: file.fileName,
    description: file.description || '',
  };

  const { form, isSubmitting, error, fieldErrors, handleSubmit } = useResidentFileForm({
    onSubmit,
    defaultValues,
  });

  const formData = form.watch();

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            ファイル情報の編集
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName}様のファイル「{file.originalFileName}」の情報を編集してください。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onFormSubmit} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* File info display */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm">
              <p className="font-medium text-gray-900">{file.originalFileName}</p>
              <p className="text-gray-500">
                {file.fileType} • {(file.fileSize / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
              カテゴリ <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                form.setValue('category', value as ResidentFileFormData['category'])
              }
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="カテゴリを選択してください" />
              </SelectTrigger>
              <SelectContent>
                {fileCategoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldErrors.category && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.category.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="fileName" className="text-sm font-medium text-gray-700">
              ファイル名 <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              id="fileName"
              value={formData.fileName}
              onChange={(e) => form.setValue('fileName', e.target.value)}
              placeholder="ファイル名を入力してください"
              disabled={isSubmitting}
            />
            {fieldErrors.fileName && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.fileName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              説明
            </Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => form.setValue('description', e.target.value)}
              placeholder="ファイルの内容や用途について説明してください"
              disabled={isSubmitting}
              rows={3}
            />
            {fieldErrors.description && (
              <p className="text-sm text-red-600" role="alert">
                {fieldErrors.description.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-carebase-blue hover:bg-carebase-blue-dark"
            >
              {isSubmitting ? '更新中...' : '更新'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
