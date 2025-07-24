'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getLucideIcon } from '@/lib/lucide-icon-registry';
import type { CareCategoryKey, CareEvent, Resident } from '@/mocks/care-board-data';
import { careBoardData } from '@/mocks/care-board-data';
import { CARE_CATEGORY_COLORS, getEventStatus, rgbToRgba, rgbToString } from '@/utils/care-board-helpers';
import { 
  addDays, 
  format, 
  isSameDay, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isToday,
  isWeekend
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, Plus, User } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface WeekViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick?: (event: CareEvent, resident: Resident) => void;
  onTimeSlotClick?: (time: string, date: Date) => void;
}

interface TimeSlotEvent {
  event: CareEvent;
  resident: Resident;
  startMinutes: number;
  durationMinutes: number;
  column: number;
  width: number;
  left: number;
}

export const CareboardWeekView: React.FC<WeekViewProps> = ({
  selectedDate,
  onDateChange,
  onEventClick,
  onTimeSlotClick,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentTimeLineRef = useRef<HTMLDivElement>(null);

  // クライアントサイドでの初期化
  useEffect(() => {
    setIsClient(true);
    const updateCurrentTime = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().slice(0, 5));
    };
    updateCurrentTime();
    
    // 1分ごとに現在時刻を更新
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 現在時刻への自動スクロール
  useEffect(() => {
    if (isClient && currentTimeLineRef.current && scrollContainerRef.current) {
      const timeLineElement = currentTimeLineRef.current;
      const container = scrollContainerRef.current;
      
      // 現在時刻の位置を計算（上部に余裕を持たせる）
      const scrollTop = timeLineElement.offsetTop - container.clientHeight / 3;
      
      container.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth'
      });
    }
  }, [isClient, currentTime]);

  // 週の開始日と終了日を計算（月曜日開始）
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // 時間スロットを生成（30分間隔）
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          time: timeString,
          hour,
          minute,
          isHourStart: minute === 0,
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // 指定日のイベントを取得
  const getEventsForDay = (date: Date): TimeSlotEvent[] => {
    const dayEvents: TimeSlotEvent[] = [];
    
    careBoardData.forEach((resident) => {
      resident.events.forEach((event) => {
        // イベントの日付が指定日と一致するかチェック
        const eventDate = new Date();
        eventDate.setHours(parseInt(event.scheduledTime.split(':')[0]));
        eventDate.setMinutes(parseInt(event.scheduledTime.split(':')[1]));
        
        if (isSameDay(eventDate, date)) {
          const [hours, minutes] = event.scheduledTime.split(':').map(Number);
          const startMinutes = hours * 60 + minutes;
          
          dayEvents.push({
            event,
            resident,
            startMinutes,
            durationMinutes: 30, // デフォルト30分
            column: 0,
            width: 1,
            left: 0,
          });
        }
      });
    });

    // 重複するイベントの配置を計算
    return calculateEventLayout(dayEvents);
  };

  // イベントの重複を考慮したレイアウト計算
  const calculateEventLayout = (events: TimeSlotEvent[]): TimeSlotEvent[] => {
    // 時間順にソート
    const sortedEvents = [...events].sort((a, b) => a.startMinutes - b.startMinutes);
    
    // 重複グループを作成
    const groups: TimeSlotEvent[][] = [];
    
    sortedEvents.forEach((event) => {
      let placed = false;
      
      for (const group of groups) {
        const hasOverlap = group.some((groupEvent) => {
          const eventEnd = event.startMinutes + event.durationMinutes;
          const groupEventEnd = groupEvent.startMinutes + groupEvent.durationMinutes;
          
          return !(eventEnd <= groupEvent.startMinutes || event.startMinutes >= groupEventEnd);
        });
        
        if (!hasOverlap) {
          group.push(event);
          placed = true;
          break;
        }
      }
      
      if (!placed) {
        groups.push([event]);
      }
    });

    // 各グループ内でのレイアウトを計算
    groups.forEach((group) => {
      const columns = group.length;
      group.forEach((event, index) => {
        event.column = index;
        event.width = 1 / columns;
        event.left = index / columns;
      });
    });

    return sortedEvents;
  };

  // 週ナビゲーション
  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = addDays(selectedDate, direction === 'prev' ? -7 : 7);
    onDateChange(newDate);
  };

  // 時間スロットクリックハンドラー
  const handleTimeSlotClick = useCallback((time: string, date: Date) => {
    onTimeSlotClick?.(time, date);
  }, [onTimeSlotClick]);

  // イベントクリックハンドラー
  const handleEventClick = useCallback((event: CareEvent, resident: Resident) => {
    onEventClick?.(event, resident);
  }, [onEventClick]);

  // 現在時刻ラインの位置を計算
  const getCurrentTimePosition = () => {
    if (!isClient) return 0;
    
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    
    // 30分間隔のグリッドでの位置を計算
    const slotHeight = 60; // 各30分スロットの高さ（px）
    return (totalMinutes / 30) * slotHeight;
  };

  const currentTimePosition = getCurrentTimePosition();

  // イベントコンポーネント
  const EventBlock: React.FC<{
    timeSlotEvent: TimeSlotEvent;
    dayIndex: number;
  }> = ({ timeSlotEvent, dayIndex }) => {
    const { event, resident } = timeSlotEvent;
    const status = getEventStatus(event);
    const baseColorArr = event.categoryKey ? CARE_CATEGORY_COLORS[event.categoryKey] : [128, 128, 128];
    const baseColor = rgbToString(baseColorArr);
    
    const Icon = getLucideIcon(event.icon);
    
    const eventStyles = {
      backgroundColor: status === 'completed' 
        ? rgbToRgba(baseColorArr, 0.25) 
        : rgbToRgba(baseColorArr, 0.1),
      borderColor: baseColor,
      borderStyle: status === 'completed' ? 'solid' : 'dashed',
      borderWidth: '2px',
      left: `${timeSlotEvent.left * 100}%`,
      width: `${timeSlotEvent.width * 100}%`,
    };

    return (
      <div
        className="absolute p-2 rounded-md cursor-pointer hover:shadow-md transition-all duration-200 z-10"
        style={{
          ...eventStyles,
          top: `${(timeSlotEvent.startMinutes / 30) * 60}px`,
          height: `${(timeSlotEvent.durationMinutes / 30) * 60 - 2}px`,
          minHeight: '56px',
        }}
        onClick={() => handleEventClick(event, resident)}
      >
        <div className="flex items-center gap-1 mb-1">
          <Icon className="h-3 w-3 flex-shrink-0" style={{ color: baseColor }} />
          <span className="text-xs font-medium truncate">{event.label}</span>
        </div>
        <div className="text-xs text-gray-600 truncate">{resident.name}</div>
        <div className="text-xs opacity-75">{event.scheduledTime}</div>
        {status === 'completed' && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        )}
      </div>
    );
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* 週ナビゲーションヘッダー */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('prev')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            前週
          </Button>
          
          <h2 className="text-lg font-semibold text-carebase-text-primary">
            {format(weekStart, 'yyyy年MM月dd日', { locale: ja })} 〜 {format(weekEnd, 'MM月dd日', { locale: ja })}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateWeek('next')}
            className="flex items-center gap-1"
          >
            翌週
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onDateChange(new Date())}
          className="bg-carebase-blue text-white hover:bg-carebase-blue-dark"
        >
          今日
        </Button>
      </div>

      {/* カレンダーグリッド */}
      <div className="relative">
        {/* 日付ヘッダー */}
        <div className="grid grid-cols-8 border-b bg-gray-50 sticky top-0 z-20">
          {/* 時間列ヘッダー */}
          <div className="p-3 border-r border-gray-200 bg-gray-100">
            <Clock className="h-4 w-4 text-gray-500 mx-auto" />
          </div>
          
          {/* 日付ヘッダー */}
          {weekDays.map((day, index) => {
            const isCurrentDay = isToday(day);
            const isWeekendDay = isWeekend(day);
            
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'p-3 border-r border-gray-200 text-center',
                  isCurrentDay && 'bg-carebase-blue text-white',
                  isWeekendDay && !isCurrentDay && 'bg-blue-50',
                  !isWeekendDay && !isCurrentDay && 'bg-gray-50'
                )}
              >
                <div className="text-sm font-medium">
                  {format(day, 'E', { locale: ja })}
                </div>
                <div className={cn(
                  'text-lg font-bold mt-1',
                  isCurrentDay ? 'text-white' : 'text-carebase-text-primary'
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div 
          ref={scrollContainerRef}
          className="overflow-y-auto max-h-[calc(100vh-300px)] relative"
        >
          {/* 時間グリッド */}
          <div className="grid grid-cols-8 relative">
            {/* 時間軸列 */}
            <div className="border-r border-gray-200 bg-gray-50">
              {timeSlots.map((slot) => (
                <div
                  key={slot.time}
                  className={cn(
                    'h-[60px] border-b border-gray-100 flex items-start justify-center pt-1',
                    slot.isHourStart && 'border-b-gray-300'
                  )}
                >
                  {slot.isHourStart && (
                    <span className="text-xs text-gray-600 font-medium">
                      {slot.time}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* 日付列 */}
            {weekDays.map((day, dayIndex) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentDay = isToday(day);
              const isWeekendDay = isWeekend(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    'border-r border-gray-200 relative',
                    isCurrentDay && 'bg-blue-50/30',
                    isWeekendDay && !isCurrentDay && 'bg-gray-50/50'
                  )}
                >
                  {/* 時間スロット */}
                  {timeSlots.map((slot) => (
                    <div
                      key={`${day.toISOString()}-${slot.time}`}
                      className={cn(
                        'h-[60px] border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors relative',
                        slot.isHourStart && 'border-b-gray-300'
                      )}
                      onClick={() => handleTimeSlotClick(slot.time, day)}
                    >
                      {/* 30分区切り線 */}
                      {!slot.isHourStart && (
                        <div className="absolute top-0 left-0 right-0 h-px bg-gray-100" />
                      )}
                    </div>
                  ))}

                  {/* イベント表示 */}
                  {dayEvents.map((timeSlotEvent, eventIndex) => (
                    <EventBlock
                      key={`${timeSlotEvent.event.scheduledTime}-${timeSlotEvent.resident.id}-${eventIndex}`}
                      timeSlotEvent={timeSlotEvent}
                      dayIndex={dayIndex}
                    />
                  ))}

                  {/* 新規イベント追加ボタン（ホバー時表示） */}
                  <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 bg-white shadow-sm border"
                      onClick={() => handleTimeSlotClick('09:00', day)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 現在時刻ライン */}
          {isClient && isToday(selectedDate) && (
            <div
              ref={currentTimeLineRef}
              className="absolute left-0 right-0 z-30 pointer-events-none"
              style={{ top: `${currentTimePosition}px` }}
            >
              <div className="flex items-center">
                <div className="w-16 bg-red-500 text-white text-xs px-2 py-1 rounded-l-md font-medium">
                  {currentTime}
                </div>
                <div className="flex-1 h-0.5 bg-red-500" />
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 週間統計情報 */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>今週の予定: {weekDays.reduce((total, day) => total + getEventsForDay(day).length, 0)}件</span>
            <span>完了: {weekDays.reduce((total, day) => 
              total + getEventsForDay(day).filter(e => getEventStatus(e.event) === 'completed').length, 0
            )}件</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-dashed border-gray-400 rounded-sm" />
              <span>予定</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border-2 border-solid border-green-500 bg-green-100 rounded-sm" />
              <span>完了</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};