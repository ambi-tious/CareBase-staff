'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllGroupOptions, getAllTeamOptions } from '@/utils/staff-utils';
import type { ResidentBasicInfo } from '@/validations/resident-validation';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ResidentBasicInfoFormProps {
  data: ResidentBasicInfo;
  onChange: (data: ResidentBasicInfo) => void;
  errors: Partial<Record<keyof ResidentBasicInfo, string>>;
  disabled?: boolean;
}

// Interface for selected staff data from localStorage
interface SelectedStaffData {
  staff: {
    id: string;
    name: string;
    furigana: string;
    role: string;
    employeeId: string;
  };
  groupName: string;
  teamName: string;
}

const sexOptions = [
  { value: '男', label: '男性' },
  { value: '女', label: '女性' },
  { value: 'その他', label: 'その他' },
];

const careLevelOptions = [
  { value: '自立', label: '自立' },
  { value: '要支援1', label: '要支援1' },
  { value: '要支援2', label: '要支援2' },
  { value: '要介護1', label: '要介護1' },
  { value: '要介護2', label: '要介護2' },
  { value: '要介護3', label: '要介護3' },
  { value: '要介護4', label: '要介護4' },
  { value: '要介護5', label: '要介護5' },
];

// Get options from staff-utils.ts
const floorGroupOptions = getAllGroupOptions();
const unitTeamOptions = getAllTeamOptions();

export const ResidentBasicInfoForm: React.FC<ResidentBasicInfoFormProps> = ({
  data,
  onChange,
  errors,
  disabled = false,
}) => {
  const [selectedStaffData, setSelectedStaffData] = useState<SelectedStaffData | null>(null);
  const hasInitialized = useRef(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load current logged-in user's group and team information
  useEffect(() => {
    const loadSelectedStaffData = () => {
      try {
        const staffData = localStorage.getItem('carebase_selected_staff_data');
        if (staffData) {
          const parsedData: SelectedStaffData = JSON.parse(staffData);
          setSelectedStaffData(parsedData);

          // Auto-set the group and team fields based on current user only if not already initialized
          // or if the values are different (e.g., user switched staff)
          if (
            !hasInitialized.current ||
            data.floorGroup !== parsedData.groupName ||
            data.unitTeam !== parsedData.teamName
          ) {
            onChange({
              ...data,
              floorGroup: parsedData.groupName,
              unitTeam: parsedData.teamName,
            });
            hasInitialized.current = true;
          }
        }
      } catch (error) {
        console.error('Failed to load selected staff data:', error);
      }
    };

    loadSelectedStaffData();

    // Listen for storage changes (in case user switches staff)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'carebase_selected_staff_data') {
        hasInitialized.current = false; // Reset initialization state when staff changes
        loadSelectedStaffData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [data, onChange]); // Added back dependencies but with proper logic to prevent infinite loop

  // 画像アップロード処理
  const handleImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // ファイルサイズ制限（5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('ファイルサイズは5MB以下にしてください');
        return;
      }

      // 画像ファイルかチェック
      if (!file.type.startsWith('image/')) {
        alert('画像ファイルを選択してください');
        return;
      }

      // FileReaderでプレビューを生成
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        onChange({ ...data, profileImage: result });
      };
      reader.readAsDataURL(file);
    },
    [data, onChange]
  );

  // 画像削除処理
  const handleImageRemove = useCallback(() => {
    setImagePreview('');
    onChange({ ...data, profileImage: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [data, onChange]);

  // 既存の画像がある場合のプレビュー設定
  useEffect(() => {
    if (data.profileImage && !imagePreview) {
      setImagePreview(data.profileImage);
    }
  }, [data.profileImage, imagePreview]);

  const updateField = useCallback(
    (field: keyof ResidentBasicInfo, value: string) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 基本情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">基本情報</h3>

        <div className="flex gap-3">
          {/* 利用者画像 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">利用者画像</Label>

            {imagePreview ? (
              <div className="relative">
                <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="利用者画像"
                    className="w-full h-full object-cover"
                    fill
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleImageRemove}
                  disabled={disabled}
                  className="mt-2 text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4 mr-1" />
                  画像を削除
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div
                  className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">画像を選択</span>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={disabled}
                  className="hidden"
                />
              </div>
            )}
            {errors.profileImage && (
              <p className="text-sm text-red-600" role="alert">
                {errors.profileImage}
              </p>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-3">
            <FormField
              label="氏名"
              id="name"
              value={data.name}
              onChange={(value) => updateField('name', value)}
              placeholder="山田 太郎"
              required
              error={errors.name}
              disabled={disabled}
            />

            <FormField
              label="フリガナ"
              id="furigana"
              value={data.furigana || ''}
              onChange={(value) => updateField('furigana', value)}
              placeholder="ヤマダ タロウ"
              error={errors.furigana}
              disabled={disabled}
            />
          </div>
        </div>

        <FormField
          label="生年月日"
          id="dob"
          type="date"
          value={data.dob}
          onChange={(value) => updateField('dob', value)}
          required
          error={errors.dob}
          disabled={disabled}
        />

        <FormSelect
          label="性別"
          id="sex"
          value={data.sex}
          onChange={(value) => updateField('sex', value)}
          options={sexOptions}
          required
          error={errors.sex}
          disabled={disabled}
        />

        <FormSelect
          label="要介護度"
          id="careLevel"
          value={data.careLevel}
          onChange={(value) => updateField('careLevel', value)}
          options={careLevelOptions}
          error={errors.careLevel}
          disabled={disabled}
        />
      </div>

      {/* 施設情報・認定情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
          施設情報・認定情報
        </h3>

        <FormSelect
          label="所属フロア・グループ"
          id="floorGroup"
          value={data.floorGroup}
          onChange={(value) => updateField('floorGroup', value)}
          options={floorGroupOptions}
          required
          error={errors.floorGroup}
        />

        <FormSelect
          label="所属ユニット・チーム"
          id="unitTeam"
          value={data.unitTeam}
          onChange={(value) => updateField('unitTeam', value)}
          options={unitTeamOptions}
          required
          error={errors.unitTeam}
        />

        <FormField
          label="部屋情報"
          id="roomInfo"
          value={data.roomInfo}
          onChange={(value) => updateField('roomInfo', value)}
          placeholder="101号室"
          error={errors.roomInfo}
          disabled={disabled}
        />

        <FormField
          label="入所日"
          id="admissionDate"
          type="date"
          value={data.admissionDate}
          onChange={(value) => updateField('admissionDate', value)}
          required
          error={errors.admissionDate}
          disabled={disabled}
        />

        <FormField
          label="住所"
          id="address"
          value={data.address}
          onChange={(value) => updateField('address', value)}
          placeholder="東京都渋谷区..."
          error={errors.address}
          disabled={disabled}
        />

        <FormField
          label="認定日"
          id="certificationDate"
          type="date"
          value={data.certificationDate}
          onChange={(value) => updateField('certificationDate', value)}
          error={errors.certificationDate}
          disabled={disabled}
        />

        <FormField
          label="認定有効期間開始日"
          id="certificationStartDate"
          type="date"
          value={data.certificationStartDate}
          onChange={(value) => updateField('certificationStartDate', value)}
          error={errors.certificationStartDate}
          disabled={disabled}
        />

        <FormField
          label="認定有効期間終了日"
          id="certificationEndDate"
          type="date"
          value={data.certificationEndDate}
          onChange={(value) => updateField('certificationEndDate', value)}
          error={errors.certificationEndDate}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
