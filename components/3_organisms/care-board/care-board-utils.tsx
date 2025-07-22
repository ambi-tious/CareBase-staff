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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import {
  CareCategoryGroupKey,
  CareCategoryKey,
  CareEvent,
  careCategories,
  careCategoryGroups,
  getCareGroup,
  getCategoriesByGroup,
  getGroupByCategory,
} from '@/mocks/care-board-data';
import { Check, Clock, HeartPulse, Save, User, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';

// 利用者情報セル（アイコン・名前・careLevelバッジ）共通化
import type { Resident } from '@/mocks/care-board-data';
import Image from 'next/image';
import Link from 'next/link';

// ステータスを予定と実績のみに簡略化
export type CareEventStatus = 'scheduled' | 'completed';

// 実施時間の有無でステータスを判定するヘルパー関数
export const getEventStatus = (event: CareEvent): CareEventStatus => {
  return event.actualTime ? 'completed' : 'scheduled';
};

interface ResidentInfoCellProps {
  resident: Resident;
  className?: string;
}

export const ResidentInfoCell: React.FC<ResidentInfoCellProps> = ({ resident, className = '' }) => {
  return (
    <Link
      href={`/residents/${resident.id}`}
      className={`flex items-center gap-2 group w-full tablet-landscape:gap-3 ${className}`}
    >
      <div className="relative w-12 h-12 tablet-landscape:w-16 tablet-landscape:h-16 rounded-full overflow-hidden">
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
        <span className="text-base font-medium truncate tablet-landscape:text-lg">{resident.name}</span>
        <Badge
          variant="outline"
          className="mt-0.5 w-fit px-2 py-0.5 text-xs font-normal text-carebase-blue border-carebase-blue bg-carebase-blue/10 tablet-landscape:text-sm tablet-landscape:px-3 tablet-landscape:py-1"
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
  const vitalCategories: CareCategoryKey[] = [
    'temperature',
    'pulse',
    'bloodPressure',
    'respiration',
    'spo2',
  ];

  // バイタル関連のイベントをフィルタリング
  const vitalEvents = events.filter(
    (event) => event.categoryKey && vitalCategories.includes(event.categoryKey)
  );

  // バイタルイベントがない場合は何も表示しない
  if (vitalEvents.length === 0) {
    return null;
  }

  // バイタルグループの色を取得
  const vitalGroup = getCareGroup('vital');
  const baseColorArr: [number, number, number] = vitalGroup?.color
    ? ([...vitalGroup.color] as [number, number, number])
    : [231, 76, 60]; // デフォルトは赤系
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

  // 記録時間を取得（実施時間があれば実施時間、なければ予定時間）
  const firstEvent = vitalEvents[0];
  const displayTime = firstEvent.actualTime || firstEvent.scheduledTime;

  return (
    <div
      className="flex items-center gap-1 p-1.5 rounded-md text-xs relative transition-all duration-200 w-full box-border tablet-landscape:p-2 tablet-landscape:text-sm tablet-landscape:gap-2"
      style={{
        backgroundColor: statusStyles.background,
        border: statusStyles.border,
        borderStyle: statusStyles.borderStyle as 'solid' | 'dotted',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <HeartPulse className="h-3 w-3 flex-shrink-0 tablet-landscape:h-4 tablet-landscape:w-4" style={{ color: baseColor }} />
      <span className="font-medium flex-1 truncate">バイタル</span>
      <span className="text-xs opacity-75 ml-auto tablet-landscape:text-sm">{displayTime}</span>

      {/* 実施済みの場合のみチェックマークを表示 */}
      {status === 'completed' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center tablet-landscape:w-5 tablet-landscape:h-5">
          <Check className="h-3 w-3 tablet-landscape:h-4 tablet-landscape:w-4" />
        </div>
      )}
    </div>
  );
};

// カテゴリグループごとの色を定義
export const CARE_CATEGORY_COLORS: Record<CareCategoryKey, [number, number, number]> =
  careCategories.reduce(
    (acc, category) => {
      const group = getCareGroup(category.groupKey);
      acc[category.key] = group?.color
        ? ([...group.color] as [number, number, number])
        : [128, 128, 128]; // デフォルトはグレー
      return acc;
    },
    {} as Record<CareCategoryKey, [number, number, number]>
  );

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

  // 実際のステータスを実施時間の有無で判定
  const actualStatus = getEventStatus(event);

  const getStatusStyles = () => {
    switch (actualStatus) {
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

  // 表示する時間（実施時間があれば実施時間、なければ予定時間）
  const displayTime = event.actualTime || event.scheduledTime;

  return (
    <div
      className="flex items-center gap-1 p-1.5 rounded-md text-xs relative transition-all duration-200 w-full box-border tablet-landscape:p-2 tablet-landscape:text-sm tablet-landscape:gap-2"
      style={{
        backgroundColor: statusStyles.background,
        border: statusStyles.border,
        borderStyle: statusStyles.borderStyle as 'solid' | 'dotted',
        width: '100%',
        maxWidth: '100%',
      }}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0 tablet-landscape:h-4 tablet-landscape:w-4" style={{ color: baseColor }} />
      <span className="font-medium truncate flex-1">{event.label}</span>
      <span className="text-xs opacity-75 ml-auto tablet-landscape:text-sm">{displayTime}</span>

      {/* 実施済みの場合のみチェックマークを表示 */}
      {actualStatus === 'completed' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center tablet-landscape:w-5 tablet-landscape:h-5">
          <Check className="h-3 w-3 tablet-landscape:h-4 tablet-landscape:w-4" />
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
  status,
  isNew = false,
  onClose,
  onSave,
}) => {
  const [updatedEvent, setUpdatedEvent] = useState<CareEvent>(event);
  const [scheduledHour, setScheduledHour] = useState('');
  const [scheduledMinute, setScheduledMinute] = useState('');
  const [actualHour, setActualHour] = useState('');
  const [actualMinute, setActualMinute] = useState('');
  const [isActualTimeVisible, setIsActualTimeVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [staffName, setStaffName] = useState('');
  const [selectedGroupKey, setSelectedGroupKey] = useState<CareCategoryGroupKey | ''>('');

  // カテゴリグループを選択したときに最初のカテゴリを自動選択
  useEffect(() => {
    if (selectedGroupKey) {
      const groupCategories = getCategoriesByGroup(selectedGroupKey);
      if (groupCategories.length > 0) {
        const firstCategory = groupCategories[0];
        setUpdatedEvent({
          ...updatedEvent,
          categoryKey: firstCategory.key,
          icon: firstCategory.icon,
        });
      }
    }
  }, [selectedGroupKey]);

  // 初期値設定時にグループも設定
  useEffect(() => {
    if (updatedEvent.categoryKey) {
      const group = getGroupByCategory(updatedEvent.categoryKey);
      if (group) {
        setSelectedGroupKey(group.key);
      }
    }
  }, [updatedEvent.categoryKey]);

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

  // 予定時間と実施時間の初期値を設定
  useEffect(() => {
    // 予定時間の設定
    if (updatedEvent.scheduledTime && updatedEvent.scheduledTime !== 'N/A') {
      const [hourPart, minutePart] = updatedEvent.scheduledTime.split(':');
      setScheduledHour(hourPart);
      setScheduledMinute(minutePart || '00');
    } else {
      // 現在時刻をデフォルト値として設定
      const now = new Date();
      setScheduledHour(now.getHours().toString().padStart(2, '0'));
      setScheduledMinute(now.getMinutes().toString().padStart(2, '0'));
    }

    // 実施時間の設定
    if (updatedEvent.actualTime) {
      const [hourPart, minutePart] = updatedEvent.actualTime.split(':');
      setActualHour(hourPart);
      setActualMinute(minutePart || '00');
      setIsActualTimeVisible(true); // 実施時間が設定されている場合は入力欄を表示
    }
  }, [updatedEvent.scheduledTime, updatedEvent.actualTime]);

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

    if (!scheduledHour) {
      newErrors.scheduledTime = '予定時間を選択してください';
    }

    if (!selectedGroupKey) {
      newErrors.groupKey = '種別グループを選択してください';
    }

    if (!updatedEvent.categoryKey) {
      newErrors.categoryKey = '詳細種別を選択してください';
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

  // 実施時間の表示/非表示を切り替える
  const toggleActualTimeVisibility = () => {
    const newVisibility = !isActualTimeVisible;
    setIsActualTimeVisible(newVisibility);

    if (!newVisibility) {
      // 非表示にする場合は実施時間をクリア
      setActualHour('');
      setActualMinute('');
    } else if (!actualMinute) {
      // 表示する場合で分が未設定の場合は00に設定
      setActualHour(scheduledHour);
      setActualMinute(scheduledMinute);
    }
  };

  // 時間と分を結合して更新
  const updateTimes = () => {
    const formattedScheduledTime = `${scheduledHour}:${scheduledMinute}`;
    const formattedActualTime =
      isActualTimeVisible && actualHour && actualMinute
        ? `${actualHour}:${actualMinute}`
        : undefined;

    setUpdatedEvent((prev) => ({
      ...prev,
      scheduledTime: formattedScheduledTime,
      actualTime: formattedActualTime,
      time: formattedActualTime || formattedScheduledTime, // 後方互換性
    }));
  };

  // 時間または分が変更されたときに更新
  useEffect(() => {
    if (scheduledHour && scheduledMinute) {
      updateTimes();
    }
  }, [scheduledHour, scheduledMinute, actualHour, actualMinute]);

  const handleSave = () => {
    if (!validateForm()) return;

    // 担当者情報をdetailsに追加
    const details = `担当者: ${staffName}\n${updatedEvent.details || ''}`.trim();

    onSave(
      {
        ...updatedEvent,
        details,
      },
      residentId,
      isNew
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] tablet-landscape:max-w-[90vw] tablet-landscape:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 tablet-landscape:text-2xl tablet-landscape:gap-3">
            {isNew ? 'ケア記録の新規作成' : 'ケア記録の編集'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 tablet-landscape:space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2 tablet-landscape:text-base tablet-landscape:gap-3">
            <User className="h-4 w-4 tablet-landscape:h-5 tablet-landscape:w-5" />
            <span>
              利用者: <strong>{residentName}</strong>
            </span>
          </div>

          {/* 2グリッドレイアウト: タブレット横向きでは2列、それ以外では1列 */}
          <div className="space-y-4 tablet-landscape:grid tablet-landscape:grid-cols-2 tablet-landscape:gap-6 tablet-landscape:space-y-0">
            {/* 左列: 時間設定 */}
            <div className="space-y-4">
              {/* 予定時間設定 */}
              <div className="space-y-2 border p-4 rounded-md bg-gray-50 tablet-landscape:p-6">
                <div className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 tablet-landscape:h-5 tablet-landscape:w-5" />
                  <label className="text-sm font-medium tablet-landscape:text-base">
                    予定時間 <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select value={scheduledHour} onValueChange={setScheduledHour}>
                      <SelectTrigger className={errors.scheduledTime ? 'border-red-500' : ''}>
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
                  <div className="text-sm flex items-center justify-center tablet-landscape:text-base">:</div>
                  <div className="flex-1">
                    <Select value={scheduledMinute} onValueChange={setScheduledMinute}>
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
                {errors.scheduledTime && (
                  <p className="text-red-500 text-xs mt-1 tablet-landscape:text-sm">{errors.scheduledTime}</p>
                )}
              </div>

              {/* 実施時間設定 */}
              <div className="border rounded-md overflow-hidden">
                <div
                  className={`p-4 cursor-pointer transition-colors tablet-landscape:p-6 ${
                    isActualTimeVisible
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 hover:bg-blue-100'
                  }`}
                  onClick={toggleActualTimeVisibility}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 mr-2 tablet-landscape:h-5 tablet-landscape:w-5" />
                      <label className="text-sm font-medium cursor-pointer tablet-landscape:text-base">実施時間</label>
                    </div>
                    <div className="flex items-center">
                      {isActualTimeVisible && actualHour && actualMinute && (
                        <span className="text-sm text-green-600 font-medium mr-2 tablet-landscape:text-base">
                          {actualHour}:{actualMinute}
                        </span>
                      )}
                      <div
                        className={`transform transition-transform tablet-landscape:scale-110 ${isActualTimeVisible ? 'rotate-180' : ''}`}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="tablet-landscape:w-5 tablet-landscape:h-5"
                        >
                          <path
                            d="M6 9L12 15L18 9"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 tablet-landscape:text-sm">
                    {isActualTimeVisible
                      ? '実施時間が設定されています（実施済み）'
                      : 'クリックして実施時間を入力（未実施）'}
                  </p>
                </div>

                {isActualTimeVisible && (
                  <div className="p-4 bg-white border-t tablet-landscape:p-6">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Select value={actualHour} onValueChange={setActualHour}>
                          <SelectTrigger>
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
                      <div className="text-sm flex items-center justify-center tablet-landscape:text-base">:</div>
                      <div className="flex-1">
                        <Select value={actualMinute} onValueChange={setActualMinute}>
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
                  </div>
                )}
              </div>
            </div>

            {/* 右列: ケア種別設定 */}
            <div className="space-y-4">
              {/* カテゴリグループ選択 */}
              <div className="space-y-2">
                <label className="text-sm font-medium tablet-landscape:text-base">
                  種別グループ <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  value={selectedGroupKey}
                  onValueChange={(value) => setSelectedGroupKey(value as CareCategoryGroupKey)}
                >
                  <SelectTrigger className={errors.groupKey ? 'border-red-500' : ''}>
                    <SelectValue placeholder="ケア種別グループを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {careCategoryGroups.map((group) => (
                      <SelectItem key={group.key} value={group.key}>
                        <div className="flex items-center gap-2">
                          {React.createElement(getLucideIcon(group.icon), {
                            className: 'h-4 w-4 tablet-landscape:h-5 tablet-landscape:w-5',
                          })}
                          <span>{group.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.groupKey && <p className="text-red-500 text-xs tablet-landscape:text-sm">{errors.groupKey}</p>}
              </div>

              {/* カテゴリ選択（グループが選択された場合のみ表示） */}
              {selectedGroupKey && (
                <div className="space-y-2">
                  <label className="text-sm font-medium tablet-landscape:text-base">
                    詳細種別 <span className="text-red-500 ml-1">*</span>
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
                      <SelectValue placeholder="詳細種別を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCategoriesByGroup(selectedGroupKey).map((category) => (
                        <SelectItem key={category.key} value={category.key}>
                          <div className="flex items-center gap-2">
                            {React.createElement(getLucideIcon(category.icon), {
                              className: 'h-4 w-4 tablet-landscape:h-5 tablet-landscape:w-5',
                            })}
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryKey && (
                    <p className="text-red-500 text-xs tablet-landscape:text-sm">{errors.categoryKey}</p>
                  )}
                </div>
              )}

              {/* 担当者情報 */}
              <div className="flex items-center gap-2 text-sm text-gray-500 p-4 bg-gray-50 rounded-md tablet-landscape:text-base tablet-landscape:gap-3 tablet-landscape:p-6">
                <User className="h-4 w-4 tablet-landscape:h-5 tablet-landscape:w-5" />
                <span>
                  担当者: <strong>{staffName}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 下段: 内容と備考（全幅） */}
          <div className="space-y-4 tablet-landscape:grid tablet-landscape:grid-cols-2 tablet-landscape:gap-6 tablet-landscape:space-y-0">
            {/* 内容入力 */}
            <div className="space-y-2">
              <label className="text-sm font-medium tablet-landscape:text-base">
                内容 <span className="text-red-500 ml-1">*</span>
              </label>
              <Input
                value={updatedEvent.label}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, label: e.target.value })}
                placeholder="例: 食事摂取量8割"
                className={errors.label ? 'border-red-500' : ''}
              />
              {errors.label && <p className="text-red-500 text-xs tablet-landscape:text-sm">{errors.label}</p>}
            </div>

            {/* 備考入力 */}
            <div className="space-y-2">
              <label className="text-sm font-medium tablet-landscape:text-base">備考</label>
              <textarea
                value={updatedEvent.details || ''}
                onChange={(e) => setUpdatedEvent({ ...updatedEvent, details: e.target.value })}
                placeholder="備考があれば入力してください"
                className="w-full px-3 py-2 border border-gray-300 rounded-md tablet-landscape:px-4 tablet-landscape:py-3 tablet-landscape:text-base"
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-2 tablet-landscape:gap-4 tablet-landscape:pt-6">
          <Button variant="outline" onClick={onClose} className="tablet-landscape:px-6 tablet-landscape:py-3">
            <X className="h-4 w-4 mr-2 tablet-landscape:h-5 tablet-landscape:w-5" />
            キャンセル
          </Button>
          <Button onClick={handleSave} className="bg-carebase-blue hover:bg-carebase-blue-dark tablet-landscape:px-6 tablet-landscape:py-3">
            <Save className="h-4 w-4 mr-2 tablet-landscape:h-5 tablet-landscape:w-5" />
            {isNew ? '登録' : '更新'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
