'use client';

import { CareManagerCombobox } from '@/components/1_atoms/care-manager/care-manager-combobox';
import { HomeCareOfficeCombobox } from '@/components/1_atoms/home-care/home-care-office-combobox';
import { HomeCareOfficeMasterFormModal } from '@/components/3_organisms/modals/home-care-office-master-form-modal';
import { HomeCareOfficeMasterModal } from '@/components/3_organisms/modals/home-care-office-master-modal';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useHomeCareOfficeForm } from '@/hooks/useResidentDataForm';
import type { HomeCareOffice } from '@/mocks/care-board-data';
import { residentDataService } from '@/services/residentDataService';
import type { HomeCareOfficeFormData } from '@/validations/resident-data-validation';
import { Settings } from 'lucide-react';
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
    watch,
    setValue,
    formState: { isSubmitting },
  } = form;

  // 居宅介護支援事業所情報の表示用ステート
  const [selectedOffice, setSelectedOffice] = React.useState<HomeCareOffice | null>(null);

  // 居宅介護支援事業所マスタモーダルの状態
  const [isMasterModalOpen, setIsMasterModalOpen] = React.useState(false);

  // 居宅介護支援事業所マスタ新規登録モーダルの状態
  const [isMasterCreateModalOpen, setIsMasterCreateModalOpen] = React.useState(false);

  // 初期データがある場合の処理
  React.useEffect(() => {
    if (initialData && initialData.businessName && !selectedOffice) {
      // 初期データから仮の事業所情報を作成
      const mockOffice: HomeCareOffice = {
        id: 'initial',
        businessName: initialData.businessName,
        careManager: initialData.careManager || '',
        phone: initialData.phone || '',
        fax: initialData.fax || '',
        address: initialData.address || '',
        notes: initialData.notes || '',
      };
      setSelectedOffice(mockOffice);
    }
  }, [initialData, selectedOffice]);

  // 事業所名の変更を監視
  const businessName = watch('businessName');
  const prevBusinessNameRef = React.useRef(businessName);

  // 事業所名が変更されたらケアマネージャー名をリセット
  React.useEffect(() => {
    if (prevBusinessNameRef.current !== businessName) {
      if (prevBusinessNameRef.current !== undefined) {
        // 初回読み込み時はリセットしない
        setValue('careManager', '');
      }
      prevBusinessNameRef.current = businessName;
    }
  }, [businessName, setValue]);

  // 事業所選択時の処理
  const handleOfficeSelect = (office: HomeCareOffice) => {
    setValue('businessName', office.businessName);
    setSelectedOffice(office);
    // ケアマネージャー名はリセット（新しい事業所に変更されたため）
    setValue('careManager', '');
  };

  // 事業所マスタモーダルのリフレッシュ処理
  const handleMasterModalRefresh = () => {
    // 事業所コンボボックスのデータを再読み込み（必要に応じて）
    // コンボボックスが自動的にデータを再読み込みします
  };

  // 新しい事業所を登録するハンドラー
  const handleCreateNewOffice = () => {
    setIsMasterCreateModalOpen(true);
  };

  // 新規作成モーダルのサブミットハンドラー
  const handleCreateSubmit = async (data: HomeCareOfficeFormData): Promise<boolean> => {
    try {
      // 事業所マスタサービスを使って新規作成
      const newOffice = await residentDataService.createHomeCareOfficeMaster(data);

      // 新規作成した事業所を自動選択
      setValue('businessName', newOffice.businessName);
      handleOfficeSelect(newOffice);

      return true;
    } catch (error) {
      console.error('Failed to create home care office:', error);
      return false;
    }
  };

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      // 事業所名とケアマネージャー名のみを送信し、連絡先情報は選択した事業所から自動取得
      const submitData = {
        businessName: data.businessName,
        careManager: data.careManager,
        phone: selectedOffice?.phone || '',
        fax: selectedOffice?.fax || '',
        address: selectedOffice?.address || '',
        notes: data.notes || '',
      };
      const success = await onSubmit(submitData);
      if (success) {
        form.reset();
        setSelectedOffice(null);
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
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">
                    居宅介護支援事業所を選択 <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <HomeCareOfficeCombobox
                        value={field.value}
                        onValueChange={field.onChange}
                        onOfficeSelect={handleOfficeSelect}
                        onCreateNew={handleCreateNewOffice}
                        placeholder="居宅介護支援事業所を選択してください"
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
                        事業所管理
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 事業所情報表示エリア */}
            {selectedOffice && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  選択された事業所の情報
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      電話番号
                    </label>
                    <div className="text-sm text-gray-900 mt-1">
                      {selectedOffice.phone || '未設定'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FAX
                    </label>
                    <div className="text-sm text-gray-900 mt-1">
                      {selectedOffice.fax || '未設定'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      住所
                    </label>
                    <div className="text-sm text-gray-900 mt-1">
                      {selectedOffice.address || '未設定'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      備考
                    </label>
                    <div className="text-sm text-gray-900 mt-1">
                      {selectedOffice.notes || '未設定'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <FormField
              control={control}
              name="careManager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">ケアマネージャーを選択</FormLabel>
                  <FormControl>
                    <CareManagerCombobox
                      value={field.value}
                      onValueChange={field.onChange}
                      homeCareOfficeName={businessName}
                      placeholder={
                        businessName
                          ? 'ケアマネージャーを選択または入力してください'
                          : 'まず事業所を選択してください'
                      }
                      disabled={isSubmitting || !businessName}
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

      {/* 事業所マスタ管理モーダル */}
      <HomeCareOfficeMasterModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        onRefresh={handleMasterModalRefresh}
      />

      {/* 事業所マスタ新規登録モーダル */}
      <HomeCareOfficeMasterFormModal
        isOpen={isMasterCreateModalOpen}
        onClose={() => setIsMasterCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
        mode="create"
      />
    </div>
  );
};
