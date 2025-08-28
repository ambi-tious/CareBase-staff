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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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

  const { form, isSubmitting, error, handleSubmit } = useResidentFileForm({
    onSubmit,
    defaultValues,
  });

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

        <Form {...form}>
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

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    カテゴリ <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="カテゴリを選択してください" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {fileCategoryOptions.map((option) => (
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
              control={form.control}
              name="fileName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    ファイル名 <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="ファイル名を入力してください"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ''}
                      placeholder="ファイルの内容や用途について説明してください"
                      disabled={isSubmitting}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
        </Form>
      </DialogContent>
    </Dialog>
  );
};
