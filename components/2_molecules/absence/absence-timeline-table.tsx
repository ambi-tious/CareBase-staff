'use client';

import { AbsenceReasonBadge } from '@/components/1_atoms/absence/absence-reason-badge';
import { AbsenceStatusBadge } from '@/components/1_atoms/absence/absence-status-badge';
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
import { absenceService } from '@/services/absenceService';
import type { Absence } from '@/types/absence';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import {
  Calendar,
  CheckCircle,
  Clock,
  Edit3,
  FileText,
  MoreVertical,
  Play,
  Trash2,
  User,
  X,
} from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AbsenceTimelineTableProps {
  absences: Absence[];
  residentId: string;
  residentName: string;
  onAbsenceUpdate?: (updatedAbsence: Absence) => void;
  onAbsenceDelete?: (absenceId: string) => void;
  onEdit?: (absence: Absence) => void;
  className?: string;
}

export const AbsenceTimelineTable: React.FC<AbsenceTimelineTableProps> = ({
  absences,
  residentId,
  residentName,
  onAbsenceUpdate,
  onAbsenceDelete,
  onEdit,
  className = '',
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MM/dd HH:mm', { locale: ja });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy/MM/dd', { locale: ja });
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'HH:mm', { locale: ja });
  };

  const getDuration = (startDateTime: string, endDateTime: string) => {
    const start = new Date(startDateTime);
    const end = new Date(endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}時間${diffMinutes > 0 ? `${diffMinutes}分` : ''}`;
    }
    return `${diffMinutes}分`;
  };

  const isSameDay = (date1: string, date2: string) => {
    return format(new Date(date1), 'yyyy-MM-dd') === format(new Date(date2), 'yyyy-MM-dd');
  };

  const handleStatusUpdate = async (absence: Absence, newStatus: string) => {
    setIsUpdatingStatus(absence.id);
    try {
      const updatedAbsence = await absenceService.updateAbsenceStatus(
        residentId,
        absence.id,
        newStatus
      );
      onAbsenceUpdate?.(updatedAbsence);
      
      const statusLabels = {
        scheduled: '予定',
        ongoing: '不在中',
        completed: '帰所済み',
        cancelled: 'キャンセル',
      };
      
      toast.success(`ステータスを「${statusLabels[newStatus as keyof typeof statusLabels]}」に更新しました`);
    } catch (error) {
      console.error('Failed to update absence status:', error);
      toast.error('ステータスの更新に失敗しました');
    } finally {
      setIsUpdatingStatus(null);
    }
  };

  const handleEdit = (absence: Absence) => {
    onEdit?.(absence);
  };

  const handleDelete = (absence: Absence) => {
    onAbsenceDelete?.(absence.id);
  };

  const canEdit = (absence: Absence) => absence.status === 'scheduled';
  const canCancel = (absence: Absence) => absence.status === 'scheduled' || absence.status === 'ongoing';
  const canMarkOngoing = (absence: Absence) => absence.status === 'scheduled';
  const canMarkCompleted = (absence: Absence) => absence.status === 'ongoing';

  // Sort absences by start date (newest first)
  const sortedAbsences = [...absences].sort(
    (a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
  );

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-24">日付</TableHead>
            <TableHead className="w-32">時間</TableHead>
            <TableHead className="w-20">期間</TableHead>
            <TableHead className="w-32">理由</TableHead>
            <TableHead className="w-24">ステータス</TableHead>
            <TableHead>備考</TableHead>
            <TableHead className="w-24">登録者</TableHead>
            <TableHead className="w-20">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAbsences.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Calendar className="h-12 w-12 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">不在記録がありません</h3>
                    <p className="text-gray-500">
                      利用者様の外出や通院などの不在記録を登録してください。
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            sortedAbsences.map((absence, index) => {
              const isUpdating = isUpdatingStatus === absence.id;
              const showDateDivider = 
                index === 0 || 
                !isSameDay(absence.startDateTime, sortedAbsences[index - 1].startDateTime);

              return (
                <React.Fragment key={absence.id}>
                  {/* 日付区切り行 */}
                  {showDateDivider && (
                    <TableRow className="bg-blue-50 border-t-2 border-blue-200">
                      <TableCell colSpan={8} className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-600" />
                          <span className="font-semibold text-blue-800">
                            {formatDate(absence.startDateTime)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* 不在記録行 */}
                  <TableRow 
                    className={`
                      hover:bg-gray-50 transition-colors
                      ${absence.status === 'ongoing' ? 'bg-yellow-50' : ''}
                      ${absence.status === 'completed' ? 'bg-green-50' : ''}
                      ${absence.status === 'cancelled' ? 'bg-gray-50' : ''}
                    `}
                  >
                    {/* 日付列（同日の場合は空白） */}
                    <TableCell className="text-sm text-gray-600">
                      {showDateDivider ? '' : ''}
                    </TableCell>

                    {/* 時間列 */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span>{formatTime(absence.startDateTime)}</span>
                          <span className="text-gray-400">-</span>
                          <span>{formatTime(absence.endDateTime)}</span>
                        </div>
                        {!isSameDay(absence.startDateTime, absence.endDateTime) && (
                          <div className="text-xs text-orange-600">
                            終了: {formatDate(absence.endDateTime)}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* 期間列 */}
                    <TableCell className="text-sm text-gray-600">
                      {getDuration(absence.startDateTime, absence.endDateTime)}
                    </TableCell>

                    {/* 理由列 */}
                    <TableCell>
                      <AbsenceReasonBadge 
                        reason={absence.reason} 
                        customReason={absence.customReason}
                      />
                    </TableCell>

                    {/* ステータス列 */}
                    <TableCell>
                      <AbsenceStatusBadge status={absence.status} />
                    </TableCell>

                    {/* 備考列 */}
                    <TableCell>
                      {absence.notes ? (
                        <div className="flex items-start gap-2">
                          <FileText className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 line-clamp-2">
                            {absence.notes}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>

                    {/* 登録者列 */}
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="h-3 w-3" />
                        <span className="truncate">{absence.createdByName}</span>
                      </div>
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
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          {canEdit(absence) && (
                            <DropdownMenuItem 
                              onClick={() => handleEdit(absence)} 
                              className="cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              編集
                            </DropdownMenuItem>
                          )}
                          
                          {canMarkOngoing(absence) && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(absence, 'ongoing')} 
                              className="cursor-pointer"
                              disabled={isUpdating}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              不在開始
                            </DropdownMenuItem>
                          )}
                          
                          {canMarkCompleted(absence) && (
                            <DropdownMenuItem 
                              onClick={() => handleStatusUpdate(absence, 'completed')} 
                              className="cursor-pointer"
                              disabled={isUpdating}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              帰所完了
                            </DropdownMenuItem>
                          )}
                          
                          {canCancel(absence) && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleStatusUpdate(absence, 'cancelled')} 
                                className="cursor-pointer text-orange-600"
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4 mr-2" />
                                キャンセル
                              </DropdownMenuItem>
                            </>
                          )}
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(absence)} 
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