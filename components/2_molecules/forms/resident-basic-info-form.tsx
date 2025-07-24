'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { getAllGroupOptions, getAllTeamOptions } from '@/utils/staff-utils';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

export interface ResidentBasicInfo {
  name: string;
  furigana: string;
  dob: string;
  sex: '男' | '女' | 'その他' | '';
  careLevel: string;
  floorGroup: string;
  unitTeam: string;
  roomInfo: string;
  address: string;
  admissionDate: string;
}

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

  const updateField = (field: keyof ResidentBasicInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 基本情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">基本情報</h3>

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
          value={data.furigana}
          onChange={(value) => updateField('furigana', value)}
          placeholder="ヤマダ タロウ"
          required
          error={errors.furigana}
          disabled={disabled}
        />

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
          required
          error={errors.careLevel}
          disabled={disabled}
        />
      </div>

      {/* 施設情報 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">施設情報</h3>

        <FormSelect
          label="所属フロア・グループ"
          id="floorGroup"
          value={data.floorGroup}
          onChange={(value) => updateField('floorGroup', value)}
          options={floorGroupOptions}
          error={errors.floorGroup}
          disabled={true} // Always disabled - set by current user's group
        />

        <FormSelect
          label="所属ユニット・チーム"
          id="unitTeam"
          value={data.unitTeam}
          onChange={(value) => updateField('unitTeam', value)}
          options={unitTeamOptions}
          error={errors.unitTeam}
          disabled={true} // Always disabled - set by current user's team
        />

        <FormField
          label="部屋情報"
          id="roomInfo"
          value={data.roomInfo}
          onChange={(value) => updateField('roomInfo', value)}
          placeholder="もみじ101号室"
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
          required
          error={errors.address}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
