'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { Resident } from '@/mocks/care-board-data';
import type { CareRecord } from '@/types/care-record';
import { eachDayOfInterval, endOfMonth, getDay, getDaysInMonth, startOfMonth } from 'date-fns';
import type React from 'react';
import { useMemo } from 'react';

interface RecordDataMonthlyViewProps {
  resident: Resident;
  selectedDate: Date | null;
  careRecords: CareRecord[];
}

const careItems = [
  { key: 'drinking', label: '飲水', icon: 'GlassWater' },
  { key: 'urination', label: '排尿', icon: 'ExcretionIcon' },
  { key: 'defecation', label: '排便', icon: 'ExcretionIcon' },
  { key: 'bathing', label: '入浴', icon: 'Bath' },
  { key: 'temperature', label: '体温', icon: 'Thermometer' },
  { key: 'pulse', label: '脈拍', icon: 'HeartPulse' },
  { key: 'bloodPressure', label: '血圧', icon: 'Droplets' },
  { key: 'respiration', label: '呼吸', icon: 'Wind' },
  { key: 'spo2', label: 'SpO2', icon: 'Activity' },
] as const;

export const RecordDataMonthlyView: React.FC<RecordDataMonthlyViewProps> = ({
  resident,
  selectedDate,
  careRecords,
}) => {
  const monthlyData = useMemo(() => {
    if (!selectedDate) return { days: [], records: {}, daysInMonth: 0 };

    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const daysInMonth = getDaysInMonth(selectedDate);

    // 月の全日付を生成
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // 月内の記録をフィルタリング
    const monthlyRecords = careRecords.filter((record) => {
      const recordDate = new Date(record.recordedAt);
      return recordDate >= monthStart && recordDate <= monthEnd;
    });

    // 日付とケア項目別にデータを集計
    const records: Record<string, Record<string, number | string>> = {};

    // 初期化
    careItems.forEach((item) => {
      records[item.key] = {};
      for (let day = 1; day <= daysInMonth; day++) {
        records[item.key][day] = 0;
      }
    });

    // 7月27日の初期データを設定
    const july27Data = {
      drinking: 400,
      urination: 3,
      defecation: 1,
      bathing: '入浴\n問題なし',
      temperature: 36.5,
      pulse: 75,
      bloodPressure: '125\n80',
      respiration: 15,
      spo2: 98,
    };

    // 7月27日のデータを設定（7月の場合）
    if (selectedDate.getMonth() === 6) {
      // 7月は0ベースで6
      Object.entries(july27Data).forEach(([key, value]) => {
        if (records[key]) {
          records[key][27] = value;
        }
      });
    }

    // 記録データを集計（モックデータなので仮の集計ロジック）
    monthlyRecords.forEach((record) => {
      const day = new Date(record.recordedAt).getDate();

      // 7月27日は初期データが設定済みなのでスキップ
      if (selectedDate.getMonth() === 6 && day === 27) {
        return;
      }

      // カテゴリに基づいてケア項目を判定（実際の実装では記録の詳細データを使用）
      switch (record.category) {
        case 'meal':
          // 食事記録から飲水を推定
          records.drinking[day] =
            (records.drinking[day] as number) + Math.floor(Math.random() * 3) + 1;
          break;
        case 'excretion':
          // 排泄記録から排尿・排便を推定
          records.urination[day] =
            (records.urination[day] as number) + Math.floor(Math.random() * 2) + 1;
          if (Math.random() > 0.7) {
            records.defecation[day] = (records.defecation[day] as number) + 1;
          }
          break;
        case 'bathing':
          records.bathing[day] = '入浴\n問題なし';
          break;
        case 'vital':
          // バイタル記録から各項目を推定
          records.temperature[day] = (records.temperature[day] as number) + 1;
          records.pulse[day] = (records.pulse[day] as number) + 1;
          records.bloodPressure[day] = '125\n80';
          if (Math.random() > 0.5) {
            records.respiration[day] = (records.respiration[day] as number) + 1;
            records.spo2[day] = (records.spo2[day] as number) + 1;
          }
          break;
      }
    });

    return { days, records, daysInMonth };
  }, [careRecords, selectedDate]);

  const getCellValue = (itemKey: string, day: number): number | string => {
    return monthlyData.records[itemKey]?.[day] || 0;
  };

  const getCellColor = (value: number | string): string => {
    return 'bg-white';
  };

  const getDayOfWeek = (day: number): number => {
    if (!selectedDate) return 0;
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    return getDay(date);
  };

  const getDayTextColor = (day: number): string => {
    const dayOfWeek = getDayOfWeek(day);
    if (dayOfWeek === 0) return 'text-red-600'; // 日曜日
    if (dayOfWeek === 6) return 'text-blue-600'; // 土曜日
    return 'text-gray-700';
  };

  const isToday = (day: number): boolean => {
    if (!selectedDate) return false;
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === selectedDate.getMonth() &&
      today.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getTodayHighlightClass = (day: number): string => {
    return isToday(day) ? 'bg-yellow-200' : 'bg-gray-50';
  };

  const getIconColor = (itemKey: string): string => {
    if (itemKey === 'drinking' || itemKey === 'bathing') {
      return 'text-blue-600';
    }
    if (itemKey === 'urination' || itemKey === 'defecation') {
      return 'text-amber-600';
    }
    if (
      itemKey === 'temperature' ||
      itemKey === 'pulse' ||
      itemKey === 'bloodPressure' ||
      itemKey === 'respiration' ||
      itemKey === 'spo2'
    ) {
      return 'text-red-600';
    }
    return 'text-gray-600';
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
          <CardTitle className="flex items-center gap-2"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-gray-50 border border-gray-200 p-2 text-left font-medium text-gray-700 min-w-[100px]"></th>
                  {Array.from({ length: monthlyData.daysInMonth }, (_, i) => i + 1).map((day) => (
                    <th
                      key={day}
                      className={`border border-gray-200 p-2 text-center font-medium min-w-[70px] ${getDayTextColor(day)} ${getTodayHighlightClass(day)}`}
                    >
                      {day}日
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {careItems.map((item) => (
                  <tr key={item.key} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white border border-gray-200 p-2 font-medium">
                      <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                        <div className="flex flex-col items-center gap-2">
                          {(() => {
                            const Icon = getLucideIcon(item.icon);
                            return <Icon className={`text-lg ${getIconColor(item.key)}`} />;
                          })()}
                          <span className="text-xs font-medium text-gray-700 text-center">
                            {item.label}
                          </span>
                        </div>
                      </div>
                    </td>
                    {Array.from({ length: monthlyData.daysInMonth }, (_, i) => i + 1).map((day) => {
                      const value = getCellValue(item.key, day);
                      return (
                        <td
                          key={day}
                          className={`border border-gray-200 p-2 text-center text-sm font-medium ${getCellColor(value)} ${getTodayHighlightClass(day)}`}
                        >
                          {typeof value === 'string' ? (
                            <div className="whitespace-pre-line text-xs">{value}</div>
                          ) : value > 0 ? (
                            value
                          ) : (
                            '-'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
