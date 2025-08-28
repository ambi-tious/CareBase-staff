'use client';

import { AbsenceFilters } from '@/components/2_molecules/absence/absence-filters';
import { AbsenceTimelineTable } from '@/components/2_molecules/absence/absence-timeline-table';
import { AbsenceModal } from '@/components/3_organisms/modals/absence-modal';
import { GenericDeleteModal } from '@/components/3_organisms/modals/generic-delete-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { absenceService } from '@/services/absenceService';
import type { Absence, AbsenceReason, AbsenceStatus } from '@/types/absence';
import type { AbsenceFormData } from '@/validations/absence-validation';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale/ja';
import { CalendarPlus, MapPin } from 'lucide-react';
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface AbsenceListProps {
  absences: Absence[];
  residentId: string;
  residentName: string;
  onAbsenceUpdate?: (updatedAbsence: Absence) => void;
  onAbsenceDelete?: (absenceId: string) => void;
  onAbsenceCreate?: (newAbsence: Absence) => void;
  className?: string;
}

export interface AbsenceListRef {
  openCreateModal: () => void;
}

export const AbsenceList = forwardRef<AbsenceListRef, AbsenceListProps>(
  (
    {
      absences,
      residentId,
      residentName,
      onAbsenceUpdate,
      onAbsenceDelete,
      onAbsenceCreate,
      className = '',
    },
    ref
  ) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<AbsenceStatus | undefined>();
    const [selectedReason, setSelectedReason] = useState<AbsenceReason | undefined>();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingAbsence, setEditingAbsence] = useState<Absence | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingAbsence, setDeletingAbsence] = useState<Absence | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

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

    // Filter and search absences
    const filteredAbsences = useMemo(() => {
      return absences.filter((absence) => {
        // Search filter
        const matchesSearch =
          searchQuery === '' ||
          absence.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          absence.customReason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          absence.createdByName.toLowerCase().includes(searchQuery.toLowerCase());

        // Status filter
        const matchesStatus = !selectedStatus || absence.status === selectedStatus;

        // Reason filter
        const matchesReason = !selectedReason || absence.reason === selectedReason;

        return matchesSearch && matchesStatus && matchesReason;
      });
    }, [absences, searchQuery, selectedStatus, selectedReason]);

    const handleResetFilters = () => {
      setSearchQuery('');
      setSelectedStatus(undefined);
      setSelectedReason(undefined);
    };

    const handleCreateAbsence = () => {
      setIsCreateModalOpen(true);
    };

    const handleEditAbsence = (absence: Absence) => {
      setEditingAbsence(absence);
      setIsEditModalOpen(true);
    };

    const handleDeleteAbsence = (absenceId: string) => {
      const absence = absences.find((a) => a.id === absenceId);
      if (absence) {
        setDeletingAbsence(absence);
        setDeleteError(null);
        setIsDeleteModalOpen(true);
      }
    };

    const handleDeleteConfirm = async (): Promise<boolean> => {
      if (!deletingAbsence) return false;

      setIsDeleting(true);
      setDeleteError(null);

      try {
        await absenceService.deleteAbsence(residentId, deletingAbsence.id);
        onAbsenceDelete?.(deletingAbsence.id);

        toast.success('不在記録の削除が完了しました。');
        return true;
      } catch (error) {
        console.error('Failed to delete absence:', error);
        setDeleteError(error instanceof Error ? error.message : '削除に失敗しました。');
        return false;
      } finally {
        setIsDeleting(false);
      }
    };
    const handleCreateSubmit = async (data: AbsenceFormData): Promise<boolean> => {
      try {
        const newAbsence = await absenceService.createAbsence(residentId, data);
        onAbsenceCreate?.(newAbsence);
        setIsCreateModalOpen(false);

        // Show success toast
        toast.success('不在情報の登録が完了しました。');

        return true;
      } catch (error) {
        console.error('Failed to create absence:', error);
        return false;
      }
    };

    const handleEditSubmit = async (data: AbsenceFormData): Promise<boolean> => {
      if (!editingAbsence) return false;

      try {
        const updatedAbsence = await absenceService.updateAbsence(
          residentId,
          editingAbsence.id,
          data
        );
        onAbsenceUpdate?.(updatedAbsence);
        setIsEditModalOpen(false);
        setEditingAbsence(null);

        // Show success toast
        toast.success('不在情報の更新が完了しました。');

        return true;
      } catch (error) {
        console.error('Failed to update absence:', error);
        return false;
      }
    };

    const handleCloseModals = () => {
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      setIsDeleteModalOpen(false);
      setEditingAbsence(null);
      setDeletingAbsence(null);
      setDeleteError(null);
    };

    return (
      <div className={`space-y-6 ${className}`}>
        {/* Search and Filters */}
        <AbsenceFilters
          searchQuery={searchQuery}
          selectedStatus={selectedStatus}
          selectedReason={selectedReason}
          onSearchChange={setSearchQuery}
          onStatusChange={setSelectedStatus}
          onReasonChange={setSelectedReason}
          onReset={handleResetFilters}
        />

        {/* Absence List */}
        {filteredAbsences.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedStatus || selectedReason
                  ? '検索条件に一致する不在記録がありません'
                  : '不在記録がありません'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedStatus || selectedReason
                  ? '検索条件を変更するか、新しい不在記録を登録してください。'
                  : '利用者様の外出や通院などの不在記録を管理できます。'}
              </p>
              <Button
                onClick={handleCreateAbsence}
                className="bg-carebase-blue hover:bg-carebase-blue-dark"
              >
                <CalendarPlus className="h-4 w-4 mr-2" />
                最初の不在記録を登録
              </Button>
            </CardContent>
          </Card>
        ) : (
          <AbsenceTimelineTable
            absences={filteredAbsences}
            residentId={residentId}
            residentName={residentName}
            onAbsenceUpdate={onAbsenceUpdate}
            onAbsenceDelete={handleDeleteAbsence}
            onEdit={handleEditAbsence}
          />
        )}

        {/* Modals */}
        <AbsenceModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleCreateSubmit}
          residentName={residentName}
          mode="create"
        />

        <AbsenceModal
          isOpen={isEditModalOpen}
          onClose={handleCloseModals}
          onSubmit={handleEditSubmit}
          absence={editingAbsence || undefined}
          residentName={residentName}
          mode="edit"
        />

        <GenericDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModals}
          onConfirm={handleDeleteConfirm}
          itemName={
            deletingAbsence
              ? `${format(new Date(deletingAbsence.startDateTime), 'MM/dd HH:mm', { locale: ja })}の不在記録`
              : ''
          }
          itemType="不在情報"
          isDeleting={isDeleting}
          error={deleteError}
        />
      </div>
    );
  }
);

AbsenceList.displayName = 'AbsenceList';
