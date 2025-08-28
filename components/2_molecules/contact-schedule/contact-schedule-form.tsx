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
import { useContactScheduleForm } from '@/hooks/useContactScheduleForm';
import { careBoardData } from '@/mocks/care-board-data';
import { assignmentOptions, priorityOptions, typeOptions } from '@/types/contact-schedule';
import type { ContactScheduleFormData } from '@/validations/contact-schedule-validation';
import { AlertCircle, Save, Send, User } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface ContactScheduleFormProps {
  onSubmit: (data: ContactScheduleFormData, isDraft?: boolean) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<ContactScheduleFormData>;
  mode: 'create' | 'edit';
  className?: string;
}

export const ContactScheduleForm: React.FC<ContactScheduleFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode,
  className = '',
}) => {
  const [currentStaffName, setCurrentStaffName] = useState('');

  const form = useContactScheduleForm({ onSubmit, initialData, mode });
  const {
    formData,
    updateField,
    isSubmitting,
    isSavingDraft,
    error,
    fieldErrors,
    hasUnsavedChanges,
    submitFinal,
    saveDraft,
    clearError,
    control,
    handleSubmit,
  } = form;

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
  const typeSelectOptions = useMemo(
    () => typeOptions.map((type) => ({ value: type.value, label: type.label })),
    []
  );

  const prioritySelectOptions = useMemo(
    () => priorityOptions.map((priority) => ({ value: priority.value, label: priority.label })),
    []
  );

  const assignmentSelectOptions = useMemo(
    () =>
      assignmentOptions.map((assignment) => ({ value: assignment.value, label: assignment.label })),
    []
  );

  const residentOptions = useMemo(
    () => [
      { value: 'none', label: '選択なし' },
      ...careBoardData
        .filter((resident) => resident.dischargeDate === undefined)
        .map((resident) => ({
          value: resident.id.toString(),
          label: `${resident.name} (${resident.careLevel})`,
        })),
    ],
    []
  );

  const onFormSubmit = handleSubmit(async (data: ContactScheduleFormData) => {
    try {
      const success = await onSubmit(data, false);
      if (success) {
        onCancel(); // Close form on success
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const handleSaveDraft = useCallback(async () => {
    try {
      await saveDraft();
      // console.log('Draft saved successfully');
    } catch (error) {
      console.error('Draft save error:', error);
    }
  }, [saveDraft]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  const isNetworkError = error?.includes('ネットワークエラー');

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className={`space-y-6 ${className}`}>
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
            <span className="text-sm font-medium text-blue-800">作成者: {currentStaffName}</span>
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
                    タイトル <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="例：夏季感染症対策について"
                      disabled={isSubmitting || isSavingDraft}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    種別 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting || isSavingDraft}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="種別を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeSelectOptions.map((option) => (
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
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    重要度 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting || isSavingDraft}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="重要度を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {prioritySelectOptions.map((option) => (
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
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    対象者 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting || isSavingDraft}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="対象者を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assignmentSelectOptions.map((option) => (
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
          </div>

          {/* Right Column - Schedule Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              日時・関連情報
            </h3>

            <FormField
              control={control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    実施日 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting || isSavingDraft}
                      placeholder="実施日を選択してください"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始時刻</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" disabled={isSubmitting || isSavingDraft} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>終了時刻</FormLabel>
                    <FormControl>
                      <Input {...field} type="time" disabled={isSubmitting || isSavingDraft} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={control}
              name="relatedResidentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>関連利用者</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'none' ? '' : value)}
                    value={!field.value || field.value === '' ? 'none' : field.value}
                    disabled={isSubmitting || isSavingDraft}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="関連利用者を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {residentOptions.map((option) => (
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
                      placeholder="例：感染対策,夏季対策,健康管理"
                      disabled={isSubmitting || isSavingDraft}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                内容 <span className="text-red-500 ml-1">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="連絡・予定の詳細内容を入力してください。&#10;&#10;例：&#10;・夏季に多発する感染性胃腸炎の予防対策を強化します&#10;・食事前後の手洗い徹底をお願いします&#10;・利用者様の体調変化に注意してください"
                  disabled={isSubmitting || isSavingDraft}
                  className="min-h-32"
                  rows={8}
                />
              </FormControl>
              <FormMessage />
              <div className="text-xs text-gray-500 mt-1">{field.value.length}/1000文字</div>
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
            {isSubmitting ? '作成中...' : mode === 'create' ? '作成' : '更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
