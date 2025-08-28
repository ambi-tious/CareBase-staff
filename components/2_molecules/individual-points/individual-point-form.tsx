'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
import { useIndividualPointForm } from '@/hooks/useIndividualPointForm';
import { categoryOptions, priorityOptions, statusOptions } from '@/types/individual-point';
import type { IndividualPointFormData } from '@/validations/individual-point-validation';
import { AlertCircle, FileText, Image, Play, Plus, Upload, X } from 'lucide-react';
import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';

interface IndividualPointFormProps {
  onSubmit: (data: IndividualPointFormData, mediaFiles?: File[]) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<IndividualPointFormData>;
  mode: 'create' | 'edit';
  className?: string;
}

export const IndividualPointForm: React.FC<IndividualPointFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode,
  className = '',
}) => {
  const [newTag, setNewTag] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hookForm = useIndividualPointForm({ onSubmit, initialData, mode });
  const {
    formData,
    updateField,
    isSubmitting,
    error,
    hasUnsavedChanges,
    clearError,
    control,
    handleSubmit,
  } = hookForm;

  // Memoize options to prevent unnecessary re-renders
  const categorySelectOptions = useMemo(
    () => categoryOptions.map((cat) => ({ value: cat.value, label: cat.label })),
    []
  );

  const prioritySelectOptions = useMemo(
    () => priorityOptions.map((pri) => ({ value: pri.value, label: pri.label })),
    []
  );

  const statusSelectOptions = useMemo(
    () => statusOptions.map((status) => ({ value: status.value, label: status.label })),
    []
  );

  // Media files management
  const addMediaFile = useCallback((file: File) => {
    setMediaFiles((prev) => [...prev, file]);
  }, []);

  const removeMediaFile = useCallback((index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Tags management
  const addTag = useCallback(
    (tag: string) => {
      const currentTags = formData.tags || [];
      if (!currentTags.includes(tag)) {
        updateField('tags', [...currentTags, tag]);
      }
    },
    [formData.tags, updateField]
  );

  const removeTag = useCallback(
    (tagToRemove: string) => {
      const currentTags = formData.tags || [];
      updateField(
        'tags',
        currentTags.filter((tag) => tag !== tagToRemove)
      );
    },
    [formData.tags, updateField]
  );

  const onFormSubmit = useCallback(
    async (data: IndividualPointFormData) => {
      try {
        const success = await onSubmit(data, mediaFiles);
        if (success) {
          onCancel(); // Close form on success
        }
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [onSubmit, mediaFiles, onCancel]
  );

  const handleAddTag = useCallback(() => {
    if (newTag.trim()) {
      addTag(newTag.trim());
      setNewTag('');
    }
  }, [newTag, addTag]);

  const handleTagKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddTag();
      }
    },
    [handleAddTag]
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      files.forEach((file) => {
        // File size limit: 10MB
        if (file.size > 10 * 1024 * 1024) {
          console.warn(`${file.name} のファイルサイズが大きすぎます（10MB以下にしてください）`);
          return;
        }
        addMediaFile(file);
      });

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [addMediaFile]
  );

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('video/')) return Play;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isNetworkError = error?.includes('ネットワークエラー');

  return (
    <Form {...hookForm}>
      <form onSubmit={handleSubmit(onFormSubmit)} className={`space-y-6 ${className}`}>
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
                  onClick={clearError}
                  disabled={isSubmitting}
                  className="ml-2"
                >
                  リトライ
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              基本情報
            </h3>

            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    タイトル <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例：とろみスプーン大を使用"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    カテゴリ <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={isSubmitting}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categorySelectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      優先度 <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {prioritySelectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ステータス <span className="text-red-500 ml-1">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        disabled={isSubmitting}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusSelectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column - Tags and Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              タグ・メディア
            </h3>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">タグ</Label>

              {/* Existing tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                        disabled={isSubmitting}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}

              {/* Add new tag */}
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="タグを入力"
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTag}
                  disabled={!newTag.trim() || isSubmitting}
                  className="px-3"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">メディアファイル</Label>

              {/* Upload button */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  ファイルを追加
                </Button>
                <span className="text-xs text-gray-500">画像・動画・文書ファイル（最大10MB）</span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isSubmitting}
              />

              {/* Uploaded files preview */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {mediaFiles.map((file, index) => {
                    const FileIcon = getFileIcon(file);
                    return (
                      <div
                        key={index}
                        className="relative p-3 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-start gap-2">
                          <FileIcon className="h-5 w-5 text-gray-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMediaFile(index)}
                            disabled={isSubmitting}
                            className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                詳細内容 <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="個別ポイントの詳細な内容を入力してください。&#10;&#10;例：&#10;・食事の際は、誤嚥防止のためとろみスプーン大を使用&#10;・水分摂取時も同様に使用&#10;・使用方法は添付の画像を参照"
                  disabled={isSubmitting}
                  className="min-h-32"
                  rows={6}
                />
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">{field.value.length}/1000文字</div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value || ''}
                  placeholder="追加の備考があれば入力してください"
                  disabled={isSubmitting}
                  className="min-h-20"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Unsaved Changes Warning */}
        {hasUnsavedChanges && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">未保存の変更があります</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            キャンセル
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
          >
            {isSubmitting ? '保存中...' : mode === 'create' ? '作成' : '更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
