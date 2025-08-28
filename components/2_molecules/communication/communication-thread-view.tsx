'use client';

import { ImportanceBadge } from '@/components/1_atoms/communication/importance-badge';
import { CommunicationRecordCard } from '@/components/2_molecules/communication/communication-record-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { CommunicationRecord, CommunicationThread } from '@/types/communication';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, MessageCircle, Reply, Users } from 'lucide-react';
import type React from 'react';

interface CommunicationThreadViewProps {
  thread: CommunicationThread;
  residentId: number;
  residentName?: string;
  onRecordUpdate?: (updatedRecord: CommunicationRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onEdit?: (record: CommunicationRecord) => void;
  onReply?: (record: CommunicationRecord) => void;
  onCreateHandover?: (record: CommunicationRecord) => void;
  onAddToThread?: (threadId: string) => void;
  className?: string;
}

export const CommunicationThreadView: React.FC<CommunicationThreadViewProps> = ({
  thread,
  residentId,
  residentName,
  onRecordUpdate,
  onRecordDelete,
  onEdit,
  onReply,
  onCreateHandover,
  onAddToThread,
  className = '',
}) => {
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  // Sort records by datetime (oldest first for thread view)
  const sortedRecords = [...thread.records].sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  );

  const handleAddToThread = () => {
    onAddToThread?.(thread.id);
  };

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ImportanceBadge isImportant={thread.isImportant} />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <MessageCircle className="h-3 w-3 mr-1" />
                スレッド
              </Badge>
            </div>
            <CardTitle className="text-lg text-carebase-text-primary">
              {thread.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>最終更新: {formatDateTime(thread.lastActivity)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{thread.records.length}件の記録</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddToThread}
              className="border-carebase-blue text-carebase-blue hover:bg-carebase-blue-light"
            >
              <Reply className="h-3 w-3 mr-1" />
              スレッドに追加
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Thread records */}
        <div className="space-y-4">
          {sortedRecords.map((record, index) => (
            <CommunicationRecordCard
              key={record.id}
              record={record}
              residentId={residentId}
              residentName={residentName}
              onRecordUpdate={onRecordUpdate}
              onRecordDelete={onRecordDelete}
              onEdit={onEdit}
              onReply={onReply}
              onCreateHandover={onCreateHandover}
              isReply={index > 0} // 最初の記録以外は返信として表示
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};