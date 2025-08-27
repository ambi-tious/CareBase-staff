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
import { Textarea } from '@/components/ui/textarea';
import { useMedicationStatusForm } from '@/hooks/useMedicationStatusForm';
import type { MedicationStatusFormData } from '@/validations/medication-status-validation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface MedicationStatusFormProps {
  onSubmit: (data: MedicationStatusFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<MedicationStatusFormData>;
  className?: string;
}

export const MedicationStatusForm: React.FC<MedicationStatusFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const form = useMedicationStatusForm({ onSubmit, initialData });
  const { isSubmitting, error, retry, control } = form;

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await form.onSubmit();
      if (!error) {
        onCancel();
      }
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const isNetworkError = error?.includes('ネットワークエラー');

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className={`space-y-4 ${className}`}>
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
                  onClick={retry}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">基本情報</h3>

            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    登録日 <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      placeholder="登録日を選択してください"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      placeholder="例：朝食後の薬を服用済み、副作用なし"
                      disabled={isSubmitting}
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* メモ */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">メモ</h3>

            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="特記事項や観察内容があれば記入してください"
                      disabled={isSubmitting}
                      rows={6}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-carebase-blue hover:bg-carebase-blue-dark"
          >
            {isSubmitting ? '登録中...' : '登録'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
