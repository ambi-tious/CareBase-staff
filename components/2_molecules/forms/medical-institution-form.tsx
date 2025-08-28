'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { useMedicalInstitutionForm } from '@/hooks/useResidentDataForm';
import type { MedicalInstitutionFormData } from '@/validations/resident-data-validation';
import React from 'react';

interface MedicalInstitutionFormProps {
  onSubmit: (data: MedicalInstitutionFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<MedicalInstitutionFormData>;
  className?: string;
}

export const MedicalInstitutionForm: React.FC<MedicalInstitutionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const form = useMedicalInstitutionForm({ onSubmit, initialData });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      const success = await onSubmit(data);
      if (success) {
        form.reset();
        onCancel();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <Form {...form}>
        <form onSubmit={onFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">基本情報</h3>

              <FormField
                control={control}
                name="institutionName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      医療機関名 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="松本内科クリニック" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      医師名 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="松本医師" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      電話番号 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="078-000-0000"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">連絡先情報</h3>

              <FormField
                control={control}
                name="fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FAX</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="078-0000-0000"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      住所 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="兵庫県神戸市西区新川1名ヶ原4-5-1"
                        disabled={isSubmitting}
                      />
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
                    placeholder="診療科目や特記事項があれば記入してください"
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
    </div>
  );
};
