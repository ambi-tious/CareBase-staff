import { CareEvent, CareCategoryKey } from '@/mocks/care-board-data';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import { Check } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';

// 利用者情報セル（アイコン・名前・careLevelバッジ）共通化
import Link from 'next/link';
import Image from 'next/image';
import type { Resident } from '@/mocks/care-board-data';

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

type CareEventStatus = 'scheduled' | 'completed' | 'in-progress' | 'missed';

interface CareEventStatusProps {
  event: CareEvent;
  category?: CareCategoryKey;
  status?: CareEventStatus;
}

export const CareEventStatus: React.FC<CareEventStatusProps> = ({
  event,
  category,
  status = 'scheduled'
}) => {
  const Icon = getLucideIcon(event.icon);
  const baseColorArr: number[] = category ? CARE_CATEGORY_COLORS[category] : [51, 51, 51];
  const baseColor = rgbToString(baseColorArr);
  const getStatusStyles = () => {
    switch (status) {
      case 'completed':
        return {
          background: rgbToRgba(baseColorArr, 0.19), // 30/255 ≒ 0.12, 0.19は見た目調整
          border: `2px solid ${baseColor}`,
          borderStyle: 'solid',
        };
      case 'in-progress':
        return {
          background: rgbToRgba(baseColorArr, 0.13), // 20/255 ≒ 0.08, 0.13は見た目調整
          border: `2px solid ${baseColor}`,
          borderStyle: 'dashed',
        };
      case 'missed':
        return {
          background: 'rgba(255, 229, 229, 1)',
          border: '2px solid #FF6B6B',
          borderStyle: 'solid',
        };
      default:
        return {
          background: rgbToRgba(baseColorArr, 0.06), // 10/255 ≒ 0.04, 0.06は見た目調整
          border: `1px solid ${baseColor}`,
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
      {status === 'completed' && (
        <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
          <Check className="h-3 w-3" />
        </div>
      )}
    </div>
  );
};
