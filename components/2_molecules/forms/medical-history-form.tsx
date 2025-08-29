'use client';

import { ResidentMedicalInstitutionCombobox } from '@/components/1_atoms/medical/resident-medical-institution-combobox';
import { SelectedMedicalInstitutionInfo } from '@/components/2_molecules/medical/selected-medical-institution-info';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { Textarea } from '@/components/ui/textarea';
import { useMedicalHistoryForm } from '@/hooks/useMedicalHistoryForm';
import type { MedicalInstitution } from '@/mocks/residents-data';
import type { MedicalHistoryFormData } from '@/validations/resident-data-validation';
import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface MedicalHistoryFormProps {
  onSubmit: (data: MedicalHistoryFormData) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<MedicalHistoryFormData>;
  medicalInstitutions: MedicalInstitution[];
  className?: string;
}

export const MedicalHistoryForm: React.FC<MedicalHistoryFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  medicalInstitutions,
  className = '',
}) => {
  const form = useMedicalHistoryForm({ onSubmit, initialData });
  const { isSubmitting, error, retry, control, handleSubmit, watch } = form;

  // 選択された医療機関の情報表示用ステート
  const [selectedInstitution, setSelectedInstitution] = React.useState<MedicalInstitution | null>(
    null
  );

  // 初期データがある場合の処理
  React.useEffect(() => {
    if (initialData?.treatmentInstitution && !selectedInstitution) {
      const institution = medicalInstitutions.find(
        (inst) => inst.institutionName === initialData.treatmentInstitution
      );
      if (institution) {
        setSelectedInstitution(institution);
      }
    }
  }, [initialData, medicalInstitutions, selectedInstitution]);

  // 医療機関選択時の処理
  const handleInstitutionSelect = (institution: MedicalInstitution | null) => {
    setSelectedInstitution(institution);
  };

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
                  <FormLabel>発症年月</FormLabel>
                  <FormControl>
                    <Input
                      type="month"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={isSubmitting}
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>治療中</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      現在治療中の場合はチェックしてください
                    </p>
                  </div>
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
                    <ResidentMedicalInstitutionCombobox
                      value={field.value || ''}
                      onValueChange={field.onChange}
                      onInstitutionSelect={handleInstitutionSelect}
                      medicalInstitutions={medicalInstitutions}
                      placeholder="治療機関を選択してください"
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
