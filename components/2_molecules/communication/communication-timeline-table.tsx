'use client';

import { ImportanceBadge } from '@/components/1_atoms/communication/importance-badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { CommunicationRecord } from '@/types/communication';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  Calendar,
  Edit3,
  FileText,
  MessageCircle,
  MessageSquare,
  MoreVertical,
  Reply,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

interface CommunicationTimelineTableProps {
  records: CommunicationRecord[];
  residentId: string;
  residentName: string;
  onRecordUpdate?: (updatedRecord: CommunicationRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onEdit?: (record: CommunicationRecord) => void;
  onReply?: (record: CommunicationRecord) => void;
  onCreateHandover?: (record: CommunicationRecord) => void;
  onViewThread?: (record: CommunicationRecord) => void;
  className?: string;
}

export const CommunicationTimelineTable: React.FC<CommunicationTimelineTableProps> = ({
  records,
  residentId,
  residentName,
  onRecordUpdate,
  onRecordDelete,
  onEdit,
  onReply,
  onCreateHandover,
  onViewThread,
  className = '',
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy/MM/dd', { locale: ja });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: ja });
  };

  const isSameDay = (date1: string, date2: string) => {
    return format(new Date(date1), 'yyyy-MM-dd') === format(new Date(date2), 'yyyy-MM-dd');
  };

  const getContactPersonTypeLabel = (type: string) => {
    return type === 'family' ? 'ご家族' : '外部';
  };

  const handleEdit = (record: CommunicationRecord) => {
    onEdit?.(record);
  };

  const handleReply = (record: CommunicationRecord) => {
    onReply?.(record);
  };

  const handleDelete = (record: CommunicationRecord) => {
    onRecordDelete?.(record.id);
  };

  const handleCreateHandover = (record: CommunicationRecord) => {
    onCreateHandover?.(record);
  };

  const handleViewThread = (record: CommunicationRecord) => {
    onViewThread?.(record);
  };

  // Sort records by datetime (newest first)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
  );

  // Group records by thread and count thread members
  const getThreadInfo = (record: CommunicationRecord) => {
    if (!record.threadId) return null;

    const threadRecords = records.filter((r) => r.threadId === record.threadId);
    return {
      count: threadRecords.length,
      isMainRecord:
        threadRecords.sort(
          (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
        )[0].id === record.id,
    };
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-20">時間</TableHead>
            <TableHead className="w-32">連絡者</TableHead>
            <TableHead className="w-32">対応者</TableHead>
            <TableHead>コミュニケーション内容</TableHead>
            <TableHead className="w-24">重要度</TableHead>
            <TableHead className="w-32">スレッド</TableHead>
            <TableHead className="w-20">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRecords.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <MessageCircle className="h-12 w-12 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      コミュニケーション記録がありません
                    </h3>
                    <p className="text-gray-500">
                      ご家族や関係者とのコミュニケーション記録を登録してください。
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedRecords.map((record, index) => {
              const isUpdating = isUpdatingStatus === record.id;
              const showDateDivider =
                index === 0 || !isSameDay(record.datetime, sortedRecords[index - 1].datetime);

              const threadInfo = getThreadInfo(record);

              return (
                <React.Fragment key={record.id}>
                  {/* 日付区切り行 */}
                  {showDateDivider && (
                    <TableRow className="bg-blue-50 border-t-2 border-blue-200">
                      <TableCell colSpan={8} className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-800">
                            {formatDate(record.datetime)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* コミュニケーション記録行 */}
                  <TableRow
                    className={`
                      hover:bg-gray-50 transition-colors cursor-pointer
                      ${record.isImportant ? 'bg-red-50' : ''}
                    `}
                    onClick={() => handleViewThread(record)}
                  >
                    {/* 時間列 */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <span>{formatTime(record.datetime)}</span>
                      </div>
                    </TableCell>

                    {/* 連絡者列 */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 text-gray-500" />
                          <span className="text-sm font-medium">{record.contactPersonName}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {getContactPersonTypeLabel(record.contactPersonType)}
                        </div>
                      </div>
                    </TableCell>

                    {/* 対応者列 */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="h-3 w-3" />
                        <span className="truncate">{record.staffName}</span>
                      </div>
                    </TableCell>

                    {/* コミュニケーション内容列 */}
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                          {record.communicationContent}
                        </p>
                        {record.responseContent && (
                          <div className="flex items-start gap-1 text-xs text-green-700">
                            <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-1">対応: {record.responseContent}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* 重要度列 */}
                    <TableCell>
                      <ImportanceBadge isImportant={record.isImportant} />
                    </TableCell>

                    {/* スレッド列 */}
                    <TableCell>
                      {threadInfo ? (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">
                            {threadInfo.count}件
                          </span>
                          {threadInfo.isMainRecord && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">
                              開始
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </TableCell>

                    {/* 操作列 */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={isUpdating}
                            className="h-8 w-8 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReply(record);
                            }}
                            className="cursor-pointer"
                          >
                            <Reply className="h-4 w-4 mr-2" />
                            返信
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateHandover(record);
                            }}
                            className="cursor-pointer"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            申し送り作成
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(record);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit3 className="h-4 w-4 mr-2" />
                            編集
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(record);
                            }}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            削除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
