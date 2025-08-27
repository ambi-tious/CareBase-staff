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
import { useHomeCareOfficeForm } from '@/hooks/useResidentDataForm';
import type { HomeCareOfficeFormData } from '@/validations/resident-data-validation';
import React from 'react';

interface HomeCareOfficeFormProps {
  onSubmit: (data: HomeCareOfficeFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<HomeCareOfficeFormData>;
  className?: string;
}

export const HomeCareOfficeForm: React.FC<HomeCareOfficeFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const form = useHomeCareOfficeForm({ onSubmit, initialData });

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

              {/* 事業所名 */}
              <FormField
                control={control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>事業所名 *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ハートケアプランセンター神戸西"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ケアマネージャー */}
              <FormField
                control={control}
                name="careManager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ケアマネージャー</FormLabel>
                    <FormControl>
                      <Input placeholder="山口恵子" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 電話番号 */}
              <FormField
                control={control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="078-000-0000"
                        {...field}
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

              {/* FAX */}
              <FormField
                control={control}
                name="fax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>FAX</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="078-0000-0000"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 住所 */}
              <FormField
                control={control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>住所</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="兵庫県神戸市西区糸井2-14-9"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 備考 */}
          <FormField
            control={control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>備考</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="その他の情報があれば記入してください"
                    rows={3}
                    {...field}
                    disabled={isSubmitting}
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
