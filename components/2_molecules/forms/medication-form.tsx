'use client';

import { ResidentMedicalInstitutionCombobox } from '@/components/1_atoms/medical/resident-medical-institution-combobox';
import { ImageUploadField } from '@/components/1_atoms/upload/image-upload-field';
import { SelectedMedicalInstitutionInfo } from '@/components/2_molecules/medical/selected-medical-institution-info';
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
import { Textarea } from '@/components/ui/textarea';
import { useMedicationForm } from '@/hooks/useMedicationForm';
import type { MedicalInstitution } from '@/mocks/residents-data';
import type { MedicationFormData } from '@/validations/medication-validation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MedicationFormProps {
  onSubmit: (data: MedicationFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<MedicationFormData>;
  medicalInstitutions: MedicalInstitution[];
  className?: string;
}

export const MedicationForm: React.FC<MedicationFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  medicalInstitutions,
  className = '',
}) => {
  const form = useMedicationForm({ onSubmit, initialData });
  const { isSubmitting, error, onSubmit: formSubmit, retry, control } = form;

  const [selectedInstitution, setSelectedInstitution] = useState<MedicalInstitution | null>(null);

  // 初期データがある場合の処理
  useEffect(() => {
    if (initialData?.prescribingInstitution && !selectedInstitution) {
      const institution = medicalInstitutions.find(
        (inst) => inst.institutionName === initialData.prescribingInstitution
      );
      if (institution) {
        setSelectedInstitution(institution);
      }
    }
  }, [initialData, medicalInstitutions, selectedInstitution]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await formSubmit();
    // Close modal on success - this is handled in the hook
    if (!error) {
      onCancel();
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
              name="thumbnailUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>画像</FormLabel>
                  <FormControl>
                    <ImageUploadField
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      accept="image/*"
                      placeholder="薬剤のサムネイル画像をアップロードしてください"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="medicationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    薬剤名 <span className="text-red-500 ml-1">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="例：アムロジピン錠5mg" disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="dosageInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用法・用量</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="例：1日1回 朝食後 1錠"
                      disabled={isSubmitting}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <FormField
                control={control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>服用開始日</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        placeholder="服用開始日を選択してください"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>服用終了日</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        placeholder="服用終了日を選択してください"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 処方医療機関・メモ */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 border-b pb-1">
              処方医療機関・メモ
            </h3>

            <FormField
              control={control}
              name="prescribingInstitution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>処方医療機関</FormLabel>
                  <FormControl>
                    <ResidentMedicalInstitutionCombobox
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      onInstitutionSelect={setSelectedInstitution}
                      medicalInstitutions={medicalInstitutions}
                      placeholder="処方医療機関を選択してください"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 医療機関情報表示エリア */}
            <SelectedMedicalInstitutionInfo
              institution={selectedInstitution}
              showDoctorName={true}
            />

            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="副作用や注意事項などがあれば記入してください"
                      disabled={isSubmitting}
                      rows={3}
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
