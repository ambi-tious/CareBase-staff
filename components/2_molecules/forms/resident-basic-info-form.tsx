'use client';

import { FormField } from '@/components/1_atoms/forms/form-field';
import { FormSelect } from '@/components/1_atoms/forms/form-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { roomService } from '@/services/roomService';
import type { Room } from '@/types/room';
import {
  compressImage,
  formatFileSize,
  getBase64Size,
  isImageFile,
  isSupportedImageFormat,
} from '@/utils/image-utils';
import { getAllGroupOptions, getAllTeamOptions } from '@/utils/staff-utils';
import type { ResidentBasicInfo } from '@/validations/resident-validation';
import { Settings, Upload, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface ResidentBasicInfoFormProps {
  data: ResidentBasicInfo;
  onChange: (data: ResidentBasicInfo) => void;
  errors: Partial<Record<keyof ResidentBasicInfo, string>>;
  disabled?: boolean;
  handleRoomManagement: () => void;
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

// 年齢のオプション（0歳から120歳まで）
const ageOptions = Array.from({ length: 121 }, (_, i) => ({
  value: i.toString(),
  label: `${i}歳`,
}));

// Get options from staff-utils.ts
const floorGroupOptions = getAllGroupOptions();
const unitTeamOptions = getAllTeamOptions();

// 年齢と生年月日の相互変換ヘルパー関数
const calculateAgeFromBirthdate = (dob: string): string => {
  if (!dob) return '';

  const birthDate = new Date(dob);

  // JST時間で現在の日付を取得
  const today = new Date();
  const currentDate = new Date(today.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));

  let age = currentDate.getFullYear() - birthDate.getFullYear();

  // 今年の誕生日を計算
  const thisYearBirthday = new Date(
    currentDate.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate()
  );

  // 今年の誕生日がまだ来ていない場合は年齢を1減らす
  if (currentDate < thisYearBirthday) {
    age--;
  }

  return age.toString();
};

const calculateBirthdateFromAge = (ageStr: string, existingDob?: string): string => {
  if (!ageStr || isNaN(Number(ageStr))) return '';

  const age = Number(ageStr);

  // 既存の生年月日がある場合はその月日を使用、ない場合は今日の日付を使用
  let referenceDate: Date;
  if (existingDob) {
    referenceDate = new Date(existingDob);
  } else {
    // JST時間で現在の日付を取得
    const today = new Date();
    referenceDate = new Date(today.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }));
  }

  const currentYear = new Date().getFullYear();
  const currentDate = new Date();

  // 基準となる誕生日（今年の月日）
  const thisYearBirthday = new Date(currentYear, referenceDate.getMonth(), referenceDate.getDate());

  // 今年の誕生日がまだ来ていない場合は、年齢に1を足して計算
  let birthYear = currentYear - age;
  if (currentDate < thisYearBirthday) {
    birthYear = currentYear - age - 1;
  }

  // 既存の生年月日の月日を保持して年だけを変更
  const birthDate = new Date(birthYear, referenceDate.getMonth(), referenceDate.getDate());

  return birthDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }).split('T')[0];
};

export const ResidentBasicInfoForm: React.FC<ResidentBasicInfoFormProps> = ({
  data,
  onChange,
  errors,
  disabled = false,
  handleRoomManagement,
}) => {
  const hasInitialized = useRef(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [imageCompressing, setImageCompressing] = useState(false);

  // Load current logged-in user's group and team information
  useEffect(() => {
    const loadSelectedStaffData = () => {
      try {
        const staffData = localStorage.getItem('carebase_selected_staff_data');
        if (staffData) {
          const parsedData: SelectedStaffData = JSON.parse(staffData);

          // Auto-set the group and team fields based on current user only if not already initialized
          // or if the values are different (e.g., user switched staff)
          if (!hasInitialized.current || data.floorGroup == '' || data.unitTeam == '') {
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

  // Load rooms when group and team change
  useEffect(() => {
    const loadRooms = async () => {
      if (!data.floorGroup || !data.unitTeam) {
        setAvailableRooms([]);
        return;
      }

      setIsLoadingRooms(true);
      try {
        // Get group and team IDs from names
        const groupId = getGroupIdByName(data.floorGroup);
        const teamId = getTeamIdByName(data.unitTeam);

        if (groupId && teamId) {
          const rooms = await roomService.getRoomsByGroupAndTeam(groupId, teamId);
          setAvailableRooms(rooms);
        } else {
          setAvailableRooms([]);
        }
      } catch (error) {
        console.error('Failed to load rooms:', error);
        setAvailableRooms([]);
      } finally {
        setIsLoadingRooms(false);
      }
    };

    loadRooms();
  }, [data.floorGroup, data.unitTeam]);

  // 画像アップロード処理
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // 画像ファイルかチェック
      if (!isImageFile(file)) {
        alert('画像ファイルを選択してください');
        return;
      }

      // サポートされている画像形式かチェック
      if (!isSupportedImageFormat(file)) {
        alert(
          'サポートされていない画像形式です。JPEG、PNG、GIF、WebP、BMPファイルを選択してください'
        );
        return;
      }

      setImageCompressing(true);
      try {
        // 画像を自動圧縮
        const compressedImage = await compressImage(file, {
          maxWidth: 800,
          maxHeight: 600,
          quality: 0.8,
          maxSizeKB: 500,
        });

        setImagePreview(compressedImage);
        onChange({ ...data, profileImage: compressedImage });

        // 圧縮結果を表示
        const originalSize = formatFileSize(file.size);
        const compressedSize = formatFileSize(getBase64Size(compressedImage));
        console.log(`画像を圧縮しました: ${originalSize} → ${compressedSize}`);
      } catch (error) {
        console.error('Image compression failed:', error);
        alert('画像の圧縮に失敗しました。別の画像を選択してください。');
      } finally {
        setImageCompressing(false);
      }
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

  // 生年月日が存在するが年齢が空の場合、年齢を自動計算
  useEffect(() => {
    if (data.dob && !data.age) {
      const calculatedAge = calculateAgeFromBirthdate(data.dob);
      if (calculatedAge) {
        onChange({ ...data, age: calculatedAge });
      }
    }
  }, [data.dob, data.age, onChange]);

  const updateField = useCallback(
    (field: keyof ResidentBasicInfo, value: string) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  // 年齢変更時の処理
  const handleAgeChange = useCallback(
    (ageValue: string) => {
      const newData = { ...data, age: ageValue };

      // 年齢から生年月日を自動計算（既存の生年月日を基準にする）
      if (ageValue && !isNaN(Number(ageValue))) {
        const calculatedDob = calculateBirthdateFromAge(ageValue, data.dob);
        if (calculatedDob) {
          newData.dob = calculatedDob;
        }
      }

      onChange(newData);
    },
    [data, onChange]
  );

  // 生年月日変更時の処理
  const handleDobChange = useCallback(
    (dobValue: string) => {
      const newData = { ...data, dob: dobValue };

      // 生年月日から年齢を自動計算
      if (dobValue) {
        const calculatedAge = calculateAgeFromBirthdate(dobValue);
        if (calculatedAge) {
          newData.age = calculatedAge;
        }
      }

      onChange(newData);
    },
    [data, onChange]
  );

  // Helper functions to get IDs from names
  const getGroupIdByName = (groupName: string): string | null => {
    const groupMapping: Record<string, string> = {
      '介護フロア A': 'group-1',
      '介護フロア B': 'group-2',
      管理部門: 'group-3',
    };
    return groupMapping[groupName] || null;
  };

  const getTeamIdByName = (teamName: string): string | null => {
    const teamMapping: Record<string, string> = {
      朝番チーム: 'team-a1',
      日勤チーム: 'team-a2',
      夜勤チーム: 'team-a3',
      管理チーム: 'team-m1',
    };

    // For group-2, adjust team IDs
    if (data.floorGroup === '介護フロア B') {
      const group2Mapping: Record<string, string> = {
        朝番チーム: 'team-b1',
        日勤チーム: 'team-b2',
      };
      return group2Mapping[teamName] || null;
    }

    return teamMapping[teamName] || null;
  };

  // Generate room options
  const roomOptions = availableRooms.map((room) => {
    const occupancy = room.currentOccupancy || 0;
    const isFull = occupancy >= room.capacity;
    const occupancyText = `${occupancy}/${room.capacity}名`;
    const statusText = isFull ? '満室' : '空きあり';

    return {
      value: room.name,
      label: `${room.name} (${occupancyText} - ${statusText})`,
      disabled: isFull,
    };
  });

  // 空きのある部屋のみを表示するオプション
  const availableRoomOptions = roomOptions.filter((option) => !option.disabled);

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
                  style={{ opacity: imageCompressing ? 0.6 : 1 }}
                >
                  {imageCompressing ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carebase-blue mb-2"></div>
                      <span className="text-sm text-gray-500">圧縮中...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">画像を選択</span>
                    </>
                  )}
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={disabled || imageCompressing}
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
          <div className="flex-1 flex flex-col gap-4">
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

        <div className="flex gap-3">
          <FormField
            label="生年月日"
            id="dob"
            type="date"
            value={data.dob}
            onChange={handleDobChange}
            required
            error={errors.dob}
            disabled={disabled}
            className="w-1/2"
          />
          <FormSelect
            label="年齢"
            id="age"
            value={data.age || ''}
            onChange={handleAgeChange}
            options={ageOptions}
            error={errors.age}
            disabled={disabled}
            className="w-1/2"
          />
        </div>

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

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            部屋情報 <span className="text-red-500">*</span>
          </Label>
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-2">
              {isLoadingRooms ? (
                <div className="flex items-center gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-carebase-blue"></div>
                  <span className="text-sm text-gray-500">部屋情報を読み込み中...</span>
                </div>
              ) : availableRooms.length > 0 ? (
                <Select
                  value={data.roomInfo}
                  onValueChange={(value) => updateField('roomInfo', value)}
                  disabled={disabled}
                >
                  <SelectTrigger
                    className={
                      errors.roomInfo
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : ''
                    }
                  >
                    <SelectValue placeholder="部屋を選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRoomOptions.length > 0 ? (
                      <>
                        {availableRoomOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                        {roomOptions.length > availableRoomOptions.length && (
                          <>
                            <div className="px-2 py-1.5 text-xs text-gray-500 border-t">
                              満室の部屋
                            </div>
                            {roomOptions
                              .filter((option) => option.disabled)
                              .map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                  disabled
                                  className="text-gray-400"
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                          </>
                        )}
                      </>
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-gray-500">
                        利用可能な部屋がありません
                      </div>
                    )}
                  </SelectContent>
                </Select>
              ) : data.floorGroup && data.unitTeam ? (
                <div className="p-3 border border-yellow-300 rounded-md bg-yellow-50">
                  <p className="text-sm text-yellow-700">
                    選択されたグループ・チームに利用可能な部屋がありません。
                  </p>
                </div>
              ) : (
                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                  <p className="text-sm text-gray-500">
                    グループとチームを選択すると、利用可能な部屋が表示されます。
                  </p>
                </div>
              )}

              {/* 部屋の空き状況サマリー */}
              {availableRooms.length > 0 && (
                <div className="text-xs text-gray-600 mt-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      空きあり: {availableRoomOptions.length}部屋
                    </span>
                    {roomOptions.length > availableRoomOptions.length && (
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        満室: {roomOptions.length - availableRoomOptions.length}部屋
                      </span>
                    )}
                  </div>
                </div>
              )}
              {errors.roomInfo && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.roomInfo}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleRoomManagement}
              className="flex items-center gap-2 border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <Settings className="h-4 w-4" />
              部屋管理
            </Button>
          </div>
        </div>

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
      </div>
    </div>
  );
};
