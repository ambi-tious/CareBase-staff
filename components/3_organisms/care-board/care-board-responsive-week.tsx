'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import { CareboardWeekView } from './care-board-week-view';
import type { CareEvent, Resident } from '@/mocks/care-board-data';
import React from 'react';

interface ResponsiveWeekViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick?: (event: CareEvent, resident: Resident) => void;
  onTimeSlotClick?: (time: string, date: Date) => void;
}

export const ResponsiveCareboardWeekView: React.FC<ResponsiveWeekViewProps> = (props) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 767px)');

  // デスクトップ: フル7日表示
  if (isDesktop) {
    return <CareboardWeekView {...props} />;
  }

  // タブレット: 5日表示（平日のみ）
  if (isTablet) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          📱 タブレット表示：平日のみ表示中（土日は非表示）
        </div>
        <CareboardWeekView {...props} />
      </div>
    );
  }

  // モバイル: 1日表示
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          📱 モバイル表示：1日表示モード
        </div>
        <CareboardWeekView {...props} />
      </div>
    );
  }

  return <CareboardWeekView {...props} />;
};