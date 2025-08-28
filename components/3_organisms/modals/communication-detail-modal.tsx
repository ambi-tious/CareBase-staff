'use client';

import { ImportanceBadge } from '@/components/1_atoms/communication/importance-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { CommunicationRecord } from '@/types/communication';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Edit3, MessageCircle, MessageSquare, Reply, User, Users } from 'lucide-react';
import type React from 'react';

interface CommunicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: CommunicationRecord | null;
  threadRecords: CommunicationRecord[];
  residentId: number;
  residentName?: string;
  onEdit?: (record: CommunicationRecord) => void;
  onReply?: (record: CommunicationRecord) => void;
  onCreateHandover?: (record: CommunicationRecord) => void;
  onRecordUpdate?: (updatedRecord: CommunicationRecord) => void;
  onRecordDelete?: (recordId: string) => void;
}

export const CommunicationDetailModal: React.FC<CommunicationDetailModalProps> = ({
  isOpen,
  onClose,
  record,
  threadRecords,
  residentId,
  residentName,
  onEdit,
  onReply,
  onCreateHandover,
  onRecordUpdate,
  onRecordDelete,
}) => {
  if (!record) return null;

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  const getContactPersonTypeLabel = (type: string) => {
    return type === 'family' ? 'ご家族' : '外部';
  };

  // Sort thread records by datetime (oldest first for thread view)
  const sortedThreadRecords = [...threadRecords].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  const hasThread = threadRecords.length > 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            コミュニケーション記録詳細
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {residentName && `${residentName}様の`}コミュニケーション記録の詳細です。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* アクションボタン */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReply?.(record)}
              className="border-green-300 text-green-600 hover:bg-green-50"
            >
              <Reply className="h-4 w-4 mr-2" />
              返信
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCreateHandover?.(record)}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              申し送り作成
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(record)}
              className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              編集
            </Button>
          </div>

          {/* メイン記録 */}
          <Card className="border-2 border-carebase-blue">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImportanceBadge isImportant={record.isImportant} />
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {getContactPersonTypeLabel(record.contactPersonType)}
                  </Badge>
                  {hasThread && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      スレッド ({threadRecords.length}件)
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDateTime(record.datetime)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 関係者情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">対応者: </span>
                    <span className="text-sm text-gray-900">{record.staffName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm font-medium text-gray-700">連絡者: </span>
                    <span className="text-sm text-gray-900">{record.contactPersonName}</span>
                  </div>
                </div>
              </div>

              {/* コミュニケーション内容 */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    コミュニケーション内容
                  </h4>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {record.communicationContent}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    対応内容・備考
                  </h4>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                      {record.responseContent}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* スレッド表示（複数の記録がある場合） */}
          {hasThread && (
            <div className="space-y-4">
              <Separator />
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-carebase-text-primary">
                  関連するコミュニケーション記録
                </h3>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {threadRecords.length}件
                </Badge>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {sortedThreadRecords.map((threadRecord, index) => {
                  const isMainRecord = threadRecord.id === record.id;
                  
                  return (
                    <Card
                      key={threadRecord.id}
                      className={`${isMainRecord ? 'ring-2 ring-blue-300 bg-blue-50' : 'bg-gray-50'}`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isMainRecord && (
                              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                                選択中
                              </Badge>
                            )}
                            {index === 0 && (
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                開始
                              </Badge>
                            )}
                            {index > 0 && (
                              <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                                返信 #{index}
                              </Badge>
                            )}
                            <ImportanceBadge isImportant={threadRecord.isImportant} />
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDateTime(threadRecord.datetime)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {/* 関係者情報（コンパクト） */}
                        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                          <span>対応者: {threadRecord.staffName}</span>
                          <span>連絡者: {threadRecord.contactPersonName}</span>
                        </div>

                        {/* 内容（省略表示） */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              <span className="font-medium text-blue-700">内容: </span>
                              {threadRecord.communicationContent}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              <span className="font-medium text-green-700">対応: </span>
                              {threadRecord.responseContent}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* メタ情報 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t text-sm text-gray-500">
            <div>
              <span className="font-medium">記録作成者:</span>
              <div className="mt-1">{record.createdByName}</div>
            </div>
            <div>
              <span className="font-medium">作成日時:</span>
              <div className="mt-1">{formatDateTime(record.createdAt)}</div>
            </div>
            {record.updatedAt !== record.createdAt && (
              <div className="md:col-span-2">
                <span className="font-medium text-blue-600">最終更新:</span>
                <div className="mt-1 text-blue-600">{formatDateTime(record.updatedAt)}</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};