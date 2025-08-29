'use client';

import { ImportanceBadge } from '@/components/1_atoms/communication/importance-badge';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { communicationService } from '@/services/communicationService';
import type { CommunicationRecord } from '@/types/communication';
import type { CommunicationFormData } from '@/validations/communication-validation';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar, Edit3, MessageSquare, Reply, Trash2, User, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';

interface CommunicationRecordCardProps {
  record: CommunicationRecord;
  residentId: number;
  residentName?: string;
  onRecordUpdate?: (updatedRecord: CommunicationRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onEdit?: (record: CommunicationRecord) => void;
  onReply?: (record: CommunicationRecord) => void;
  onCreateHandover?: (record: CommunicationRecord) => void;
  isReply?: boolean;
  className?: string;
}

export const CommunicationRecordCard: React.FC<CommunicationRecordCardProps> = ({
  record,
  residentId,
  residentName,
  onRecordUpdate,
  onRecordDelete,
  onEdit,
  onReply,
  onCreateHandover,
  isReply = false,
  className = '',
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleEditClick = () => {
    onEdit?.(record);
  };

  const handleReplyClick = () => {
    onReply?.(record);
  };

  const handleDeleteClick = () => {
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const handleCreateHandover = () => {
    onCreateHandover?.(record);
  };

  const handleDeleteConfirm = async (): Promise<boolean> => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await communicationService.deleteCommunicationRecord(residentId.toString(), record.id);
      onRecordDelete?.(record.id);
      return true;
    } catch (error) {
      console.error('Failed to delete communication record:', error);
      setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日 HH:mm', { locale: ja });
  };

  const getContactPersonTypeLabel = (type: string) => {
    return type === 'family' ? 'ご家族' : '外部';
  };

  return (
    <>
      <Card className={`mb-4 ${isReply ? 'ml-8 border-l-4 border-l-blue-300' : ''} ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ImportanceBadge isImportant={record.isImportant} />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {getContactPersonTypeLabel(record.contactPersonType)}
              </Badge>
              {isReply && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  返信
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(record.datetime)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReplyClick}
              className="border-green-300 text-green-600 hover:bg-green-50"
            >
              <Reply className="h-3 w-3 mr-1" />
              返信
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateHandover}
              className="border-purple-300 text-purple-600 hover:bg-purple-50"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              申し送り作成
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditClick}>
              <Edit3 className="h-3 w-3 mr-1" />
              編集
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              削除
            </Button>
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
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">コミュニケーション内容</h4>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {record.communicationContent}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">対応内容・備考</h4>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                  {record.responseContent}
                </p>
              </div>
            </div>
          </div>

          {/* メタ情報 */}
          <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>記録作成者: {record.createdByName}</span>
              <span>作成日時: {formatDateTime(record.createdAt)}</span>
            </div>
            {record.updatedAt !== record.createdAt && (
              <div className="mt-1 text-blue-600">最終更新: {formatDateTime(record.updatedAt)}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <GenericDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={`${formatDateTime(record.datetime)}のコミュニケーション記録`}
        itemType="コミュニケーション記録"
        isDeleting={isDeleting}
        error={deleteError}
      />
    </>
  );
};
