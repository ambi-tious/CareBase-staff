import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { CareCategoryKey, CareEvent, careCategories } from '@/mocks/care-board-data';
import { Calendar, Check, Clock, Save, Thermometer, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// 利用者情報セル（アイコン・名前・careLevelバッジ）共通化
import type { Resident } from '@/mocks/care-board-data';
import Image from 'next/image';
import Link from 'next/link';

// ステータスを予定と実績のみに簡略化
export type CareEventStatus = 'scheduled' | 'completed';

interface ResidentInfoCellProps {
  resident: Resident;
  className?: string;
}

export const ResidentInfoCell: React.FC<ResidentInfoCellProps> = ({ resident, className = '' }) => {
  return (
    <Link
      href={`/residents/${resident.id}`}
      className={`flex items-center gap-2 group w-full ${className}`}
    >
      <div className="relative w-12 h-12 rounded-full overflow-hidden">
        <Image
          src={resident.avatarUrl || '/placeholder.svg'}
          alt={resident.name}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-base font-medium truncate">{resident.name}</span>
        <Badge
          variant="outline"
          className="mt-0.5 w-fit px-2 py-0.5 text-xs font-normal text-carebase-blue border-carebase-blue bg-carebase-blue/10"
        >
          {resident.careLevel}
        </Badge>
      </div>
    </Link>
  );
};

// バイタル記録をまとめて表示するコンポーネント
interface VitalSignsProps {
  events: CareEvent[];
  status?: 'scheduled' | 'completed';
}

export const VitalSigns: React.FC<VitalSignsProps> = ({ events, status = 'scheduled' }) => {
  // バイタル関連のカテゴリキー
  const vitalCategories: CareCategoryKey[] = ['temperature', 'pulse', 'bloodPressure'];

  // バイタル関連のイベントをフィルタリング
  const vitalEvents = events.filter(
    (event) => event.categoryKey && vitalCategories.includes(event.categoryKey)
  );

  // バイタルイベントがない場合は何も表示しない
  if (vitalEvents.length === 0) {
    return null;
  }

  // 最初のバイタルイベントのカテゴリを取得（スタイル用）
  const firstCategory = vitalEvents[0].categoryKey as CareCategoryKey;
  const baseColorArr: number[] = CARE_CATEGORY_COLORS[firstCategory] || [231, 76, 60]; // デフォルトは赤系
  const baseColor = rgbToString(baseColorArr);

  // ステータスに応じたスタイルを取得
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          background: rgbToRgba(baseColorArr, 0.25),
          border: `2px solid ${baseColor}`,
          borderStyle: 'solid',
        };
      default:
        return {
          background: rgbToRgba(baseColorArr, 0.08),
          border: `1.5px solid ${baseColor}`,
          borderStyle: 'dotted',
        };
    }
  };

  const statusStyles = getStatusStyles();

  // 記録時間を取得（すべて同じ時間と仮定）
  const time = vitalEvents[0]?.time !== 'N/A' ? vitalEvents[0]?.time : '';

  return (
    <div
      className="flex items-center gap-1 p-1.5 rounded-md text-xs relative transition-all duration-200 w-full box-border"
      style={{
        backgroundColor: statusStyles.background,
        border: statusStyles.border,
        borderStyle: statusStyles.borderStyle as 'solid' | 'dotted',
        color: baseColor,
        width: '100%',
        maxWidth: '100%'
      }}
    >
      <Thermometer className="h-3 w-3 flex-shrink-0" />
      <span className="font-medium flex-1 truncate">バイタル</span>
      <span className="text-xs opacity-75 ml-auto">{time !== 'N/A' && time ? time : '07:00'}</span>

      {/* 実施済みの場合のみチェックマークを表示 */}
      {status === 'completed' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

// RGB配列で色を定義
export const CARE_CATEGORY_COLORS: Record<CareCategoryKey, [number, number, number]> = {
  drinking: [52, 152, 219],
  excretion: [121, 85, 72],
  breakfast: [243, 156, 18],
  lunch: [243, 156, 18],
  snack: [241, 196, 15],
  dinner: [243, 156, 18],
  bedtimeMeal: [243, 156, 18],
  medication: [155, 89, 182],
  oralCare: [155, 89, 182],
  eyeDrops: [155, 89, 182],
  bathing: [74, 144, 226],
  temperature: [231, 76, 60],
  pulse: [231, 76, 60],
  bloodPressure: [231, 76, 60],
  respiration: [231, 76, 60],
  spo2: [231, 76, 60],
};

// number[]型で受け取るよう修正
function rgbToRgba(rgb: number[], alpha: number) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

export function rgbToString(rgb: number[]) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

interface CareEventStatusProps {
  event: CareEvent;
  category?: CareCategoryKey;
  status?: CareEventStatus;
}

export const CareEventStatusComponent: React.FC<CareEventStatusProps> = ({
  event,
  category,
  status = 'scheduled', // デフォルトは予定状態
}) => {
  const Icon = getLucideIcon(event.icon);
  const baseColorArr: number[] = category ? CARE_CATEGORY_COLORS[category] : [51, 51, 51];
  const baseColor = rgbToString(baseColorArr);

  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        // 実施済み: 濃い色調、実線枠
        return {
          background: rgbToRgba(baseColorArr, 0.25), // 濃い色調
          border: `2px solid ${baseColor}`,
          borderStyle: 'solid',
        };
      default:
        // 予定: 薄い色調、点線枠
        return {
          background: rgbToRgba(baseColorArr, 0.08), // 薄い色調
          border: `1.5px solid ${baseColor}`,
          borderStyle: 'dotted',
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <div
      className="flex items-center gap-1 p-1.5 rounded-md text-xs relative transition-all duration-200 w-full box-border"
      style={{
        backgroundColor: statusStyles.background,
        border: statusStyles.border,
        borderStyle: statusStyles.borderStyle as 'solid' | 'dotted',
        color: baseColor,
        width: '100%',
        maxWidth: '100%'
      }}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="font-medium truncate flex-1">{event.label}</span>
      <span className="text-xs opacity-75 ml-auto">
        {event.time !== 'N/A' && event.time ? event.time : '07:00'}
      </span>

      {/* 実施済みの場合のみチェックマークを表示 */}
      {status === 'completed' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};

// ケア記録モーダル
interface CareRecordModalProps {
  event: CareEvent;
  residentId: number;
  residentName: string;
  status?: CareEventStatus;
  isNew?: boolean;
  onClose: () => void;
  onSave: (updatedEvent: CareEvent, residentId: number, isNew: boolean) => void;
}

export const CareRecordModal: React.FC<CareRecordModalProps> = ({
  event,
  residentId,
  residentName,
  status = 'scheduled',
  isNew = false,
  onClose,
  onSave,
}) => {
  const [updatedEvent, setUpdatedEvent] = useState<CareEvent>({ ...event });
  const [staffName, setStaffName] = useState<string>(''); // 担当者
  const [eventStatus, setEventStatus] = useState<CareEventStatus>(status);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');

  // ログインユーザー情報を取得
  useEffect(() => {
    try {
      // ローカルストレージから選択されたスタッフデータを取得
      const staffDataStr = localStorage.getItem('carebase_selected_staff_data');
      if (staffDataStr) {
        const staffData = JSON.parse(staffDataStr);
        setStaffName(staffData.staff.name);
      } else {
        // フォールバック: ローカルストレージにデータがない場合
        setStaffName('田中 花子');
      }
    } catch (error) {
      console.error('Failed to load staff data:', error);
      setStaffName('田中 花子');
    }
  }, []);

  useEffect(() => {
    if (updatedEvent.time && updatedEvent.time !== 'N/A') {
      const [hourPart, minutePart] = updatedEvent.time.split(':');
      setHour(hourPart);
      setMinute(minutePart || '00');
    } else {
      // 現在時刻をデフォルト値として設定
      const now = new Date();
      setHour(now.getHours().toString().padStart(2, '0'));
      setMinute(now.getMinutes().toString().padStart(2, '0'));
    }
  }, [updatedEvent.time]);

  // 分オプションを生成（5分間隔）
  const minuteOptions = Array.from({ length: 12 }).map((_, index) => {
    const minute = index * 5;
    return {
      value: minute.toString().padStart(2, '0'),
      label: minute.toString().padStart(2, '0'),
    };
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!hour) {
      newErrors.time = '時間を選択してください';
    }

    if (!updatedEvent.categoryKey) {
      newErrors.categoryKey = 'ケア種別を選択してください';
    }

    if (!updatedEvent.label || updatedEvent.label.trim() === '') {
      newErrors.label = '内容を入力してください';
    }

    if (!staffName || staffName.trim() === '') {
      newErrors.staffName = '担当者を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 時間と分を結合して更新
  const updateTime = () => {
    const formattedTime = `${hour}:${minute}`;
    setUpdatedEvent((prev) => ({
      ...prev,
      time: formattedTime,
    }));
  };

  // 時間または分が変更されたときに更新
  useEffect(() => {
    if (hour && minute) {
      updateTime();
    }
  }, [hour, minute]);

  const handleSave = () => {
    if (!validateForm()) return;

    // 担当者情報をdetailsに追加
    const details = `担当者: ${staffName}\n${updatedEvent.details || ''}`.trim();
    
    onSave(
      {
        ...updatedEvent,
        details,
        status: eventStatus, // 実施状況を保存
      },
      residentId,
      isNew
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {isNew ? 'ケア記録の新規作成' : 'ケア記録の編集'}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <User className="h-4 w-4" />
            <span>
              利用者: <strong>{residentName}</strong>
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2 border p-4 rounded-md bg-gray-50">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <label className="text-sm font-medium">
                  時間 <span className="text-red-500">*</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">時</label>
                  <Select value={hour} onValueChange={setHour}>
                    <SelectTrigger className={errors.time ? 'border-red-500' : ''}>
                      <SelectValue placeholder="時" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 }).map((_, i) => (
                        <SelectItem key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">分</label>
                  <Select value={minute} onValueChange={setMinute}>
                    <SelectTrigger>
                      <SelectValue placeholder="分" />
                    </SelectTrigger>
                    <SelectContent>
                      {minuteOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                ケア種別 <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                value={updatedEvent.categoryKey}
                onValueChange={(value) => {
                  const category = careCategories.find((c) => c.key === value);
                  setUpdatedEvent({
                    ...updatedEvent,
                    categoryKey: value as CareCategoryKey,
                    icon: category?.icon || 'ClipboardList',
                  });
                }}
              >
                <SelectTrigger className={errors.categoryKey ? 'border-red-500' : ''}>
                  <SelectValue placeholder="ケア種別を選択" />
                </SelectTrigger>
                <SelectContent>
                  {careCategories.map((category) => (
                    <SelectItem key={category.key} value={category.key}>
                      <div className="flex items-center gap-2">
                        {React.createElement(getLucideIcon(category.icon), {
                          className: 'h-4 w-4',
                        })}
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryKey && <p className="text-red-500 text-xs">{errors.categoryKey}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                内容 <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={updatedEvent.label}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, label: e.target.value })}
                placeholder="例: 食事摂取量8割"
                className={errors.label ? 'border-red-500' : ''}
              />
              {errors.label && <p className="text-red-500 text-xs">{errors.label}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center mb-2">
                <User className="h-4 w-4 mr-2" />
                <label className="text-sm font-medium">担当者</label>
              </div>
              <div className="p-3 border rounded-md bg-gray-50">
                <p className="text-sm font-medium">{staffName}</p>
              </div>
            </div>

            <div className="space-y-2 border p-4 rounded-md bg-gray-50">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <label className="text-sm font-medium">実施状況</label>
              </div>
              <RadioGroup
                value={eventStatus}
                onValueChange={(value) => setEventStatus(value as CareEventStatus)}
              >
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="scheduled" id="scheduled" />
                    <Label htmlFor="scheduled" className="text-sm">
                      予定
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="completed" id="completed" />
                    <Label htmlFor="completed" className="text-sm">
                      実施済み
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">備考</label>
              <textarea
                value={updatedEvent.details || ''}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, details: e.target.value })}
                placeholder="備考があれば入力してください"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            キャンセル
          </Button>
          <Button onClick={handleSave} className="bg-carebase-blue hover:bg-carebase-blue-dark">
            <Save className="h-4 w-4 mr-2" />
            {isNew ? '登録' : '更新'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
