'use client';

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
import { residentBasicInfoSchema, type ResidentBasicInfo } from '@/validations/resident-validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Settings, Upload, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

interface ResidentBasicInfoFormProps {
  onSubmit: (data: ResidentBasicInfo) => Promise<boolean>;
  onCancel: () => void;
  initialData?: Partial<ResidentBasicInfo>;
  disabled?: boolean;
  handleRoomManagement: () => void;
  className?: string;
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
  onSubmit,
  onCancel,
  initialData = {},
  disabled = false,
  handleRoomManagement,
  className = '',
}) => {
  // React Hook Form setup
  const form = useForm<ResidentBasicInfo>({
    resolver: zodResolver(residentBasicInfoSchema),
    defaultValues: {
      name: '',
      furigana: '',
      dob: '',
      sex: '男',
      age: '',
      admissionDate: '',
      dischargeDate: '',
      floorGroup: '',
      unitTeam: '',
      roomInfo: '',
      notes: '',
      profileImage: '',
      certificationDate: '',
      certificationStartDate: '',
      certificationEndDate: '',
      careLevel: '',
      ...initialData,
    },
    mode: 'onChange',
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = form;
  const watchedData = watch();

  const hasInitialized = useRef(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [imageCompressing, setImageCompressing] = useState(false);

  // Form submission handler
  const onFormSubmit = handleSubmit(async (data: ResidentBasicInfo) => {
    try {
      const success = await onSubmit(data);
      if (success) {
        onCancel();
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  // Load current logged-in user's group and team information
  useEffect(() => {
    const loadSelectedStaffData = () => {
      try {
        const staffData = localStorage.getItem('carebase_selected_staff_data');
        if (staffData) {
          const parsedData: SelectedStaffData = JSON.parse(staffData);

          // Auto-set the group and team fields based on current user only if not already initialized
          // or if the values are different (e.g., user switched staff)
          if (
            !hasInitialized.current ||
            watchedData.floorGroup == '' ||
            watchedData.unitTeam == ''
          ) {
            setValue('floorGroup', parsedData.groupName);
            setValue('unitTeam', parsedData.teamName);
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
  }, [watchedData.floorGroup, watchedData.unitTeam, setValue]); // Added back dependencies but with proper logic to prevent infinite loop

  // Load rooms when group and team change
  useEffect(() => {
    const loadRooms = async () => {
      if (!watchedData.floorGroup || !watchedData.unitTeam) {
        setAvailableRooms([]);
        return;
      }

      setIsLoadingRooms(true);
      try {
        // Get group and team IDs from names
        const groupId = getGroupIdByName(watchedData.floorGroup);
        const teamId = getTeamIdByName(watchedData.unitTeam);

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
  }, [watchedData.floorGroup, watchedData.unitTeam]);

  // 画像アップロード処理
  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // 画像ファイルかチェック
      if (!isImageFile(file)) {
        // TODO: トースト通知またはエラー表示に変更する
        console.error('画像ファイルを選択してください');
        return;
      }

      // サポートされている画像形式かチェック
      if (!isSupportedImageFormat(file)) {
        // TODO: トースト通知またはエラー表示に変更する
        console.error(
          'サポートされていない画像形式です。JPEG、PNG、GIF、WebP、BMPファイルを選択してください'
        );
        return;
      }

      setImageCompressing(true);
      try {
        // 画像を自動圧縮
        const compressedImage = await compressImage(file, {
          maxWidth: 400,
          maxHeight: 400,
          quality: 0.8,
          maxSizeKB: 500,
          forceSquare: true,
        });

        setImagePreview(compressedImage);
        setValue('profileImage', compressedImage);

        // 圧縮結果をデバッグ表示
        const originalSize = formatFileSize(file.size);
        const compressedSize = formatFileSize(getBase64Size(compressedImage));
        // 開発時のデバッグ情報として出力（console.warnは許可されている）
        if (process.env.NODE_ENV === 'development') {
          console.warn(`画像を圧縮しました: ${originalSize} → ${compressedSize}`);
        }
      } catch (error) {
        console.error('Image compression failed:', error);
        // TODO: トースト通知またはエラー表示に変更する
        console.error('画像の圧縮に失敗しました。別の画像を選択してください。');
      } finally {
        setImageCompressing(false);
      }
    },
    [setValue]
  );

  // 画像削除処理
  const handleImageRemove = useCallback(() => {
    setImagePreview('');
    setValue('profileImage', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [setValue]);

  // 既存の画像がある場合のプレビュー設定
  useEffect(() => {
    if (watchedData.profileImage && !imagePreview) {
      setImagePreview(watchedData.profileImage);
    }
  }, [watchedData.profileImage, imagePreview]);

  // 生年月日が存在するが年齢が空の場合、年齢を自動計算
  useEffect(() => {
    if (watchedData.dob && !watchedData.age) {
      const calculatedAge = calculateAgeFromBirthdate(watchedData.dob);
      if (calculatedAge) {
        setValue('age', calculatedAge);
      }
    }
  }, [watchedData.dob, watchedData.age, setValue]);

  const updateField = useCallback(
    (field: keyof ResidentBasicInfo, value: string) => {
      setValue(field, value);
    },
    [setValue]
  );

  // 年齢変更時の処理
  const handleAgeChange = useCallback(
    (ageValue: string) => {
      setValue('age', ageValue);

      // 年齢から生年月日を自動計算（既存の生年月日を基準にする）
      if (ageValue && !isNaN(Number(ageValue))) {
        const calculatedDob = calculateBirthdateFromAge(ageValue, watchedData.dob);
        if (calculatedDob) {
          setValue('dob', calculatedDob);
        }
      }
    },
    [setValue, watchedData.dob]
  );

  // 生年月日変更時の処理
  const handleDobChange = useCallback(
    (dobValue: string) => {
      setValue('dob', dobValue);

      // 生年月日から年齢を自動計算
      if (dobValue) {
        const calculatedAge = calculateAgeFromBirthdate(dobValue);
        if (calculatedAge) {
          setValue('age', calculatedAge);
        }
      }
    },
    [setValue]
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
    if (watchedData.floorGroup === '介護フロア B') {
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
    <Form {...form}>
      <form onSubmit={onFormSubmit} className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基本情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              基本情報
            </h3>

            <div className="flex gap-3">
              {/* 利用者画像 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">利用者画像</Label>

                {imagePreview ? (
                  <div className="relative">
                    <div className="w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={imagePreview}
                        alt="利用者画像"
                        className="w-32 h-32 object-cover rounded-lg"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || imageCompressing}
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        画像を変更
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleImageRemove}
                        disabled={disabled}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                        画像を削除
                      </Button>
                    </div>
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
                          <span className="text-sm text-gray-500 text-center">画像を選択</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <FormField
                  control={control}
                  name="profileImage"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={disabled || imageCompressing}
                          className="hidden"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        氏名 <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="山田 太郎"
                          disabled={disabled}
                          className={
                            errors.name
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="furigana"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>フリガナ</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="ヤマダ タロウ"
                          disabled={disabled}
                          className={
                            errors.furigana
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex gap-3 md:flex-row flex-col">
              <FormField
                control={control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="w-full md:w-2/3">
                    <FormLabel>
                      生年月日 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                          handleDobChange(value);
                        }}
                        disabled={disabled}
                        placeholder="生年月日を選択してください"
                        className={
                          errors.dob ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="age"
                render={({ field }) => (
                  <FormItem className="w-full md:w-1/3">
                    <FormLabel>年齢</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleAgeChange(value);
                      }}
                      disabled={disabled}
                    >
                      <FormControl>
                        <SelectTrigger
                          className={
                            errors.age
                              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                              : ''
                          }
                        >
                          <SelectValue placeholder="年齢を選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ageOptions.map((option) => (
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

            <FormField
              control={control}
              name="sex"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    性別 <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                    <FormControl>
                      <SelectTrigger
                        className={
                          errors.sex ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                        }
                      >
                        <SelectValue placeholder="性別を選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sexOptions.map((option) => (
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

            {/* 備考フィールド */}
            <FormField
              control={control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="利用者に関する特記事項や注意点を入力してください"
                      disabled={disabled}
                      rows={3}
                      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        errors.notes ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* 施設情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-carebase-text-primary border-b pb-2">
              施設情報
            </h3>

            <FormField
              control={control}
              name="floorGroup"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    所属フロア・グループ <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                    <FormControl>
                      <SelectTrigger
                        className={
                          errors.floorGroup
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }
                      >
                        <SelectValue placeholder="フロア・グループを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {floorGroupOptions.map((option) => (
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

            <FormField
              control={control}
              name="unitTeam"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    所属ユニット・チーム <span className="text-red-500">*</span>
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={disabled}>
                    <FormControl>
                      <SelectTrigger
                        className={
                          errors.unitTeam
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }
                      >
                        <SelectValue placeholder="ユニット・チームを選択" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {unitTeamOptions.map((option) => (
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
                      value={watchedData.roomInfo}
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
                  ) : watchedData.floorGroup && watchedData.unitTeam ? (
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
                  <FormField
                    control={control}
                    name="roomInfo"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
            <div className="flex gap-3 lg:flex-row flex-col">
              <FormField
                control={control}
                name="admissionDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>入所日</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                        placeholder="入所日を選択してください"
                        className={
                          errors.admissionDate
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="dischargeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>退所日</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={disabled}
                        placeholder="退所日を選択してください"
                        className={
                          errors.dischargeDate
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                            : ''
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                キャンセル
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                {isSubmitting ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};
