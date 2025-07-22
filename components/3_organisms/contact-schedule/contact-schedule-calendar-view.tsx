'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format, isSameDay } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Clock, MessageCircle, User, Plus } from 'lucide-react';
import React from 'react';

interface ContactScheduleCalendarViewProps {
  selectedDate: Date | null;
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

export function ContactScheduleCalendarView({ selectedDate }: ContactScheduleCalendarViewProps) {
  if (!selectedDate) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  // 選択された日付のデータをフィルタリング
  const dayEvents = mockCalendarData.filter((event) =>
    isSameDay(new Date(event.date), selectedDate)
  );

  // 時間順にソート
  const sortedEvents = dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-4">
      {/* 日付ヘッダー */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-carebase-blue" />
              <h2 className="text-xl font-semibold text-carebase-text-primary">
                {format(selectedDate, 'yyyy年MM月dd日 (E)', { locale: ja })}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {sortedEvents.length}件の予定・連絡事項
            </div>
          </div>
        </CardContent>
      </Card>

      {/* イベント一覧 */}
      {sortedEvents.length > 0 ? (
        <div className="space-y-3">
          {sortedEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* 時間表示 */}
                  <div className="flex-shrink-0 text-center">
                    <div className="bg-carebase-blue text-white px-3 py-2 rounded-lg">
                      <div className="text-sm font-semibold">{event.startTime}</div>
                      <div className="text-xs">〜{event.endTime}</div>
                    </div>
                  </div>

                  {/* メインコンテンツ */}
                  <div className="flex-1 space-y-3">
                    {/* ヘッダー */}
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-carebase-text-primary text-lg">
                        {event.title}
                      </h3>
                      <div className="flex gap-2">
                        {getTypeBadge(event.type)}
                        {getPriorityBadge(event.priority)}
                        {getStatusBadge(event.status)}
                      </div>
                    </div>

                    {/* 内容 */}
                    <p className="text-gray-600">{event.content}</p>

                    {/* 担当者 */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-4 w-4" />
                      <span>担当: {event.assignedTo}</span>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        詳細
                      </Button>
                      {event.status === 'pending' && (
                        <Button size="sm" className="bg-carebase-blue hover:bg-carebase-blue-dark">
                          確認
                        </Button>
                      )}
                      {event.status === 'confirmed' && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          完了
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* 空状態 */
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="p-12 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">予定・連絡事項がありません</h3>
            <p className="text-gray-500 mb-4">
              {format(selectedDate, 'MM月dd日', { locale: ja })}には予定や連絡事項がありません。
            </p>
            <Button className="bg-carebase-blue hover:bg-carebase-blue-dark">
              <Plus className="h-4 w-4 mr-2" />
              新規作成
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}