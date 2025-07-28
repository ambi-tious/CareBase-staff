'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Resident } from '@/mocks/care-board-data';
import type { CareRecord } from '@/types/care-record';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDaysInMonth,
  startOfMonth,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, TrendingUp } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';

interface RecordDataMonthlyViewProps {
  resident: Resident;
  selectedDate: Date | null;
  careRecords: CareRecord[];
}

// ケア項目の定義
const careItems = [
  { key: 'drinking', label: '飲水', icon: '💧' },
  { key: 'urination', label: '排尿', icon: '🚽' },
  { key: 'defecation', label: '排便', icon: '💩' },
  { key: 'bathing', label: '入浴', icon: '🛁' },
  { key: 'temperature', label: '体温', icon: '🌡️' },
  { key: 'pulse', label: '脈拍', icon: '💓' },
  { key: 'bloodPressure', label: '血圧', icon: '🩸' },
  { key: 'respiration', label: '呼吸', icon: '🫁' },
  { key: 'spo2', label: 'SpO2', icon: '📊' },
] as const;

export const RecordDataMonthlyView: React.FC<RecordDataMonthlyViewProps> = ({
  resident,
  selectedDate,
  careRecords,
}) => {
  const monthlyData = useMemo(() => {
    if (!selectedDate) return { days: [], records: {} };

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
    const records: Record<string, Record<string, number>> = {};

    // 初期化
    careItems.forEach((item) => {
      records[item.key] = {};
      for (let day = 1; day <= daysInMonth; day++) {
        records[item.key][day] = 0;
      }
    });

    // 記録データを集計（モックデータなので仮の集計ロジック）
    monthlyRecords.forEach((record) => {
      const day = new Date(record.recordedAt).getDate();
      
      // カテゴリに基づいてケア項目を判定（実際の実装では記録の詳細データを使用）
      switch (record.category) {
        case 'meal':
          // 食事記録から飲水を推定
          records.drinking[day] += Math.floor(Math.random() * 3) + 1;
          break;
        case 'excretion':
          // 排泄記録から排尿・排便を推定
          records.urination[day] += Math.floor(Math.random() * 2) + 1;
          if (Math.random() > 0.7) {
            records.defecation[day] += 1;
          }
          break;
        case 'bathing':
          records.bathing[day] += 1;
          break;
        case 'vital':
          // バイタル記録から各項目を推定
          records.temperature[day] += 1;
          records.pulse[day] += 1;
          records.bloodPressure[day] += 1;
          if (Math.random() > 0.5) {
            records.respiration[day] += 1;
            records.spo2[day] += 1;
          }
          break;
      }
    });

    return { days, records, daysInMonth };
  }, [careRecords, selectedDate]);

  const getCellValue = (itemKey: string, day: number): number => {
    return monthlyData.records[itemKey]?.[day] || 0;
  };

  const getCellColor = (value: number): string => {
    if (value === 0) return 'bg-gray-50 text-gray-400';
    if (value <= 2) return 'bg-blue-50 text-blue-700';
    if (value <= 5) return 'bg-green-50 text-green-700';
    return 'bg-orange-50 text-orange-700';
  };

  const getMonthlyTotal = (itemKey: string): number => {
    return Object.values(monthlyData.records[itemKey] || {}).reduce((sum, count) => sum + count, 0);
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
      {/* 月間サマリー */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-carebase-blue" />
            {format(selectedDate, 'yyyy年MM月', { locale: ja })}の記録サマリー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
            {careItems.map((item) => {
              const total = getMonthlyTotal(item.key);
              return (
                <div key={item.key} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-sm font-medium text-gray-700 mb-1">{item.label}</div>
                  <div className="text-lg font-bold text-carebase-blue">{total}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 月次記録表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-carebase-blue" />
            {format(selectedDate, 'yyyy年MM月', { locale: ja })}の日別記録
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-white border border-gray-200 p-2 text-left font-medium text-gray-700 min-w-[100px]">
                    ケア項目
                  </th>
                  {Array.from({ length: monthlyData.daysInMonth }, (_, i) => i + 1).map((day) => (
                    <th
                      key={day}
                      className="border border-gray-200 p-2 text-center font-medium text-gray-700 min-w-[40px]"
                    >
                      {day}
                    </th>
                  ))}
                  <th className="border border-gray-200 p-2 text-center font-medium text-gray-700 min-w-[60px]">
                    合計
                  </th>
                </tr>
              </thead>
              <tbody>
                {careItems.map((item) => (
                  <tr key={item.key} className="hover:bg-gray-50">
                    <td className="sticky left-0 bg-white border border-gray-200 p-2 font-medium">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm">{item.label}</span>
                      </div>
                    </td>
                    {Array.from({ length: monthlyData.daysInMonth }, (_, i) => i + 1).map((day) => {
                      const value = getCellValue(item.key, day);
                      return (
                        <td
                          key={day}
                          className={`border border-gray-200 p-2 text-center text-sm font-medium ${getCellColor(value)}`}
                        >
                          {value > 0 ? value : '-'}
                        </td>
                      );
                    })}
                    <td className="border border-gray-200 p-2 text-center font-bold text-carebase-blue">
                      {getMonthlyTotal(item.key)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 凡例 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
              <span className="text-gray-600">記録なし</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
              <span className="text-gray-600">1-2回</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span className="text-gray-600">3-5回</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
              <span className="text-gray-600">6回以上</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};