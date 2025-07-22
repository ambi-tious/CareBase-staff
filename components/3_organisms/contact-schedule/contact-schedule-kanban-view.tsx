'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Clock, MessageCircle, User } from 'lucide-react';
import React from 'react';

// モックデータ
const mockContactScheduleData = [
  {
    id: '1',
    title: '月次ミーティング',
    content: '来月の業務計画について話し合います',
    type: '予定',
    priority: 'high',
    status: 'pending',
    assignedTo: '田中 花子',
    dueDate: '2025-01-25T14:00:00',
    createdAt: '2025-01-20T09:00:00',
  },
  {
    id: '2',
    title: '設備点検のお知らせ',
    content: 'エアコンの定期点検を実施します',
    type: '連絡事項',
    priority: 'medium',
    status: 'confirmed',
    assignedTo: '佐藤 太郎',
    dueDate: '2025-01-23T10:00:00',
    createdAt: '2025-01-19T15:30:00',
  },
  {
    id: '3',
    title: '利用者様の体調変化',
    content: '山田様の血圧が高めです。注意深く観察をお願いします',
    type: '申し送り',
    priority: 'high',
    status: 'pending',
    assignedTo: '鈴木 一郎',
    dueDate: '2025-01-22T08:00:00',
    createdAt: '2025-01-21T16:45:00',
  },
  {
    id: '4',
    title: '研修会の案内',
    content: '来月の介護技術研修会についてご案内します',
    type: '連絡事項',
    priority: 'low',
    status: 'completed',
    assignedTo: '高橋 恵子',
    dueDate: '2025-01-30T13:00:00',
    createdAt: '2025-01-18T11:20:00',
  },
];

const statusColumns = [
  { key: 'pending', label: '未対応', color: 'bg-red-100 border-red-200' },
  { key: 'confirmed', label: '確認済み', color: 'bg-yellow-100 border-yellow-200' },
  { key: 'completed', label: '完了', color: 'bg-green-100 border-green-200' },
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

export function ContactScheduleKanbanView() {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd HH:mm', { locale: ja });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statusColumns.map((column) => (
        <div key={column.key} className="space-y-4">
          <Card className={`${column.color}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-center">
                {column.label}
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="space-y-3">
            {mockContactScheduleData
              .filter((item) => item.status === column.key)
              .map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* ヘッダー */}
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-carebase-text-primary line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex gap-1">
                          {getPriorityBadge(item.priority)}
                        </div>
                      </div>

                      {/* 種別 */}
                      <div className="flex items-center gap-2">
                        {getTypeBadge(item.type)}
                      </div>

                      {/* 内容 */}
                      <p className="text-sm text-gray-600 line-clamp-3">{item.content}</p>

                      {/* 担当者 */}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User className="h-4 w-4" />
                        <span>{item.assignedTo}</span>
                      </div>

                      {/* 日時 */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDateTime(item.dueDate)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDateTime(item.createdAt)}</span>
                        </div>
                      </div>

                      {/* アクションボタン */}
                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="outline" className="flex-1">
                          詳細
                        </Button>
                        {item.status === 'pending' && (
                          <Button size="sm" className="flex-1 bg-carebase-blue hover:bg-carebase-blue-dark">
                            確認
                          </Button>
                        )}
                        {item.status === 'confirmed' && (
                          <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                            完了
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

            {/* 空状態 */}
            {mockContactScheduleData.filter((item) => item.status === column.key).length === 0 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">項目がありません</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}