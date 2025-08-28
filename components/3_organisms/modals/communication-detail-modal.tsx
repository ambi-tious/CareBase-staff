'use client';

import { ImportanceBadge } from '@/components/1_atoms/communication/importance-badge';
import { CommunicationRecordCard } from '@/components/2_molecules/communication/communication-record-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { CommunicationRecord } from '@/types/communication';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, MessageCircle, MessageSquare, Reply, User, Users } from 'lucide-react';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto tablet:max-w-[95vw] tablet:max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-carebase-text-primary tablet:text-tablet-xl flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            コミュニケーション記録詳細
            {hasThread && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <MessageSquare className="h-3 w-3 mr-1" />
                スレッド ({threadRecords.length}件)
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-600 tablet:text-tablet-base tablet:mt-3">
            {residentName && `${residentName}様の`}コミュニケーション記録の詳細です。
            {hasThread && 'スレッド内の関連する記録も表示されています。'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 tablet:space-y-8">
          {/* メイン記録の詳細情報 */}
          <div className="space-y-4">
            {/* ヘッダー情報 */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ImportanceBadge isImportant={record.isImportant} />
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {getContactPersonTypeLabel(record.contactPersonType)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(record.datetime)}</span>
                  </div>
                  <span>記録ID: {record.id}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReply?.(record)}
                  className="border-green-300 text-green-600 hover:bg-green-50"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  返信
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCreateHandover?.(record)}
                  className="border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  <MessageSquare className="h-3 w-3 mr-1" />
                  申し送り作成
                </Button>
              </div>
            </div>

            {/* 関係者情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
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
                <h4 className="text-lg font-semibold text-gray-700 mb-2">コミュニケーション内容</h4>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {record.communicationContent}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">対応内容・備考</h4>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {record.responseContent}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* スレッド表示（複数の記録がある場合） */}
          {hasThread && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b pb-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-carebase-text-primary">
                  関連するコミュニケーション記録 ({threadRecords.length}件)
                </h3>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {sortedThreadRecords.map((threadRecord, index) => (
                  <div
                    key={threadRecord.id}
                    className={`${threadRecord.id === record.id ? 'ring-2 ring-blue-300' : ''}`}
                  >
                    <CommunicationRecordCard
                      record={threadRecord}
                      residentId={residentId}
                      residentName={residentName}
                      onRecordUpdate={onRecordUpdate}
                      onRecordDelete={onRecordDelete}
                      onEdit={onEdit}
                      onReply={onReply}
                      onCreateHandover={onCreateHandover}
                      isReply={index > 0}
                    />
                  </div>
                ))}
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