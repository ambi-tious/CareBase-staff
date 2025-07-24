'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfWeek,
  subWeeks,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MessageCircle,
  Plus,
} from 'lucide-react';
import React from 'react';

interface ResponsiveWeekViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  events: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    priority: string;
    status: string;
    assignedTo: string;
    startTime: string;
    endTime?: string;
    date: string;
    relatedResidentName?: string;
  }>;
}

export const ContactScheduleResponsiveWeek: React.FC<ResponsiveWeekViewProps> = ({
  selectedDate,
  onDateChange,
  events,
}) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isTablet = useMediaQuery('(min-width: 768px)');
  const isMobile = !isTablet;

  // レスポンシブに応じた表示日数を決定
  const getDisplayDays = () => {
    if (isDesktop) return 7; // フル週表示
    if (isTablet) return 5; // 平日中心
    return 3; // モバイルは3日
  };

  const displayDays = getDisplayDays();

  // 表示する日付範囲を計算
  const getWeekDays = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });

    if (displayDays === 7) {
      return eachDayOfInterval({
        start: weekStart,
        end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
      });
    } else if (displayDays === 5) {
      // 平日のみ（月〜金）
      return eachDayOfInterval({
        start: weekStart,
        end: addDays(weekStart, 4),
      });
    } else {
      // モバイル: 選択日を中心とした3日
      return eachDayOfInterval({
        start: addDays(selectedDate, -1),
        end: addDays(selectedDate, 1),
      });
    }
  };

  const weekDays = getWeekDays();

  // 指定日のイベントを取得
  const getEventsForDate = (date: Date) => {
    return events
      .filter((event) => isSameDay(new Date(event.date), date))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // ナビゲーション関数
  const handlePrevPeriod = () => {
    if (displayDays === 7) {
      onDateChange(subWeeks(selectedDate, 1));
    } else if (displayDays === 5) {
      onDateChange(subWeeks(selectedDate, 1));
    } else {
      onDateChange(addDays(selectedDate, -1));
    }
  };

  const handleNextPeriod = () => {
    if (displayDays === 7) {
      onDateChange(addWeeks(selectedDate, 1));
    } else if (displayDays === 5) {
      onDateChange(addWeeks(selectedDate, 1));
    } else {
      onDateChange(addDays(selectedDate, 1));
    }
  };

  // バッジ生成関数
  const getTypeBadge = (type: string) => {
    const typeConfig = {
      予定: 'bg-blue-100 text-blue-700 border-blue-200',
      連絡事項: 'bg-green-100 text-green-700 border-green-200',
      申し送り: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    return (
      <Badge
        className={`text-xs ${typeConfig[type as keyof typeof typeConfig] || 'bg-gray-100 text-gray-700'}`}
      >
        {type}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    if (priority !== 'high') return null;

    return <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">高</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* レスポンシブナビゲーションヘッダー */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPeriod}
                  className="h-8 w-8 p-0"
                  aria-label={displayDays === 3 ? '前日' : '前週'}
                >
                  {displayDays === 3 ? (
                    <ArrowLeft className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPeriod}
                  className="h-8 w-8 p-0"
                  aria-label={displayDays === 3 ? '翌日' : '翌週'}
                >
                  {displayDays === 3 ? (
                    <ArrowRight className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-carebase-blue" />
                <h2 className="text-lg md:text-xl font-semibold text-carebase-text-primary">
                  {displayDays === 3
                    ? format(selectedDate, 'yyyy年MM月dd日 (E)', { locale: ja })
                    : `${format(weekDays[0], 'yyyy年MM月dd日', { locale: ja })} 〜 ${format(weekDays[weekDays.length - 1], 'MM月dd日', { locale: ja })}`}
                </h2>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {displayDays === 7 ? '週間表示' : displayDays === 5 ? '平日表示' : '3日表示'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* レスポンシブ週間グリッド */}
      <Card className="overflow-hidden">
        <div className="responsive-weekly-calendar">
          {/* 曜日ヘッダー */}
          <div
            className="responsive-weekly-header"
            style={{ gridTemplateColumns: `repeat(${displayDays}, 1fr)` }}
          >
            {weekDays.map((day) => {
              const dayIsToday = isToday(day);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <div
                  key={day.toISOString()}
                  className={`responsive-day-header ${dayIsToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}`}
                >
                  <div className="day-label">
                    <div className="day-name">
                      {isMobile
                        ? format(day, 'E', { locale: ja })
                        : format(day, 'E', { locale: ja })}
                    </div>
                    <div className={`day-number ${dayIsToday ? 'today-number' : ''}`}>
                      {format(day, 'd')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* イベントグリッド */}
          <div
            className="responsive-events-grid"
            style={{ gridTemplateColumns: `repeat(${displayDays}, 1fr)` }}
          >
            {weekDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              const dayIsToday = isToday(day);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <div
                  key={day.toISOString()}
                  className={`responsive-day-column ${dayIsToday ? 'today-column' : ''} ${isWeekend ? 'weekend-column' : ''}`}
                >
                  {/* 今日のインジケーター */}
                  {dayIsToday && <div className="today-indicator" />}

                  {/* イベント一覧 */}
                  <div className="day-events">
                    {dayEvents.length > 0 ? (
                      dayEvents.map((event, index) => (
                        <div
                          key={event.id}
                          className={`responsive-event-item ${event.type} priority-${event.priority}`}
                          onClick={() => (window.location.href = `/contact-schedule/${event.id}`)}
                          style={{
                            animationDelay: `${index * 50}ms`,
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`${event.title} - ${event.startTime}`}
                        >
                          <div className="event-time">
                            <Clock className="h-3 w-3" />
                            <span>
                              {event.startTime}
                              {event.endTime && !isMobile && ` - ${event.endTime}`}
                            </span>
                          </div>
                          <div className="event-title">{event.title}</div>
                          {!isMobile && (
                            <div className="event-badges">
                              {getTypeBadge(event.type)}
                              {getPriorityBadge(event.priority)}
                            </div>
                          )}
                          {event.relatedResidentName && !isMobile && (
                            <div className="event-resident">対象: {event.relatedResidentName}</div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="empty-day">
                        <div className="empty-day-content">
                          <MessageCircle
                            className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} text-gray-300`}
                          />
                          <span className="text-xs text-gray-400">予定なし</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 新規作成ボタン */}
                  <div className="day-add-button">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="add-event-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/contact-schedule/new?date=${format(day, 'yyyy-MM-dd')}`;
                      }}
                      aria-label={`${format(day, 'MM月dd日', { locale: ja })}の予定を追加`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
