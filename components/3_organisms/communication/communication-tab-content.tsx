'use client';

import { CommunicationList } from '@/components/3_organisms/communication/communication-list';
import { CommunicationModal } from '@/components/3_organisms/modals/communication-modal';
import type { ContactPerson } from '@/mocks/care-board-data';
import { getCommunicationRecordsByResident, getCommunicationThreadsByResident } from '@/mocks/communication-data';
import { communicationService } from '@/services/communicationService';
import type { CommunicationRecord, CommunicationThread } from '@/types/communication';
import type { CommunicationFormData } from '@/validations/communication-validation';
import { useRouter } from 'next/navigation';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { toast } from 'sonner';

interface CommunicationTabContentProps {
  residentId: number;
  residentName: string;
  contacts: ContactPerson[];
  className?: string;
}

export interface CommunicationTabContentRef {
  openCreateModal: () => void;
}

export const CommunicationTabContent = forwardRef<CommunicationTabContentRef, CommunicationTabContentProps>(
  ({ residentId, residentName, contacts, className = '' }, ref) => {
    const router = useRouter();
    const [records, setRecords] = useState<CommunicationRecord[]>([]);
    const [threads, setThreads] = useState<CommunicationThread[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<CommunicationRecord | null>(null);
    const [replyingToRecord, setReplyingToRecord] = useState<CommunicationRecord | null>(null);
    const communicationListRef = useRef<{ openCreateModal: () => void }>(null);

    // Load communication data
    useEffect(() => {
      const loadCommunications = async () => {
        try {
          setIsLoading(true);
          const [residentRecords, residentThreads] = await Promise.all([
            communicationService.getResidentCommunicationRecords(residentId.toString()),
            communicationService.getResidentCommunicationThreads(residentId.toString()),
          ]);
          setRecords(residentRecords);
          setThreads(residentThreads);
        } catch (error) {
          console.error('Failed to load communications:', error);
          // Fallback to mock data
          const mockRecords = getCommunicationRecordsByResident(residentId.toString());
          const mockThreads = getCommunicationThreadsByResident(residentId.toString());
          setRecords(mockRecords);
          setThreads(mockThreads);
        } finally {
          setIsLoading(false);
        }
      };

      loadCommunications();
    }, [residentId]);

    // Expose methods to parent component via ref
    useImperativeHandle(
      ref,
      () => ({
        openCreateModal: () => {
          setIsCreateModalOpen(true);
        },
      }),
      []
    );

    const handleRecordCreate = (newRecord: CommunicationRecord) => {
      setRecords((prev) => [newRecord, ...prev]);
      
      // Update threads if the record belongs to a thread
      if (newRecord.threadId) {
        setThreads((prev) => 
          prev.map((thread) => 
            thread.id === newRecord.threadId
              ? {
                  ...thread,
                  records: [...thread.records, newRecord],
                  lastActivity: newRecord.datetime,
                  isImportant: thread.isImportant || newRecord.isImportant,
                }
              : thread
          )
        );
      }
    };

    const handleRecordUpdate = (updatedRecord: CommunicationRecord) => {
      setRecords((prev) =>
        prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record))
      );
      
      // Update threads if the record belongs to a thread
      if (updatedRecord.threadId) {
        setThreads((prev) => 
          prev.map((thread) => 
            thread.id === updatedRecord.threadId
              ? {
                  ...thread,
                  records: thread.records.map((r) => 
                    r.id === updatedRecord.id ? updatedRecord : r
                  ),
                  lastActivity: updatedRecord.updatedAt,
                }
              : thread
          )
        );
      }
    };

    const handleRecordDelete = (recordId: string) => {
      setRecords((prev) => prev.filter((record) => record.id !== recordId));
      
      // Update threads
      setThreads((prev) => 
        prev.map((thread) => ({
          ...thread,
          records: thread.records.filter((r) => r.id !== recordId),
        })).filter((thread) => thread.records.length > 0) // Remove empty threads
      );
    };

    const handleEdit = (record: CommunicationRecord) => {
      setEditingRecord(record);
      setIsEditModalOpen(true);
    };

    const handleReply = (record: CommunicationRecord) => {
      setReplyingToRecord(record);
      setIsReplyModalOpen(true);
    };

    const handleCreateHandover = (record: CommunicationRecord) => {
      // Navigate to contact schedule creation with pre-filled data
      const handoverData = {
        type: 'handover',
        title: `${record.contactPersonName}様とのコミュニケーションについて`,
        content: `【コミュニケーション内容】\n${record.communicationContent}\n\n【対応内容】\n${record.responseContent}`,
        priority: record.isImportant ? 'high' : 'medium',
        relatedResidentId: residentId.toString(),
      };

      // URLパラメータとして渡す
      const params = new URLSearchParams();
      Object.entries(handoverData).forEach(([key, value]) => {
        if (value) params.set(key, value.toString());
      });

      router.push(`/contact-schedule/new?${params.toString()}`);
      toast.success('申し送り作成画面に移動します。');
    };

    const handleCreateSubmit = async (data: CommunicationFormData): Promise<boolean> => {
      try {
        const newRecord = await communicationService.createCommunicationRecord(
          residentId.toString(),
          data
        );
        handleRecordCreate(newRecord);
        setIsCreateModalOpen(false);

        // Show success toast
        toast.success('コミュニケーション記録の登録が完了しました。');

        return true;
      } catch (error) {
        console.error('Failed to create communication record:', error);
        return false;
      }
    };

    const handleEditSubmit = async (data: CommunicationFormData): Promise<boolean> => {
      if (!editingRecord) return false;

      try {
        const updatedRecord = await communicationService.updateCommunicationRecord(
          residentId.toString(),
          editingRecord.id,
          data
        );
        handleRecordUpdate(updatedRecord);
        setIsEditModalOpen(false);
        setEditingRecord(null);

        // Show success toast
        toast.success('コミュニケーション記録の更新が完了しました。');

        return true;
      } catch (error) {
        console.error('Failed to update communication record:', error);
        return false;
      }
    };

    const handleReplySubmit = async (data: CommunicationFormData): Promise<boolean> => {
      if (!replyingToRecord) return false;

      try {
        const replyData = {
          ...data,
          threadId: replyingToRecord.threadId || `thread-${Date.now()}`,
          parentId: replyingToRecord.id,
        };

        const newRecord = await communicationService.createCommunicationRecord(
          residentId.toString(),
          replyData
        );
        handleRecordCreate(newRecord);
        setIsReplyModalOpen(false);
        setReplyingToRecord(null);

        // Show success toast
        toast.success('返信の登録が完了しました。');

        return true;
      } catch (error) {
        console.error('Failed to create reply:', error);
        return false;
      }
    };

    const handleCloseModals = () => {
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setIsReplyModalOpen(false);
      setEditingRecord(null);
      setReplyingToRecord(null);
    };

    if (isLoading) {
      return (
        <div className={`flex justify-center items-center h-64 ${className}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-carebase-blue mx-auto mb-4"></div>
            <p className="text-gray-500">コミュニケーション記録を読み込み中...</p>
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        <CommunicationList
          ref={communicationListRef}
          records={records}
          threads={threads}
          residentId={residentId}
          residentName={residentName}
          onRecordUpdate={handleRecordUpdate}
          onRecordDelete={handleRecordDelete}
          onRecordCreate={handleRecordCreate}
          onEdit={handleEdit}
          onReply={handleReply}
          onCreateHandover={handleCreateHandover}
        />

        {/* Modals */}
        <CommunicationModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleCreateSubmit}
          residentName={residentName}
          contacts={contacts}
          mode="create"
        />

        <CommunicationModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleEditSubmit}
          record={editingRecord || undefined}
          residentName={residentName}
          contacts={contacts}
          mode="edit"
        />

        <CommunicationModal
          isOpen={isReplyModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleReplySubmit}
          record={replyingToRecord || undefined}
          residentName={residentName}
          contacts={contacts}
          mode="reply"
        />
      </div>
    );
  }
);

CommunicationTabContent.displayName = 'CommunicationTabContent';