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
import { useAbsenceForm } from '@/hooks/useAbsenceForm';
import { absenceReasonOptions } from '@/types/absence';
import type { AbsenceFormData } from '@/validations/absence-validation';
import { AlertCircle, RefreshCw, User } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface AbsenceFormProps {
  onSubmit: (data: AbsenceFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<AbsenceFormData>;
  mode: 'create' | 'edit';
  className?: string;
}

export const AbsenceForm: React.FC<AbsenceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  mode,
  className = '',
}) => {
  const [currentStaffName, setCurrentStaffName] = useState('');

  const form = useAbsenceForm({ onSubmit, initialData, mode });
  const {
    formData,
    isSubmitting,
    error,
    hasUnsavedChanges,
    onSubmit: formSubmit,
    clearError,
    control,
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
  const reasonSelectOptions = useMemo(
    () => absenceReasonOptions.map((reason) => ({ value: reason.value, label: reason.label })),
    []
  );

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formSubmit();
  };

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
                  onClick={clearError}
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

        {/* Current Staff Info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">登録者: {currentStaffName}</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">ログイン中のユーザーが自動的に設定されます</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Date and Time */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              日時設定
            </h3>

            <FormField
              control={control}
              name="startDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    開始日時 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={isSubmitting}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="endDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    終了日時 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      disabled={isSubmitting}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Right Column - Reason and Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              不在理由・備考
            </h3>

            <FormField
              control={control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    不在理由 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="不在理由を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reasonSelectOptions.map((option) => (
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

            {/* カスタム理由（その他選択時のみ表示） */}
            {formData.reason === 'other' && (
              <FormField
                control={control}
                name="customReason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      詳細理由 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="具体的な理由を入力してください"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="不在に関する詳細情報や注意事項があれば記入してください"
                      disabled={isSubmitting}
                      rows={4}
                    />
                  </FormControl>
                  <div className="text-xs text-gray-500 mt-1">
                    {(field.value || '').length}/500文字
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            キャンセル
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
          >
            {isSubmitting ? '保存中...' : mode === 'create' ? '登録' : '更新'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
