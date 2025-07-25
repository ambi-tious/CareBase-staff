'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Resident } from '@/mocks/care-board-data';
import type { CareRecord } from '@/types/care-record';
import { categoryOptions } from '@/types/care-record';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';

interface RecordDataMonthlyViewProps {
  resident: Resident;
  selectedDate: Date | null;
  careRecords: CareRecord[];
}

export const RecordDataMonthlyView: React.FC<RecordDataMonthlyViewProps> = ({
  resident,
  selectedDate,
  careRecords,
}) => {
  const monthlyStats = useMemo(() => {
    if (!selectedDate) return {};

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    const monthlyRecords = careRecords.filter((record) => {
      const recordDate = new Date(record.recordedAt);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });

    const categoryStats: Record<string, number> = {};
    monthlyRecords.forEach((record) => {
      categoryStats[record.category] = (categoryStats[record.category] || 0) + 1;
    });

    const dailyStats: Record<string, number> = {};
    monthlyRecords.forEach((record) => {
      const dateKey = format(new Date(record.recordedAt), 'yyyy-MM-dd');
      dailyStats[dateKey] = (dailyStats[dateKey] || 0) + 1;
    });

    return {
      total: monthlyRecords.length,
      categoryStats,
      dailyStats,
      monthlyRecords,
    };
  }, [careRecords, selectedDate]);

  const calendarDays = useMemo(() => {
    if (!selectedDate) return [];

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);

    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [selectedDate]);

  const getCategoryLabel = (categoryKey: string) => {
    const category = categoryOptions.find((opt) => opt.value === categoryKey);
    return category?.label || categoryKey;
  };

  const getRecordCountForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return monthlyStats.dailyStats?.[dateKey] || 0;
  };

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count <= 2) return 'bg-green-200';
    if (count <= 5) return 'bg-green-400';
    if (count <= 10) return 'bg-green-600';
    return 'bg-green-800';
  };

  if (!selectedDate) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-carebase-blue" />
            {format(selectedDate, 'yyyy年MM月', { locale: ja })}の記録カレンダー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-1">
              {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}

              {calendarDays.map((day) => {
                const recordCount = getRecordCountForDate(day);
                const dayIsToday = isToday(day);
                const isCurrentMonth = isSameMonth(day, selectedDate);

                return (
                  <div
                    key={day.toISOString()}
                    className={`
                      relative p-2 text-center text-sm rounded-md border transition-all hover:scale-105 cursor-pointer
                      ${dayIsToday ? 'ring-2 ring-carebase-blue' : ''}
                      ${!isCurrentMonth ? 'opacity-50' : ''}
                      ${getIntensityClass(recordCount)}
                      ${recordCount > 0 ? 'text-white font-medium' : 'text-gray-700'}
                    `}
                    title={`${format(day, 'MM月dd日', { locale: ja })}: ${recordCount}件の記録`}
                  >
                    <div className="text-xs">{format(day, 'd')}</div>
                    {recordCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-white text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                        {recordCount}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
