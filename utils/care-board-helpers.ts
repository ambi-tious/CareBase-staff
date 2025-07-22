import type { CareCategoryKey, CareEvent } from '@/mocks/care-board-data';
import { careCategories, getCareGroup } from '@/mocks/care-board-data';

export type CareEventStatus = 'scheduled' | 'completed';

// 実施時間の有無でステータスを判定するヘルパー関数
export const getEventStatus = (event: CareEvent): CareEventStatus => {
  return event.actualTime ? 'completed' : 'scheduled';
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
export function rgbToRgba(rgb: number[], alpha: number) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

export function rgbToString(rgb: number[]) {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
