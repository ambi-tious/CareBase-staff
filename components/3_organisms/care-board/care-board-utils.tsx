import { Badge } from '@/components/ui/badge';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { CareCategoryKey, CareEvent } from '@/mocks/care-board-data';
import { Check, Thermometer } from 'lucide-react';
import React from 'react';

// 利用者情報セル（アイコン・名前・careLevelバッジ）共通化
import type { Resident } from '@/mocks/care-board-data';
import Image from 'next/image';
import Link from 'next/link';

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
      className="flex items-center gap-1 p-1.5 rounded-md text-xs relative transition-all duration-200 w-full"
      style={{
        backgroundColor: statusStyles.background,
        border: statusStyles.border,
        borderStyle: statusStyles.borderStyle as any,
        color: baseColor,
      }}
    >
      <Thermometer className="h-3 w-3 flex-shrink-0" />
      <span className="font-medium">バイタル</span>
      {time !== 'N/A' && <span className="text-xs opacity-75 ml-auto">{time}</span>}

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

// ステータスを予定と実績のみに簡略化
type CareEventStatus = 'scheduled' | 'completed';

interface CareEventStatusProps {
  event: CareEvent;
  category?: CareCategoryKey;
  status?: CareEventStatus;
}

export const CareEventStatus: React.FC<CareEventStatusProps> = ({
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
      className="flex items-center gap-1 p-1.5 rounded-md text-xs relative transition-all duration-200 w-full"
      style={{
        backgroundColor: statusStyles.background,
        border: statusStyles.border,
        borderStyle: statusStyles.borderStyle as any,
        color: baseColor,
      }}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" />
      <span className="font-medium truncate">{event.label}</span>
      {event.time !== 'N/A' && <span className="text-xs opacity-75 ml-auto">{event.time}</span>}

      {/* 実施済みの場合のみチェックマークを表示 */}
      {status === 'completed' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};
