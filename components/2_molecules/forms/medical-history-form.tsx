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
import { useMedicalHistoryForm } from '@/hooks/useMedicalHistoryForm';
import type { MedicalHistoryFormData } from '@/validations/resident-data-validation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface MedicalHistoryFormProps {
  onSubmit: (data: MedicalHistoryFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<MedicalHistoryFormData>;
  className?: string;
}

const treatmentStatusOptions = [
  { value: '治療中', label: '治療中' },
  { value: '完治', label: '完治' },
  { value: '経過観察', label: '経過観察' },
  { value: 'その他', label: 'その他' },
];

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const form = useMedicalHistoryForm({ onSubmit, initialData });
  const { isSubmitting, error, retry, control, handleSubmit } = form;

  const onFormSubmit = handleSubmit(async (data: MedicalHistoryFormData) => {
    try {
      const success = await onSubmit(data);
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const isNetworkError = error?.includes('ネットワークエラー');

  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit} className={`space-y-4 ${className}`}>
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
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">基本情報</h3>

            <FormField
              control={control}
              name="diseaseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    病名 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="高血圧症" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="onsetDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    発症年月 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      mode="month"
                      placeholder="発症年月を選択してください"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="treatmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    治療状況 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="治療状況を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {treatmentStatusOptions.map((option) => (
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

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">治療情報</h3>

            <FormField
              control={control}
              name="treatmentInstitution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>治療機関名</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="○○病院" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備考</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="症状の詳細や治療経過などがあれば記入してください"
                  disabled={isSubmitting}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
