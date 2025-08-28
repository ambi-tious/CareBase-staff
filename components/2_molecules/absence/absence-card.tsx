'use client';

import { AbsenceReasonBadge } from '@/components/1_atoms/absence/absence-reason-badge';
import { AbsenceStatusBadge } from '@/components/1_atoms/absence/absence-status-badge';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  Pause,
  Play,
  Trash2,
  User,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AbsenceCardProps {
  absence: Absence;
  residentId: string;
  residentName?: string;
  onAbsenceUpdate?: (updatedAbsence: Absence) => void;
  onAbsenceDelete?: (absenceId: string) => void;
  onEdit?: (absence: Absence) => void;
  className?: string;
}

export const AbsenceCard: React.FC<AbsenceCardProps> = ({
  absence,
  residentId,
  residentName,
  onAbsenceUpdate,
  onAbsenceDelete,
  onEdit,
  className = '',
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  const formatDateRange = () => {
    const start = new Date(absence.startDateTime);
    const end = new Date(absence.endDateTime);
    
    // 同じ日の場合
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return `${format(start, 'yyyy年MM月dd日 HH:mm', { locale: ja })} - ${format(end, 'HH:mm')}`;
    }
    
    // 異なる日の場合
    return `${formatDateTime(absence.startDateTime)} - ${formatDateTime(absence.endDateTime)}`;
  };

  const getDuration = () => {
    const start = new Date(absence.startDateTime);
    const end = new Date(absence.endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}時間${diffMinutes > 0 ? `${diffMinutes}分` : ''}`;
    }
    return `${diffMinutes}分`;
  };

  const handleEdit = () => {
    onEdit?.(absence);
  };

  const handleDelete = () => {
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdatingStatus(true);
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
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await absenceService.deleteAbsence(residentId, absence.id);
      onAbsenceDelete?.(absence.id);
      return true;
    } catch (error) {
      console.error('Failed to delete absence:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const canEdit = absence.status === 'scheduled';
  const canCancel = absence.status === 'scheduled' || absence.status === 'ongoing';
  const canMarkOngoing = absence.status === 'scheduled';
  const canMarkCompleted = absence.status === 'ongoing';

  return (
    <>
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <AbsenceStatusBadge status={absence.status} />
                <AbsenceReasonBadge 
                  reason={absence.reason} 
                  customReason={absence.customReason}
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">{formatDateRange()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>期間: {getDuration()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={isUpdatingStatus}
                    className="h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {canEdit && (
                    <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                      <Edit3 className="h-4 w-4 mr-2" />
                      編集
                    </DropdownMenuItem>
                  )}
                  
                  {canMarkOngoing && (
                    <DropdownMenuItem 
                      onClick={() => handleStatusUpdate('ongoing')} 
                      className="cursor-pointer"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      不在開始
                    </DropdownMenuItem>
                  )}
                  
                  {canMarkCompleted && (
                    <DropdownMenuItem 
                      onClick={() => handleStatusUpdate('completed')} 
                      className="cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      帰所完了
                    </DropdownMenuItem>
                  )}
                  
                  {canCancel && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleStatusUpdate('cancelled')} 
                        className="cursor-pointer text-orange-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        キャンセル
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleDelete} 
                    className="cursor-pointer text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Notes */}
          {absence.notes && (
            <div className="mb-4">
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">{absence.notes}</p>
              </div>
            </div>
          )}

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>登録者: {absence.createdByName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>登録日: {formatDateTime(absence.createdAt)}</span>
            </div>
            {absence.approvedByName && (
              <>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>承認者: {absence.approvedByName}</span>
                </div>
                {absence.approvedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>承認日: {formatDateTime(absence.approvedAt)}</span>
                  </div>
                )}
              </>
            )}
            {absence.updatedAt !== absence.createdAt && (
              <div className="flex items-center gap-1 md:col-span-2">
                <Calendar className="h-3 w-3" />
                <span className="text-blue-600">最終更新: {formatDateTime(absence.updatedAt)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={`${formatDateRange()}の不在記録`}
        itemType="不在情報"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};