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
import type {
  MedicalInstitutionMaster,
  MedicalInstitutionMasterFormData,
} from '@/types/medical-master';
import { zodResolver } from '@hookform/resolvers/zod';
import type React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const medicalInstitutionMasterSchema = z.object({
  institutionName: z
    .string()
    .min(1, '医療機関名は必須です')
    .max(100, '医療機関名は100文字以内で入力してください'),
  address: z.string().max(200, '住所は200文字以内で入力してください').optional(),
  phone: z.string().max(20, '電話番号は20文字以内で入力してください').optional(),
  fax: z.string().max(20, 'FAX番号は20文字以内で入力してください').optional(),
  notes: z.string().max(500, '備考は500文字以内で入力してください').optional(),
});

interface MedicalInstitutionMasterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MedicalInstitutionMasterFormData) => Promise<boolean>;
  institution?: MedicalInstitutionMaster;
  mode: 'create' | 'edit';
}

export const MedicalInstitutionMasterFormModal: React.FC<
  MedicalInstitutionMasterFormModalProps
> = ({ isOpen, onClose, onSubmit, institution, mode }) => {
  const form = useForm<MedicalInstitutionMasterFormData>({
    resolver: zodResolver(medicalInstitutionMasterSchema),
    defaultValues: {
      institutionName: institution?.institutionName || '',
      address: institution?.address || '',
      phone: institution?.phone || '',
      fax: institution?.fax || '',
      notes: institution?.notes || '',
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
      const success = await onSubmit(data);
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
            {mode === 'create' ? '医療機関マスタの新規登録' : '医療機関マスタの編集'}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            医療機関マスタ情報を{mode === 'create' ? '登録' : '編集'}してください。 必須項目（
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
                  name="institutionName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        医療機関名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="松本内科クリニック"
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
