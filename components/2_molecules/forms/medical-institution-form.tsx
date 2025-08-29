'use client';

import { DoctorCombobox } from '@/components/1_atoms/medical/doctor-combobox';
import { MedicalInstitutionCombobox } from '@/components/1_atoms/medical/medical-institution-combobox';
import { SelectedMedicalInstitutionInfo } from '@/components/2_molecules/medical/selected-medical-institution-info';
import { MedicalInstitutionMasterFormModal } from '@/components/3_organisms/modals/medical-institution-master-form-modal';
import { MedicalInstitutionMasterModal } from '@/components/3_organisms/modals/medical-institution-master-modal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMedicalInstitutionForm } from '@/hooks/useResidentDataForm';
import type {
  MedicalInstitutionMaster,
  MedicalInstitutionMasterFormData,
} from '@/types/medical-master';
import type { MedicalInstitutionFormData } from '@/validations/resident-data-validation';
import { Settings } from 'lucide-react';
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
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  // 医療機関情報の表示用ステート
  const [selectedInstitution, setSelectedInstitution] =
    React.useState<MedicalInstitutionMaster | null>(null);

  // 医療機関マスタモーダルの状態
  const [isMasterModalOpen, setIsMasterModalOpen] = React.useState(false);

  // 医療機関マスタ新規登録モーダルの状態
  const [isMasterCreateModalOpen, setIsMasterCreateModalOpen] = React.useState(false);

  // 初期データがある場合の処理
  React.useEffect(() => {
    if (initialData && initialData.institutionName && !selectedInstitution) {
      // 初期データから仮の医療機関情報を作成
      const mockInstitution: MedicalInstitutionMaster = {
        id: 'initial',
        institutionName: initialData.institutionName,
        phone: initialData.phone || '',
        fax: initialData.fax || '',
        address: initialData.address || '',
        notes: initialData.notes || '',
        createdAt: '',
        updatedAt: '',
      };
      setSelectedInstitution(mockInstitution);
    }
  }, [initialData, selectedInstitution]);

  // 医療機関名の変更を監視
  const medicalInstitutionName = watch('institutionName');
  const prevMedicalInstitutionNameRef = React.useRef(medicalInstitutionName);

  // 医療機関名が変更されたら医師名をリセット
  React.useEffect(() => {
    if (prevMedicalInstitutionNameRef.current !== medicalInstitutionName) {
      if (prevMedicalInstitutionNameRef.current !== undefined) {
        // 初回読み込み時はリセットしない
        setValue('doctorName', '');
      }
      prevMedicalInstitutionNameRef.current = medicalInstitutionName;
    }
  }, [medicalInstitutionName, setValue]);

  // 医療機関選択時の処理
  const handleInstitutionSelect = (institution: MedicalInstitutionMaster) => {
    setValue('institutionName', institution.institutionName);
    setSelectedInstitution(institution);
    // 医師名はリセット（新しい医療機関に変更されたため）
    setValue('doctorName', '');
  };

  // 医療機関マスタモーダルのリフレッシュ処理
  const handleMasterModalRefresh = () => {
    // 医療機関コンボボックスのデータを再読み込み（必要に応じて）
    // コンボボックスが自動的にデータを再読み込みします
  };

  // 新しい医療機関を登録するハンドラー
  const handleCreateNewInstitution = () => {
    setIsMasterCreateModalOpen(true);
  };

  // 新規作成モーダルのサブミットハンドラー
  const handleCreateSubmit = async (data: MedicalInstitutionMasterFormData): Promise<boolean> => {
    try {
      // 医療機関マスタサービスを使って新規作成
      const { medicalMasterService } = await import('@/services/medicalMasterService');
      const newInstitution = await medicalMasterService.createMedicalInstitution(data);

      // 新規作成した医療機関を自動選択
      setValue('institutionName', newInstitution.institutionName);
      handleInstitutionSelect(newInstitution);

      return true;
    } catch (error) {
      console.error('Failed to create medical institution:', error);
      return false;
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      // 医療機関名と医師名のみを送信し、連絡先情報は選択した医療機関から自動取得
      const submitData = {
        institutionName: data.institutionName,
        doctorName: data.doctorName,
        phone: selectedInstitution?.phone || '',
        fax: selectedInstitution?.fax || '',
        address: selectedInstitution?.address || '',
        notes: data.notes || '',
      };
      const success = await onSubmit(submitData);
      if (success) {
        form.reset();
        setSelectedInstitution(null);
        onCancel();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  return (
    <div className={`space-y-6 ${className}`}>
      <Form {...form}>
        <form onSubmit={onFormSubmit} className="space-y-6">
          {/* 選択エリア */}
          <div className="space-y-4">
            <FormField
              control={control}
              name="institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    医療機関を選択 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <MedicalInstitutionCombobox
                        value={field.value}
                        onValueChange={field.onChange}
                        onInstitutionSelect={handleInstitutionSelect}
                        onCreateNew={handleCreateNewInstitution}
                        placeholder="医療機関を選択してください"
                        disabled={isSubmitting}
                        className="w-full"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMasterModalOpen(true)}
                        disabled={isSubmitting}
                        className="text-carebase-blue border-carebase-blue hover:bg-carebase-blue-light"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        医療機関管理
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 医療機関情報表示エリア */}
            <SelectedMedicalInstitutionInfo
              institution={selectedInstitution}
              showDoctorName={false}
            />

            <FormField
              control={control}
              name="doctorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">医師を選択</FormLabel>
                  <FormControl>
                    <DoctorCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      medicalInstitutionName={medicalInstitutionName}
                      placeholder={
                        medicalInstitutionName
                          ? '医師を選択または入力してください'
                          : 'まず医療機関を選択してください'
                      }
                      disabled={isSubmitting || !medicalInstitutionName}
                      allowCustomValue={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

      {/* 医療機関マスタ管理モーダル */}
      <MedicalInstitutionMasterModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        onRefresh={handleMasterModalRefresh}
      />

      {/* 医療機関マスタ新規登録モーダル */}
      <MedicalInstitutionMasterFormModal
        isOpen={isMasterCreateModalOpen}
        onClose={() => setIsMasterCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        mode="create"
      />
    </div>
  );
};
