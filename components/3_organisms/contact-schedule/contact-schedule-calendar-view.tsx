'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subWeeks,
} from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, MessageCircle, Plus } from 'lucide-react';

interface ContactScheduleCalendarViewProps {
  selectedDate: Date | null;
  viewMode: 'week' | 'month';
  onDateChange?: (date: Date) => void;
}

import { contactScheduleData } from '@/mocks/contact-schedule-data';

// 日付文字列からDateオブジェクトに変換するヘルパー関数
const parseEventDate = (dateString: string) => {
  return new Date(dateString);
};

// ContactScheduleItemを表示用データに変換
const convertToDisplayData = (items: typeof contactScheduleData) => {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    type: item.type === 'contact' ? '連絡事項' : item.type === 'schedule' ? '予定' : '申し送り',
    priority: item.priority,
    status: item.status,
    assignedTo: item.assignedTo,
    startTime: item.startTime || '',
    endTime: item.endTime || '',
    date: parseEventDate(item.dueDate).toISOString().split('T')[0],
    tags: item.tags,
    relatedResidentName: item.relatedResidentName,
  }));
};

// 表示用データを取得
const getDisplayData = () => {
  return convertToDisplayData(contactScheduleData);
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'high':
      return <Badge className="bg-red-100 text-red-700 border-red-200">高</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">中</Badge>;
    case 'low':
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">低</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">-</Badge>;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case '予定':
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">予定</Badge>;
    case '連絡事項':
      return <Badge className="bg-green-100 text-green-700 border-green-200">連絡事項</Badge>;
    case '申し送り':
      return <Badge className="bg-purple-100 text-purple-700 border-purple-200">申し送り</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">{type}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-red-100 text-red-700 border-red-200">未対応</Badge>;
    case 'confirmed':
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">確認済み</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-700 border-green-200">完了</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-700 border-gray-200">-</Badge>;
  }
};

export function ContactScheduleCalendarView({
  selectedDate,
  viewMode,
  onDateChange,
}: ContactScheduleCalendarViewProps) {
  if (!selectedDate) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // 表示期間を計算
  const getDisplayPeriod = () => {
    if (viewMode === 'week') {
      return {
        start: startOfWeek(selectedDate, { weekStartsOn: 1 }), // 月曜日開始
        end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
      };
    } else {
      return {
        start: startOfMonth(selectedDate),
        end: endOfMonth(selectedDate),
      };
    }
  };

  const { start, end } = getDisplayPeriod();
  const days = eachDayOfInterval({ start, end });

  // 期間内のイベントを取得
  const getEventsForDate = (date: Date) => {
    const displayData = getDisplayData();
    return displayData
      .filter((event) => isSameDay(new Date(event.date), date))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // 週間表示のレンダリング（Googleカレンダー風）
  const renderWeekView = () => {
    const weekDays = eachDayOfInterval({
      start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
      end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
    });

    const handlePrevWeek = () => {
      const prevWeek = subWeeks(selectedDate, 1);
      onDateChange?.(prevWeek);
    };

    const handleNextWeek = () => {
      const nextWeek = addWeeks(selectedDate, 1);
      onDateChange?.(nextWeek);
    };

    return (
      <div className="space-y-4">
        {/* 週間ナビゲーションヘッダー */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevWeek}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextWeek}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-carebase-blue" />
                  <h2 className="text-xl font-semibold text-carebase-text-primary">
                    {format(weekDays[0], 'yyyy年MM月dd日', { locale: ja })} 〜{' '}
                    {format(weekDays[6], 'MM月dd日', { locale: ja })}
                  </h2>
                </div>
              </div>
              <div className="text-sm text-gray-600">週間表示</div>
            </div>
          </CardContent>
        </Card>

        {/* Googleカレンダー風グリッドレイアウト */}
        <Card className="overflow-hidden">
          <div className="weekly-calendar-container">
            {/* 曜日ヘッダー */}
            <div className="weekly-header">
              {weekDays.map((day) => {
                const dayIsToday = isToday(day);
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                return (
                  <div
                    key={day.toISOString()}
                    className={`weekly-day-header ${dayIsToday ? 'today' : ''} ${isWeekend ? 'weekend' : ''}`}
                  >
                    <div className="day-label">
                      <div className="day-name">{format(day, 'E', { locale: ja })}</div>
                      <div className={`day-number ${dayIsToday ? 'today-number' : ''}`}>
                        {format(day, 'd')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* イベントグリッド */}
            <div className="weekly-events-grid">
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(day);
                const dayIsToday = isToday(day);
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                return (
                  <div
                    key={day.toISOString()}
                    className={`weekly-day-column ${dayIsToday ? 'today-column' : ''} ${isWeekend ? 'weekend-column' : ''}`}
                  >
                    {/* 今日のインジケーター */}
                    {dayIsToday && <div className="today-indicator" />}

                    {/* イベント一覧 */}
                    <div className="day-events">
                      {dayEvents.length > 0 ? (
                        dayEvents.map((event, index) => (
                          <div
                            key={event.id}
                            className={`event-item ${event.type} priority-${event.priority}`}
                            onClick={() => (window.location.href = `/contact-schedule/${event.id}`)}
                            style={{
                              animationDelay: `${index * 50}ms`,
                            }}
                          >
                            <div className="event-time">
                              {event.startTime}
                              {event.endTime && ` - ${event.endTime}`}
                            </div>
                            <div className="event-title">{event.title}</div>
                            <div className="event-badges">
                              {getTypeBadge(event.type)}
                              {event.priority === 'high' && getPriorityBadge(event.priority)}
                            </div>
                            {event.relatedResidentName && (
                              <div className="event-resident">
                                対象: {event.relatedResidentName}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="empty-day">
                          <div className="empty-day-content">
                            <MessageCircle className="h-6 w-6 text-gray-300" />
                            <span className="text-xs text-gray-400">予定なし</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 新規作成ボタン（ホバー時表示） */}
                    <div className="day-add-button">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="add-event-btn"
                        onClick={() =>
                          (window.location.href = `/contact-schedule/new?date=${format(day, 'yyyy-MM-dd')}`)
                        }
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

  // 月間表示のレンダリング
  const renderMonthView = () => (
    <div className="space-y-4">
      {/* 月間ヘッダー */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-carebase-blue" />
              <h2 className="text-xl font-semibold text-carebase-text-primary">
                {format(selectedDate, 'yyyy年MM月', { locale: ja })}
              </h2>
            </div>
            <div className="text-sm text-gray-600">月間表示</div>
          </div>
        </CardContent>
      </Card>

      {/* カレンダーグリッド */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-2">
            {/* 曜日ヘッダー */}
            {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
                {day}
              </div>
            ))}

            {/* 日付セル */}
            {days.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, selectedDate);

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[120px] p-2 border rounded-lg ${
                    isToday ? 'bg-blue-50 border-carebase-blue' : 'border-gray-200'
                  } ${!isCurrentMonth ? 'opacity-50' : ''}`}
                >
                  <div
                    className={`text-sm font-medium mb-1 ${isToday ? 'text-carebase-blue' : 'text-gray-700'}`}
                  >
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity ${
                          event.type === '予定'
                            ? 'bg-blue-100 text-blue-800'
                            : event.type === '連絡事項'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-100 text-purple-800'
                        }`}
                        title={event.title}
                        onClick={() => (window.location.href = `/contact-schedule/${event.id}`)}
                      >
                        <div className="font-medium">
                          {event.startTime} {event.title}
                        </div>
                        {event.relatedResidentName && (
                          <div className="text-xs opacity-75">
                            対象: {event.relatedResidentName}
                          </div>
                        )}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 3}件
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return viewMode === 'week' ? renderWeekView() : renderMonthView();
}
