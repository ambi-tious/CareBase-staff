'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
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
import { useHandoverForm } from '@/hooks/useHandoverForm';
import { categoryOptions, priorityOptions } from '@/types/handover';
import type { HandoverFormData } from '@/validations/handover-validation';
import { AlertCircle, RefreshCw, Save, Send, User } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ResidentSelector } from './resident-selector';
import { StaffSelector } from './staff-selector';

interface HandoverFormProps {
  onSubmit: (data: HandoverFormData, isDraft?: boolean) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<HandoverFormData>;
  mode: 'create' | 'edit';
  className?: string;
}

export const HandoverForm: React.FC<HandoverFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode,
  className = '',
}) => {
  const [currentStaffName, setCurrentStaffName] = useState('');

  const hookForm = useHandoverForm({ onSubmit, initialData, mode });
  const {
    formData,
    updateField,
    isSubmitting,
    isSavingDraft,
    error,
    fieldErrors,
    hasUnsavedChanges,
    clearError,
    control,
    handleSubmit,
  } = hookForm;

  // Load current staff information
  useEffect(() => {
    try {
      const staffDataStr = localStorage.getItem('carebase_selected_staff_data');
      if (staffDataStr) {
        const staffData = JSON.parse(staffDataStr);
        setCurrentStaffName(staffData.staff.name);
      } else {
        setCurrentStaffName('田中 花子'); // Fallback
      }
    } catch (error) {
      console.error('Failed to load staff data:', error);
      setCurrentStaffName('田中 花子');
    }
  }, []);

  // Memoize options to prevent unnecessary re-renders
  const categorySelectOptions = useMemo(
    () => categoryOptions.map((cat) => ({ value: cat.value, label: cat.label })),
    []
  );

  const prioritySelectOptions = useMemo(
    () => priorityOptions.map((pri) => ({ value: pri.value, label: pri.label })),
    []
  );

  const onFormSubmit = useCallback(
    async (data: HandoverFormData) => {
      try {
        const success = await onSubmit(data);
        if (success) {
          onCancel(); // Close form on success
        }
      } catch (error) {
        console.error('Form submission error:', error);
      }
    },
    [onSubmit, onCancel]
  );

  const handleSaveDraft = useCallback(async () => {
    await handleSubmit(async (data) => {
      try {
        await onSubmit(data, true);
        // Show success message but don't close form
      } catch (error) {
        console.error('Draft save error:', error);
      }
    })();
  }, [handleSubmit, onSubmit]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Callback handlers for non-form components

  const handleStaffSelectionChange = useCallback(
    (staffIds: string[]) => {
      updateField('targetStaffIds', staffIds);
    },
    [updateField]
  );

  const handleResidentSelectionChange = useCallback(
    (residentId?: string) => {
      updateField('residentId', residentId || '');
    },
    [updateField]
  );

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
                  onClick={handleClearError}
                  disabled={isSubmitting || isSavingDraft}
                  className="ml-2"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  リトライ
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Current Staff Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              申し送り者: {currentStaffName}
            </span>
          </div>
          <p className="text-xs text-blue-600 mt-1">ログイン中のユーザーが自動的に設定されます</p>
        </div>

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
                    件名 <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="例：佐藤様の血圧について"
                      disabled={isSubmitting || isSavingDraft}
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
                      disabled={isSubmitting || isSavingDraft}
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

            <FormField
              control={control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    重要度 <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      disabled={isSubmitting || isSavingDraft}
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>実施予定日</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value || ''}
                        onChange={field.onChange}
                        disabled={isSubmitting || isSavingDraft}
                        placeholder="実施予定日を選択してください"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>実施予定時刻</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        disabled={isSubmitting || isSavingDraft}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column - Target Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              申し送り先・対象者
            </h3>

            <StaffSelector
              selectedStaffIds={formData.targetStaffIds}
              onSelectionChange={handleStaffSelectionChange}
              error={fieldErrors.targetStaffIds?.message}
            />

            <ResidentSelector
              selectedResidentId={formData.residentId}
              onSelectionChange={handleResidentSelectionChange}
            />
          </div>
        </div>

        {/* Content */}
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                申し送り内容 <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="申し送り内容を詳しく記入してください。&#10;&#10;例：&#10;・本日朝のバイタル測定時に血圧が156/110と高値でした&#10;・かかりつけ医への連絡を検討してください&#10;・次回測定時も注意深く観察をお願いします"
                  disabled={isSubmitting || isSavingDraft}
                  className="min-h-32"
                  rows={8}
                  {...field}
                />
              </FormControl>
              <div className="text-xs text-gray-500 mt-1">{field.value.length}/1000文字</div>
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
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting || isSavingDraft}
          >
            キャンセル
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting || isSavingDraft}
            className="border-gray-400 text-gray-700 hover:bg-gray-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSavingDraft ? '保存中...' : '下書き保存'}
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || isSavingDraft}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? '送信中...' : mode === 'create' ? '申し送りを送信' : '更新して送信'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
