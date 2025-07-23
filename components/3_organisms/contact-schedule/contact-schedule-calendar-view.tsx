'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Clock, MessageCircle, User, Plus } from 'lucide-react';
import React from 'react';

interface ContactScheduleCalendarViewProps {
  selectedDate: Date | null;
  viewMode: 'week' | 'month';
}

// モックデータ（日付別）
const mockCalendarData = [
  {
    id: '1',
    title: '月次ミーティング',
    content: '来月の業務計画について話し合います',
    type: '予定',
    priority: 'high',
    status: 'pending',
    assignedTo: '田中 花子',
    startTime: '14:00',
    endTime: '15:30',
    date: '2025-01-25',
  },
  {
    id: '2',
    title: '設備点検のお知らせ',
    content: 'エアコンの定期点検を実施します',
    type: '連絡事項',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: '佐藤 太郎',
    startTime: '10:00',
    endTime: '12:00',
    date: '2025-01-25',
  },
  {
    id: '3',
    title: '利用者様の体調変化',
    content: '山田様の血圧が高めです',
    type: '申し送り',
    priority: 'high',
    status: 'pending',
    assignedTo: '鈴木 一郎',
    startTime: '08:00',
    endTime: '08:30',
    date: '2025-01-25',
  },
  {
    id: '4',
    title: '研修会',
    content: '介護技術研修会を開催します',
    type: '予定',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: '高橋 恵子',
    startTime: '13:00',
    endTime: '17:00',
    date: '2025-01-27',
  },
  {
    id: '5',
    title: '新年会準備',
    content: '利用者様との新年会の準備',
    type: '予定',
    priority: 'low',
    status: 'pending',
    assignedTo: '伊藤 健太',
    startTime: '15:00',
    endTime: '17:00',
    date: '2025-01-28',
  },
];

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

export function ContactScheduleCalendarView({ selectedDate, viewMode }: ContactScheduleCalendarViewProps) {
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
    return mockCalendarData.filter((event) =>
      isSameDay(new Date(event.date), date)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // 週間表示のレンダリング
  const renderWeekView = () => (
    <div className="space-y-4">
      {/* 週間ヘッダー */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-carebase-blue" />
              <h2 className="text-xl font-semibold text-carebase-text-primary">
                {format(start, 'yyyy年MM月dd日', { locale: ja })} 〜 {format(end, 'MM月dd日 (E)', { locale: ja })}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              週間表示
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 日別表示 */}
      <div className="space-y-4">
        {days.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <Card key={day.toISOString()} className={`${isSelected ? 'ring-2 ring-carebase-blue' : ''} ${isToday ? 'bg-blue-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* 日付表示 */}
                  <div className="flex-shrink-0 text-center">
                    <div className={`px-3 py-2 rounded-lg ${isToday ? 'bg-carebase-blue text-white' : 'bg-gray-100'}`}>
                      <div className="text-sm font-semibold">{format(day, 'MM/dd', { locale: ja })}</div>
                      <div className="text-xs">{format(day, '(E)', { locale: ja })}</div>
                    </div>
                  </div>

                  {/* イベント一覧 */}
                  <div className="flex-1">
                    {dayEvents.length > 0 ? (
                      <div className="space-y-2">
                        {dayEvents.map((event) => (
                          <div key={event.id} className="p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-carebase-text-primary">{event.title}</h4>
                              <div className="flex gap-1">
                                {getTypeBadge(event.type)}
                                {getPriorityBadge(event.priority)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{event.content}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>{event.startTime} - {event.endTime}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <User className="h-3 w-3" />
                                <span>{event.assignedTo}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                        <p className="text-sm">予定がありません</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

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
            <div className="text-sm text-gray-600">
              月間表示
            </div>
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
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-carebase-blue' : 'text-gray-700'}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded truncate ${
                          event.type === '予定' ? 'bg-blue-100 text-blue-700' :
                          event.type === '連絡事項' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}
                        title={event.title}
                      >
                        {event.startTime} {event.title}
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

  return (
    viewMode === 'week' ? renderWeekView() : renderMonthView()
  );
}