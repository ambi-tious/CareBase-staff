'use client';

import { CommunicationFilters } from '@/components/2_molecules/communication/communication-filters';
import { CommunicationTimelineTable } from '@/components/2_molecules/communication/communication-timeline-table';
import { CommunicationDetailModal } from '@/components/3_organisms/modals/communication-detail-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { CommunicationRecord, CommunicationThread } from '@/types/communication';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { MessageCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

interface CommunicationListProps {
  records: CommunicationRecord[];
  threads: CommunicationThread[];
  residentId: number;
  residentName: string;
  onRecordUpdate?: (updatedRecord: CommunicationRecord) => void;
  onRecordDelete?: (recordId: string) => void;
  onRecordCreate?: (newRecord: CommunicationRecord) => void;
  onEdit?: (record: CommunicationRecord) => void;
  onReply?: (record: CommunicationRecord) => void;
  onCreateHandover?: (record: CommunicationRecord) => void;
  className?: string;
}

export interface CommunicationListRef {
  openCreateModal: () => void;
}

export const CommunicationList = forwardRef<CommunicationListRef, CommunicationListProps>(
  (
    {
      records,
      threads,
      residentId,
      residentName,
      onRecordUpdate,
      onRecordDelete,
      onRecordCreate,
      onEdit,
      onReply,
      onCreateHandover,
      className = '',
    },
    ref
  ) => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showImportantOnly, setShowImportantOnly] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<CommunicationRecord | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState<CommunicationRecord | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    // Expose methods to parent component via ref
    useImperativeHandle(
      ref,
      () => ({
        openCreateModal: () => {
          router.push(`/residents/${residentId}/communications/new`);
        },
      }),
      [router, residentId]
    );

    // Filter records and threads
    const filteredRecords = useMemo(() => {
      return records.filter((record) => {
        // Search filter
        const matchesSearch =
          searchQuery === '' ||
          record.communicationContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.responseContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.contactPersonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.staffName.toLowerCase().includes(searchQuery.toLowerCase());

        // Importance filter
        const matchesImportance = !showImportantOnly || record.isImportant;

        return matchesSearch && matchesImportance;
      });
    }, [records, searchQuery, showImportantOnly]);

    // Get thread records for selected record
    const getThreadRecords = (record: CommunicationRecord): CommunicationRecord[] => {
      if (!record.threadId) return [record];
      return records.filter(r => r.threadId === record.threadId);
    };

    const handleCreateRecord = () => {
      router.push(`/residents/${residentId}/communications/new`);
    };

    const handleResetFilters = () => {
      setSearchQuery('');
      setShowImportantOnly(false);
    };

    const handleViewRecord = (record: CommunicationRecord) => {
      setSelectedRecord(record);
      setIsDetailModalOpen(true);
    };

    const handleEdit = (record: CommunicationRecord) => {
      setIsDetailModalOpen(false);
      onEdit?.(record);
    };

    const handleReply = (record: CommunicationRecord) => {
      setIsDetailModalOpen(false);
      onReply?.(record);
    };

    const handleCreateHandover = (record: CommunicationRecord) => {
      setIsDetailModalOpen(false);
      onCreateHandover?.(record);
    };

    const handleDeleteRecord = (recordId: string) => {
      const record = records.find(r => r.id === recordId);
      if (record) {
        setDeletingRecord(record);
        setDeleteError(null);
        setIsDeleteModalOpen(true);
      }
    };

    const handleDeleteConfirm = async (): Promise<boolean> => {
      if (!deletingRecord) return false;

      setIsDeleting(true);
      setDeleteError(null);

      try {
        const { communicationService } = await import('@/services/communicationService');
        await communicationService.deleteCommunicationRecord(residentId.toString(), deletingRecord.id);
        onRecordDelete?.(deletingRecord.id);

        toast.success('コミュニケーション記録の削除が完了しました。');
        return true;
      } catch (error) {
        console.error('Failed to delete communication record:', error);
        setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
        return false;
      } finally {
        setIsDeleting(false);
      }
    };

    const handleCloseModals = () => {
      setIsDetailModalOpen(false);
      setIsDeleteModalOpen(false);
      setSelectedRecord(null);
      setDeletingRecord(null);
      setDeleteError(null);
    };

    const totalRecords = records.length;
    const importantRecords = records.filter((r) => r.isImportant).length;

    return (
      <div className={`space-y-6 ${className}`}>
        {/* Search and Filters */}
        <CommunicationFilters
          searchQuery={searchQuery}
          showImportantOnly={showImportantOnly}
          onSearchChange={setSearchQuery}
          onImportantToggle={setShowImportantOnly}
          onReset={handleResetFilters}
          totalCount={totalRecords}
          importantCount={importantRecords}
          filteredCount={filteredRecords.length}
        />

        {/* Timeline Table */}
        {filteredRecords.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || showImportantOnly
                  ? '検索条件に一致するコミュニケーション記録がありません'
                  : 'コミュニケーション記録がありません'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || showImportantOnly
                  ? '検索条件を変更するか、新しいコミュニケーション記録を登録してください。'
                  : 'ご家族や関係者とのコミュニケーション記録を管理できます。'}
              </p>
              <Button
                onClick={handleCreateRecord}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                <Plus className="h-4 w-4 mr-2" />
                最初のコミュニケーション記録を登録
              </Button>
            </CardContent>
          </Card>
        ) : (
          <CommunicationTimelineTable
            records={filteredRecords}
            residentId={residentId}
            residentName={residentName}
            onRecordUpdate={onRecordUpdate}
            onRecordDelete={handleDeleteRecord}
            onEdit={handleEdit}
            onReply={handleReply}
            onCreateHandover={handleCreateHandover}
            onViewThread={handleViewRecord}
          />
        )}

        {/* Modals */}
        <CommunicationDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModals}
          record={selectedRecord}
          threadRecords={selectedRecord ? getThreadRecords(selectedRecord) : []}
          residentId={residentId}
          residentName={residentName}
          onEdit={handleEdit}
          onReply={handleReply}
          onCreateHandover={handleCreateHandover}
          onRecordUpdate={onRecordUpdate}
          onRecordDelete={onRecordDelete}
        />

        <GenericDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleDeleteConfirm}
          itemName={
            deletingRecord
              ? `${format(new Date(deletingRecord.datetime), 'MM/dd HH:mm', { locale: ja })}のコミュニケーション記録`
              : ''
          }
          itemType="コミュニケーション記録"
          isDeleting={isDeleting}
          error={deleteError}
        />
      </div>
    );
  }
);

CommunicationList.displayName = 'CommunicationList';