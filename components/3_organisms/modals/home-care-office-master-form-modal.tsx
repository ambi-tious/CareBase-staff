'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import type { HomeCareOffice } from '@/mocks/care-board-data';
import type { HomeCareOfficeFormData } from '@/validations/resident-data-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const homeCareOfficeMasterSchema = z.object({
  businessName: z
    .string()
    .min(1, '事業所名は必須です')
    .max(100, '事業所名は100文字以内で入力してください'),
  address: z.string().max(200, '住所は200文字以内で入力してください').optional(),
  phone: z.string().max(20, '電話番号は20文字以内で入力してください').optional(),
  fax: z.string().max(20, 'FAX番号は20文字以内で入力してください').optional(),
  notes: z.string().max(500, '備考は500文字以内で入力してください').optional(),
});

interface HomeCareOfficeMasterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HomeCareOfficeFormData) => Promise<boolean>;
  office?: HomeCareOffice;
  mode: 'create' | 'edit';
}

export const HomeCareOfficeMasterFormModal: React.FC<HomeCareOfficeMasterFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  office,
  mode,
}) => {
  const form = useForm<HomeCareOfficeFormData>({
    resolver: zodResolver(homeCareOfficeMasterSchema),
    defaultValues: {
      businessName: office?.businessName || '',
      address: office?.address || '',
      phone: office?.phone || '',
      fax: office?.fax || '',
      notes: office?.notes || '',
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = form;

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      // マスタ登録時はケアマネージャーフィールドを空で送信
      const submitData = {
        ...data,
        careManager: '',
      };
      const success = await onSubmit(submitData);
      if (success) {
        reset();
        onClose();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary">
            {mode === 'create'
              ? '居宅介護支援事業所マスタの新規登録'
              : '居宅介護支援事業所マスタの編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            居宅介護支援事業所マスタ情報を{mode === 'create' ? '登録' : '編集'}してください。
            必須項目（
            <span className="text-red-500">*</span>）は必ず入力してください。
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">基本情報</h3>

                <FormField
                  control={control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        事業所名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ハートケアプランセンター神戸西"
                          disabled={isSubmitting}
                        />
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
                      <FormLabel>電話番号</FormLabel>
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
                      <FormLabel>住所</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="兵庫県神戸市西区糸井2-14-9"
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
                      placeholder="事業所の特記事項があれば記入してください"
                      disabled={isSubmitting}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                {isSubmitting ? '登録中...' : mode === 'create' ? '登録' : '更新'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
