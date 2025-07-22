import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { CareCategoryKey, CareEvent } from '@/mocks/care-board-data';
import { CARE_CATEGORY_COLORS, rgbToString } from '@/utils/care-board-helpers';
import { Check, Clock } from 'lucide-react';
import React from 'react';

export type CareEventStatus = 'scheduled' | 'completed';

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

  const isCompleted = status === 'completed';

  return (
    <div
      className={`relative p-2 rounded-lg border-2 transition-all hover:shadow-md ${
        isCompleted ? 'border-solid bg-white shadow-sm' : 'border-dashed bg-gray-50 hover:bg-white'
      }`}
      style={{
        borderColor: baseColor,
        backgroundColor: isCompleted
          ? 'white'
          : `rgba(${baseColorArr[0]}, ${baseColorArr[1]}, ${baseColorArr[2]}, 0.05)`,
      }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="flex-shrink-0 p-1 rounded-full"
          style={{
            backgroundColor: `rgba(${baseColorArr[0]}, ${baseColorArr[1]}, ${baseColorArr[2]}, 0.1)`,
          }}
        >
          <Icon className="h-3 w-3" style={{ color: baseColor }} />
        </div>
        <span className="text-xs font-medium text-gray-800 truncate flex-1">{event.label}</span>
        {isCompleted && (
          <div className="flex-shrink-0">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </div>
          </div>
        )}
        {!isCompleted && (
          <div className="flex-shrink-0">
            <Clock className="h-3 w-3 text-gray-400" />
          </div>
        )}
      </div>
      {event.details && (
        <div className="mt-1 text-xs text-gray-600 leading-tight">{event.details}</div>
      )}
    </div>
  );
};
