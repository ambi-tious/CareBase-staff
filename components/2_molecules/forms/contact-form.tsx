'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { contactTypeOptions, relationshipOptions } from '@/types/contact';
import { contactFormSchema, type ContactFormData } from '@/validations/contact-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';

interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<ContactFormData>;
  className?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  className = '',
}) => {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      furigana: '',
      relationship: '',
      phone1: '',
      phone2: '',
      email: '',
      address: '',
      notes: '',
      type: '連絡先',
      hasAlert: false,
      alertReason: '',
      ...initialData,
    },
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    watch,
  } = form;
  const formData = watch();

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      const success = await onSubmit(data);
      if (success) {
        form.reset();
        onCancel(); // Close modal on success
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
            {/* 基本情報 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">基本情報</h3>

              {/* 種別 */}
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>種別 *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="種別を選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from(contactTypeOptions).map((option) => (
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

              {/* 氏名 */}
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>氏名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="山田 太郎" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* フリガナ */}
              <FormField
                control={control}
                name="furigana"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>フリガナ</FormLabel>
                    <FormControl>
                      <Input placeholder="ヤマダ タロウ" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 続柄 */}
              <FormField
                control={control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>続柄</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="続柄を選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from(relationshipOptions).map((option) => (
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

            {/* 連絡先情報 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">連絡先情報</h3>

              {/* 電話番号1 */}
              <FormField
                control={control}
                name="phone1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号1</FormLabel>
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

              {/* 電話番号2 */}
              <FormField
                control={control}
                name="phone2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号2</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="080-0000-0000"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* メールアドレス */}
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@email.com"
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

          {/* 住所・備考 */}
          <div className="space-y-4">
            {/* 住所 */}
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>住所</FormLabel>
                  <FormControl>
                    <Input placeholder="東京都渋谷区..." {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* アラート設定 */}
            <div className="space-y-3 p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <FormField
                control={control}
                name="hasAlert"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-medium text-orange-800">
                        対応注意の場合はチェックを入れてください
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {formData.hasAlert && (
                <FormField
                  control={control}
                  name="alertReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-orange-800">
                        注意理由
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="例：面会NG、連絡NG、特定の時間帯のみ連絡可能など"
                          className="border-orange-300 focus:ring-orange-500 focus:border-orange-500"
                          rows={2}
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
    </div>
  );
};
