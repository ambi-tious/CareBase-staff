'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCareRecordForm } from '@/hooks/useCareRecordForm';
import { careBoardData } from '@/mocks/care-board-data';
import { categoryOptions, priorityOptions, statusOptions } from '@/types/care-record';
import type { CareRecordFormData } from '@/validations/care-record-validation';
import { AlertCircle, RefreshCw, Save, Send, User } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface CareRecordFormProps {
  onSubmit: (data: CareRecordFormData, isDraft?: boolean) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<CareRecordFormData>;
  mode: 'create' | 'edit';
  className?: string;
}

export const CareRecordForm: React.FC<CareRecordFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode,
  className = '',
}) => {
  const [currentStaffName, setCurrentStaffName] = useState('');

  const form = useCareRecordForm({ onSubmit, initialData, mode });
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

  const residentOptions = useMemo(
    () =>
      careBoardData
        .filter((resident) => resident.dischargeDate === undefined)
        .map((resident) => ({
          value: resident.id.toString(),
          label: `${resident.name} (${resident.careLevel})`,
        })),
    []
  );

  const onFormSubmit = handleSubmit(async (data: CareRecordFormData) => {
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
      // Show success message but don't close form
    } catch (error) {
      console.error('Draft save error:', error);
    }
  }, [saveDraft]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  const isNetworkError = error?.includes('ネットワークエラー');

  // Get selected resident info
  const selectedResident = formData.residentId
    ? careBoardData.find((r) => r.id.toString() === formData.residentId)
    : null;

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
            <span className="text-sm font-medium text-blue-800">担当職員: {currentStaffName}</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">ログイン中のユーザーが自動的に設定されます</p>
        </div>

        {/* Selected Resident Info */}
        {selectedResident && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                対象利用者: {selectedResident.name}
              </span>
            </div>
            <div className="text-xs text-green-600 mt-1 space-x-4">
              <span>年齢: {selectedResident.age}歳</span>
              <span>性別: {selectedResident.sex}</span>
              <span>介護度: {selectedResident.careLevel}</span>
              <span>部屋: {selectedResident.roomInfo || '未設定'}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              基本情報
            </h3>

            <FormField
              control={control}
              name="residentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    対象利用者 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting || isSavingDraft}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="利用者を選択してください" />
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    記録種別 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting || isSavingDraft}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="記録種別を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categorySelectOptions.map((option) => (
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    タイトル <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="例：朝食摂取記録"
                      disabled={isSubmitting || isSavingDraft}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="recordedAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    記録日時 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="datetime-local"
                      disabled={isSubmitting || isSavingDraft}
                    />
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      ステータス <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting || isSavingDraft}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusSelectOptions.map((option) => (
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
          </div>

          {/* Right Column - Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              記録内容
            </h3>

            <FormField
              control={control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    詳細な記録内容 <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="詳細な介護記録を入力してください。&#10;&#10;例：&#10;・朝食を8割程度摂取&#10;・食欲良好で、特に問題なし&#10;・水分摂取も十分&#10;・次回の注意点：なし"
                      disabled={isSubmitting || isSavingDraft}
                      className="min-h-32"
                      rows={12}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-gray-500 mt-1">{field.value.length}/1000文字</div>
                </FormItem>
              )}
            />

            {/* Care Content Guidelines */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">記録内容のガイドライン</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 客観的事実を正確に記録してください</li>
                <li>• 利用者様の状態変化があれば詳しく記載してください</li>
                <li>• 次回の介護に必要な申し送り事項があれば明記してください</li>
                <li>• 家族への報告が必要な事項があれば記載してください</li>
              </ul>
            </div>
          </div>
        </div>

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
            {isSubmitting ? '保存中...' : mode === 'create' ? '記録を作成' : '記録を更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
