'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addDays, format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  MessageSquare,
  Plus,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ContactScheduleCalendarView } from './contact-schedule-calendar-view';

export function ContactScheduleBoard() {
  const [calendarView, setCalendarView] = useState<'week' | 'month'>('week');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Set current date on client side to avoid hydration mismatch
  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  return (
    <div className="p-4 md:p-6 bg-carebase-bg min-h-screen">
      {/* ヘッダー */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-carebase-blue" />
            <h1 className="text-2xl font-bold text-carebase-text-primary">連絡・予定</h1>
          </div>
          
          <div className="flex items-center gap-1 rounded-lg bg-gray-200 p-1 shadow-sm">
            <Button
              onClick={() => setCalendarView('week')}
              className={`px-4 py-2.5 font-medium text-base ${
                calendarView === 'week'
                  ? 'bg-carebase-blue hover:bg-carebase-blue-dark text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-300'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              週間表示
            </Button>
            <Button
              onClick={() => setCalendarView('month')}
              className={`px-4 py-2.5 font-medium text-base ${
                calendarView === 'month'
                  ? 'bg-carebase-blue hover:bg-carebase-blue-dark text-white shadow-sm'
                  : 'bg-transparent text-gray-700 hover:bg-gray-300'
              }`}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              月間表示
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2 text-carebase-blue" />
            フィルター
          </Button>
          
          <Button
            className="bg-carebase-blue hover:bg-carebase-blue-dark font-medium px-3 py-2 text-sm shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            新規作成
          </Button>

          {/* 日付ナビゲーション */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
              onClick={() => selectedDate && setSelectedDate(addDays(selectedDate, calendarView === 'week' ? -7 : -30))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              {calendarView === 'week' ? '前週' : '前月'}
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className="w-[160px] justify-start text-left font-medium text-carebase-text-primary text-base bg-white border-carebase-blue hover:bg-carebase-blue-light px-3 py-2 shadow-sm"
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-carebase-blue" />
                  {selectedDate
                    ? format(selectedDate, calendarView === 'week' ? 'M月d日 (E)' : 'yyyy年M月', { locale: ja })
                    : '読み込み中...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={(date) => {
                    if (date) {
                      setSelectedDate(date);
                    }
                  }}
                  initialFocus
                  locale={ja}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              className="bg-white border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light font-medium px-3 py-2 text-sm shadow-sm"
              onClick={() => selectedDate && setSelectedDate(addDays(selectedDate, calendarView === 'week' ? 7 : 30))}
            >
              {calendarView === 'week' ? '翌週' : '翌月'}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* フィルターパネル */}
      {showFilters && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">フィルター設定</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">種別</h3>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    連絡事項
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    予定
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    申し送り
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">ステータス</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    未読
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    確認済み
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs">
                    完了
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">重要度</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs border-red-500 text-red-600">
                    高
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs border-yellow-500 text-yellow-600">
                    中
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs border-blue-500 text-blue-600">
                    低
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* メインコンテンツ */}
      <ContactScheduleCalendarView selectedDate={selectedDate} viewMode={calendarView} />
    </div>
  );
}