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
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">総記録数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-carebase-blue" />
              <span className="text-2xl font-bold text-carebase-blue">
                {monthlyStats.total || 0}
              </span>
              <span className="text-sm text-gray-500">件</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">平均記録数/日</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {monthlyStats.total
                  ? Math.round((monthlyStats.total / calendarDays.length) * 10) / 10
                  : 0}
              </span>
              <span className="text-sm text-gray-500">件</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">記録日数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">
                {Object.keys(monthlyStats.dailyStats || {}).length}
              </span>
              <span className="text-sm text-gray-500">日</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-carebase-blue" />
            カテゴリ別記録数
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(monthlyStats.categoryStats || {}).length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">この月の記録はありません。</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(monthlyStats.categoryStats || {}).map(([category, count]) => (
                <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-carebase-blue">{count}</div>
                  <div className="text-sm text-gray-600">{getCategoryLabel(category)}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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

            <div className="flex items-center justify-center gap-4 text-xs text-gray-600">
              <span>記録数:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 rounded"></div>
                <span>0</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-200 rounded"></div>
                <span>1-2</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span>3-5</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span>6-10</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-800 rounded"></div>
                <span>10+</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
